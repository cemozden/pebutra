'use strict'

const YAMLConfigManager = require('../configmanagement/YAMLConfigManager');
const configManager = new YAMLConfigManager();

module.exports = (io) => {

    io.of('/login').on('connection', (socket) => {
        console.log('Socket.IO connection successful.');
        socket.on('disconnect', () => {
            console.log('Socket.IO disconnected.');
        });

        socket.on('languageChanged', (langAlias) => {
            const language = configManager.loadLanguage(langAlias);
            socket.emit('setupLanguage', language);
            console.log(`Language Changed to ${language.fullName}`);
        });

    });

};

