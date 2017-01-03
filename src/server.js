/* global __PRODUCTION__ */

// import babelPolyfill from "babel-polyfill";
import { Server } from 'hapi';
import h2o2 from 'h2o2';
import inert from 'inert';
import React from 'react';
import Helmet from 'react-helmet';
import ReactDOM from 'react-dom/server';
import { RouterContext, match } from 'react-router';
import configureStore from './store.js';
import RadiumContainer from './containers/RadiumContainer';
import { Provider } from 'react-redux';
import routesContainer from './routes';
import api from './api';
let routes = routesContainer;

/**
 * Create Redux store, and get intitial state.
 */
const store = configureStore();
const initialState = store.getState();
/**
 * Start Hapi server
 */
const envset = {
	production: process.env.NODE_ENV === 'production',
};

const hostname = envset.production ? (process.env.HOSTNAME || process.env.HOSTNAME) : 'localhost';
const port = envset.production ? (process.env.PORT || process.env.PORT) : 8000;
const server = new Server();

server.connection({ host: hostname, port });

server.register(
	[
		h2o2,
		inert,
		// WebpackPlugin
	],
	(err) => {
		if (err) {
			throw err;
		}

		server.start(() => {
			console.info('==> ✅  Server is listening');
			console.info(`==> 🌎  Go to ${server.info.uri.toLowerCase()}`);
		});
	});


  /**
     * Attempt to serve static requests from the public folder.
     */
server.route({
	method: 'GET',
	path: '/{params*}',
	handler: {
		file: (request) => `static${request.path}`,
	},
});

    /**
     * Configure API routes
     */
// server.route(api);


/**
 * Catch dynamic requests here to fire-up React Router.
 */
server.ext('onPreResponse', (request, reply) => {
	if (typeof request.response.statusCode !== 'undefined') {
		return reply.continue();
	}

	match({ routes, location: request.path }, (error, redirectLocation, renderProps) => {
		if (redirectLocation) {
			reply.redirect(redirectLocation.pathname + redirectLocation.search);
			return;
		}
		if (error || !renderProps) {
			reply.continue();
			return;
		}

		const initialComponents = (
      <Provider store={store}>
        <RadiumContainer radiumConfig={{ userAgent: request.headers['user-agent'] }}>
          <RouterContext {...renderProps} />
        </RadiumContainer>
      </Provider>
	);

		ReactDOM.renderToString(initialComponents);

		const content = ReactDOM.renderToString(initialComponents);
		const head = Helmet.rewind();

		const webserver = __PRODUCTION__ ? '' : `//${hostname}:8080`;
		const markup = (
		`<!doctype html>
		<html lang="en-us">
      <head>
        ${head.title.toString()}
        ${head.meta.toString()}
        ${head.link.toString()}
      </head>
			<body>
				<div id="react-root">${content}</div>
				<script>
					window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}
					window.__UA__ = ${JSON.stringify(request.headers['user-agent'])}
				</script>
				<script src=${webserver}/dist/client.js></script>
			</body>
		</html>`
		);
		reply(markup);
	});
});

if (__DEV__) {
	if (module.hot) {
		console.log('[HMR] Waiting for server-side updates');

		module.hot.accept('./routes', () => {
			routes = require('./routes');
		});

		module.hot.addStatusHandler((status) => {
			if (status === 'abort') {
				setTimeout(() => process.exit(0), 0);
			}
		});
	}
}
