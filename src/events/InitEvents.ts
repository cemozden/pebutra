'use strict'
import { LoginEvent } from "./LoginEvents";
import { BrowserWindow } from "electron";
import { ipcMain } from "electron";

export interface Components {
    io : any
    mainWindow : BrowserWindow
}

export function InitEvents(components : Components) {

    ipcMain.on('exitApplication', (event : any) => {
        process.exit(0);
    });
    
    LoginEvent(components.io, components.mainWindow);
};
