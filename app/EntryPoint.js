'use strict'
const {app, BrowserWindow} = require('electron');
const express = require('express');
const express_app = express();
const mustacheExpress = require('mustache-express');
const http = require('http').Server(express_app);
const io = require('socket.io')(http);
const morgan = require('morgan');
const InitRoutes = require('./routes/InitRoutes');

const HTTP_SERVER_PORT = 3000;
const VIEW_PATH = __dirname + '/windows';

let mainWindow = null;
let systemLanguage = null; 

express_app.engine('html', mustacheExpress());
express_app.use(express.static(VIEW_PATH));
express_app.set('view engine', 'html');
express_app.set('views', VIEW_PATH);
express_app.use(morgan('short'));

InitRoutes(express_app);


io.on('connection', (socket) => {
    console.log('Socket.IO connection successful.');
    socket.on('disconnect', () => {
        console.log('Socket.IO disconnected.');
    });

    socket.on('languageChanged', (langAlias) => {
        const YAMLConfigManager = require('./configmanagement/YAMLConfigManager');
        const configManager = new YAMLConfigManager();
        systemLanguage = configManager.loadLanguage(langAlias);
        socket.emit('setupLanguage', systemLanguage);

        console.log(`Language Changed to ${systemLanguage.fullName}`);
    });

});

function EntryPoint() {

    mainWindow = new BrowserWindow({
            width : 950, 
            height : 600,
            acceptFirstMouse: true,
            show: false});
    
    mainWindow.loadURL('http://localhost:3000/');
    mainWindow.on('closed', () => mainWindow = null);
    mainWindow.on('ready-to-show', () => {
        mainWindow.show();
        mainWindow.focus();
    });
}
http.listen(HTTP_SERVER_PORT, () => { console.log(`ExpressJS started. URL: ::1:${HTTP_SERVER_PORT}`) });
app.on('ready', EntryPoint);