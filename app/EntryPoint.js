'use strict'

process.env.CONFIG_DIR_PATH = `${process.env.PWD}/conf/`;
process.env.LANGUAGES_FOLDER = `${process.env.PWD}/conf/languages/`;
process.env.TESTS_DIR_PATH = `${process.env.PWD}/tests/`;
process.env.APPLICATION_PORT = 3000;
process.env.EXPRESS_URL = `http://localhost:${process.env.APPLICATION_PORT}/`;

const { app, BrowserWindow, dialog } = require('electron');
const express = require('express');
const express_app = express();
const mustacheExpress = require('mustache-express');
const http = require('http').Server(express_app);
const io = require('socket.io')(http);
const morgan = require('morgan');

const InitRoutes = require('./routes/InitRoutes');
const InitSockets = require('./sockets/InitSockets');

const YAMLConfigManager = require('./configmanagement/YAMLConfigManager');

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
            detail: error.toString(),
        };
        dialog.showMessageBox(null, options);
        process.exit(-1);
    }

    // Initialize the express routings by providing the default system language.
    InitRoutes(express_app, systemLanguage);
    
    // Initialize application sockets
    InitSockets(io);
    

    let mainWindow = new BrowserWindow({
        width: 950,
        height: 600,
        acceptFirstMouse: true,
        //skipTaskbar: true,
        webPreferences: {
            enableRemoteModule: false
        },
        show: false
    });

    mainWindow.loadURL(process.env.EXPRESS_URL);
    //mainWindow.setMenuBarVisibility(false);
    mainWindow.on('closed', () => mainWindow = null);
    mainWindow.on('ready-to-show', () => {
        mainWindow.show();
        mainWindow.focus();
    });
    
}

http.listen(process.env.APPLICATION_PORT, () => { console.log(`ExpressJS started. URL: ::1:${process.env.APPLICATION_PORT}`) });
app.on('ready', EntryPoint);