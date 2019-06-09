'use strict'
const LoginRoutes = require('./LoginRoutes');

module.exports = (app, systemLanguage) => {
    LoginRoutes(app, systemLanguage);
};