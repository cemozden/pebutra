'use strict'
const {app, BrowserWindow} = require('electron');
const express = require('express');
const express_app = express();
const mustacheExpress = require('mustache-express');
const http = require('http').Server(express_app);
const io = require('socket.io')(http);
const path = require('path');
const url = require('url');
const morgan = require('morgan');

const PORT = 3000;
const VIEW_PATH = __dirname + '/windows';

let mainWindow = null;

express_app.engine('html', mustacheExpress());
express_app.use(express.static(VIEW_PATH));
express_app.set('view engine', 'html');
express_app.set('views', VIEW_PATH);
express_app.use(morgan('short'));

express_app.get('/', (req, res) => {
    res.render('login', { title: 'Pebutra, Your Personal Budget Tracker! | Login' });
});

io.on('connection', (socket) => {
    console.log('Socket.IO connection successful.');
    socket.on('disconnect', () => {
        console.log('Socket.IO disconnected.');
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

http.listen(PORT, () => { console.log(`ExpressJS started. URL: ::1:${PORT}`) });
app.on('ready', EntryPoint);