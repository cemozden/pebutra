'use strict'

const YAMLConfigManager = require('../configmanagement/YAMLConfigManager');
const LoginValidation = require('../validations/LoginValidation.js');

const configManager = new YAMLConfigManager();

module.exports = (io, mainWindow) => {

    io.of('/login').on('connection', (socket) => {
        console.log('Socket.IO /login connection successful.');
        
        socket.on('disconnect', () => {
            console.log('Socket.IO disconnected.');
        });

        socket.on('languageChanged', (langAlias) => {
            const language = configManager.loadLanguage(langAlias);
            const pebutraSettings = configManager.getPebutraSettings();

            pebutraSettings.language = langAlias;
            configManager.writePebutraSettings(pebutraSettings);

            socket.emit('setupLanguage', language);
            console.log(`Language Changed to ${language.fullName}`);
        });

        socket.on('performLogin', (user) => {
            console.log('Should be fine!');
            mainWindow.loadURL(`${process.env.EXPRESS_URL}/main`);
        });

        socket.on('validateLoginForm', (user) => {
            const loginValidation = LoginValidation(user);
            const validationResults = loginValidation.validateAll();
            const failedValidations = validationResults.filter((vr) => !vr.valid);

            if (failedValidations.length > 0) socket.emit('loginValidationResult', {validAll : false, validationResults : validationResults});
            else socket.emit('loginValidationResult', {validAll : true, validationResults : []});
            
        });

    });

};

