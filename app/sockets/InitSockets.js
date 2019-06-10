'use strict'

const LoginSocket = require('./LoginSocket');

module.exports = (io) => {
    LoginSocket(io);
};
