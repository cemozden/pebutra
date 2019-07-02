import { YAMLConfigManager } from "../configmanagement/YAMLConfigManager";
import { LoginValidation } from "../validations/LoginValidation";
import { BrowserWindow } from "electron";
import { User } from "../models/User";
import { ipcMain } from "electron";

const configManager = new YAMLConfigManager();

export function LoginEvent(io : any, mainWindow : BrowserWindow) {

    io.of('/login').on('connection', (socket : any) => {
        console.log('Socket.IO /login connection successful.');
        
        socket.on('disconnect', () => {
            console.log('Socket.IO disconnected.');
        });

        socket.on('languageChanged', (langAlias : string) => {
            const language = configManager.loadLanguage(langAlias);
            const pebutraSettings = configManager.getPebutraSettings();

            pebutraSettings.language = langAlias;
            configManager.writePebutraSettings(pebutraSettings);

            socket.emit('setupLanguage', language);
            console.log(`Language Changed to ${language.fullName}`);
        });

        ipcMain.on('performLogin', (event : any, user : User) => {
            mainWindow.loadURL(`${process.env.EXPRESS_URL}/main`);
        });

        ipcMain.on('validateLoginForm', (event : any, user : User) => {
            const loginValidation = LoginValidation(user);
            const validationResults = loginValidation.validateAll();
            const failedValidations = validationResults.filter((vr) => !vr.valid);
            
            if (failedValidations.length > 0) event.sender.send('loginValidationResult', {validAll : false, validationResults : validationResults}) ; //socket.emit('loginValidationResult', {validAll : false, validationResults : validationResults});
            else event.sender.send('loginValidationResult', {validAll : true, validationResults : []});
            
        });

    });

};
