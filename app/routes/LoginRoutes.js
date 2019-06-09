'use strict'

const YAMLConfigManager = require('../configmanagement/YAMLConfigManager');

module.exports = (app, systemLanguage) => {

    app.get('/', (req, res) => {
        const configManager = new YAMLConfigManager();

        res.render('login', { language : systemLanguage});
    });

};