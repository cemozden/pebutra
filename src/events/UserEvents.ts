import { ipcMain, BrowserWindow } from "electron";
import { User } from "../models/User";

export function UserEvents(io : any, mainWindow : BrowserWindow) {

    ipcMain.on('addUserProcess', (event : any, user : User) => {
        //TODO: If the validation succeeds then add the user send addUserSuccessful message
        // If not then send validation error message.
    });

}