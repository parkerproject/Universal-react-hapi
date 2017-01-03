const Static = require('./handlers/static');

exports.register = (plugin, options, next) => {

  plugin.route([
    { method: 'GET', path: '/{params*}', config: Static.index },
  ]);

  next();
};

exports.register.attributes = {
  name: 'api',
};
