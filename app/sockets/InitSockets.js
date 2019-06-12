'use strict'

const LoginSocket = require('./LoginSocket');

module.exports = (io) => {

    io.of('/').on('connection', (socket) => {
        socket.on('exitApplication', () => {
            process.exit(0);
        });
    });

    LoginSocket(io);
};
