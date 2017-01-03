import React from 'react';
import { Router, Route } from 'react-router';
import App from './containers/App';
import Home from './components/Home';
import About from './components/About';

/**
 * The React Routes for both the server and the client.
 */
module.exports = (
  <Router>
		<Route component={App}>
				<Route path="/" component={Home} />
				<Route path="/about" component={About} />
		</Route>
	</Router>
);
