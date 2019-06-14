'use strict'

const LoginSocket = require('./LoginSocket');

module.exports = (components) => {

    components.io.of('/').on('connection', (socket) => {
        socket.on('exitApplication', () => {
            process.exit(0);
        });
    });

    LoginSocket(components.io, components.mainWindow);
};
