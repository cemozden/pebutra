'use strict'
import { LoginSocket } from "./LoginSocket";
import { BrowserWindow } from "electron";

export interface Components {
    io : any
    mainWindow : BrowserWindow
}

export function InitSockets(components : Components) {

    components.io.of('/').on('connection', (socket : any) => {
        socket.on('exitApplication', () => {
            process.exit(0);
        });
    });

    LoginSocket(components.io, components.mainWindow);
};
