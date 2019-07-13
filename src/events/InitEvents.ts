'use strict'
import { LoginEvent } from "./LoginEvents";
import { BrowserWindow } from "electron";
import { ipcMain } from "electron";
import { UserEvents } from "./UserEvents";

export interface Components {
    io : any
    mainWindow : BrowserWindow
}

export function InitEvents(components : Components) {

    ipcMain.on('exitApplication', (event : any) => {
        process.exit(0);
    });
    
    LoginEvent(components.io, components.mainWindow);
    UserEvents(components.io, components.mainWindow);
};
