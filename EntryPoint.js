'use strict'
const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

let mainWindow = null;

function getWindowPath(windowName) {
    return url.format({pathname : path.join(__dirname, 'src', 'main', 'windows', windowName), slashes : true, protocol : 'file:' });
}


function EntryPoint() {

    let mainWindow = new BrowserWindow({
            width : 950, 
            height : 600,
            acceptFirstMouse: true});
    
    mainWindow.loadURL(getWindowPath('login.html'));
    mainWindow.on('closed', () => mainWindow = null);
}

app.on('ready', EntryPoint);