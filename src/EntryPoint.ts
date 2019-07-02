import { app, BrowserWindow, dialog } from "electron";
import { Components } from "./events/InitEvents";
import { InitRoutes } from "./routes/InitRoutes";
import { InitEvents } from "./events/InitEvents";
import { YAMLConfigManager } from "./configmanagement/YAMLConfigManager";
import { logger } from "./util/Logger";
import * as path from "path";

import * as express from "express";
import * as mustacheExpress from "mustache-express";
import * as morgan from "morgan";

//=========================================================================================================
logger.info("Application started.");
process.env.APPLICATION_DIR = `${process.env.PWD}/dist`;
process.env.CONFIG_DIR_PATH = `${process.env.APPLICATION_DIR}/conf/`;
process.env.LANGUAGES_FOLDER = `${process.env.APPLICATION_DIR}/conf/languages/`;
process.env.TESTS_DIR_PATH = `${process.env.APPLICATION_DIR}/tests/`;
process.env.APPLICATION_PORT = '3000';
process.env.EXPRESS_URL = `http://localhost:${process.env.APPLICATION_PORT}`;

const express_app = express();
const http = require('http').Server(express_app);
const io = require('socket.io')(http);

const VIEW_PATH = __dirname + '/windows/';

express_app.engine('html', mustacheExpress());
express_app.use(express.static(VIEW_PATH));
express_app.set('view engine', 'html');
express_app.set('views', VIEW_PATH);
express_app.use(morgan('short'));

function EntryPoint() {

    let systemLanguage : any;
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
    
    let mainWindow = new BrowserWindow({
        width: 950,
        height: 600,
        acceptFirstMouse: true,
        show: false,
        icon : path.join(__dirname, 'windows/assets/img/window-icon.png')
    });

    // Initialize application sockets
    const socketComponents : Components = {
        io : io,
        mainWindow : mainWindow
    };

    InitEvents(socketComponents);

    mainWindow.loadURL(process.env.EXPRESS_URL);
    mainWindow.setMenuBarVisibility(false);
    mainWindow.on('closed', () => mainWindow = null);

    if (process.env.NODE_ENV === 'development')  mainWindow.webContents.openDevTools(); 

    mainWindow.on('ready-to-show', () => {
        mainWindow.show();
        mainWindow.focus();
    });
    
}

http.listen(process.env.APPLICATION_PORT, () => { console.log(`ExpressJS started. URL: ::1:${process.env.APPLICATION_PORT}`) });
app.on('ready', EntryPoint);