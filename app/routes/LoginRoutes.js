'use strict'

const YAMLConfigManager = require('../configmanagement/YAMLConfigManager');

module.exports = (app, systemLanguage) => {

    app.get('/', (req, res) => {
        const configManager = new YAMLConfigManager();
        
        const availableLanguages = configManager.getAvailableLanguagesInfo();
        let optionOutput = '';
        
        availableLanguages.forEach((al) => {
            let selected = '';
            if (al.alias === configManager.getPebutraSettings().language) selected = 'selected';
            optionOutput = optionOutput + `<option value="${al.alias}" ${selected}>${al.fullName}</option>`;
        });
        
        res.render('login', { language : systemLanguage, languageOptions : optionOutput});
    });

};