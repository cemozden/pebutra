'use strict'
const { app, BrowserWindow, dialog } = require('electron');
const express = require('express');
const express_app = express();
const mustacheExpress = require('mustache-express');
const http = require('http').Server(express_app);
const io = require('socket.io')(http);
const morgan = require('morgan');

const InitRoutes = require('./routes/InitRoutes');
const YAMLConfigManager = require('./configmanagement/YAMLConfigManager');

const HTTP_SERVER_PORT = 3000;
const VIEW_PATH = __dirname + '/windows/';

express_app.engine('html', mustacheExpress());
express_app.use(express.static(VIEW_PATH));
express_app.set('view engine', 'html');
express_app.set('views', VIEW_PATH);
express_app.use(morgan('short'));


function EntryPoint() {

    let systemLanguage;
    const configManager = new YAMLConfigManager();

    try {
        const pebutraSettings = configManager.getPebutraSettings();
        systemLanguage = configManager.loadLanguage(pebutraSettings.language);

        console.log(`System Language: ${systemLanguage.fullName}`);
    }
    catch (error) {
        const options = {
            type: 'error',
            buttons: ['Ok'],
            title: 'Pebutra | Error',
            message: `An error occured while getting Pebutra settings!`,
            detail: error,
        };
        dialog.showMessageBox(null, options);
        process.exit(-1);
    }

    // Initialize the express routings by providing the default system language.
    InitRoutes(express_app, systemLanguage);

    io.on('connection', (socket) => {
        console.log('Socket.IO connection successful.');
        socket.on('disconnect', () => {
            console.log('Socket.IO disconnected.');
        });
    
        socket.on('languageChanged', (langAlias) => {
            const language = configManager.loadLanguage(langAlias);
            io.sockets.emit('setupLanguage', language);
            console.log(`Language Changed to ${language.fullName}`);
        });
    
    });

    let mainWindow = new BrowserWindow({
        width: 950,
        height: 600,
        acceptFirstMouse: true,
        //skipTaskbar: true,
        show: false
    });

    mainWindow.loadURL('http://localhost:3000/');
    //mainWindow.setMenuBarVisibility(false);
    mainWindow.on('closed', () => mainWindow = null);
    mainWindow.on('ready-to-show', () => {
        mainWindow.show();
        mainWindow.focus();
    });
    
}

http.listen(HTTP_SERVER_PORT, () => { console.log(`ExpressJS started. URL: ::1:${HTTP_SERVER_PORT}`) });
app.on('ready', EntryPoint);