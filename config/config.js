var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'nbl-registration-mongo'
    },
    port: 3000,
    db: 'mongodb://localhost/nbl-registration-mongo-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'nbl-registration-mongo'
    },
    port: 3000,
    db: 'mongodb://localhost/nbl-registration-mongo-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'nbl-registration-mongo'
    },
    port: process.env.PORT || 3000,
    db: process.env.MONGOLAB_URI || 'mongodb://localhost/siete-production'
  }
};

module.exports = config[env];
