import { YAMLConfigManager } from "../configmanagement/YAMLConfigManager";
import { LoginValidation } from "../validations/LoginValidation";
import { BrowserWindow } from "electron";
import { User } from "../models/User";

const configManager = new YAMLConfigManager();

export function LoginSocket(io : any, mainWindow : BrowserWindow) {

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

        socket.on('performLogin', (user : User) => {
            console.log('Should be fine!');
            mainWindow.loadURL(`${process.env.EXPRESS_URL}/main`);
        });

        socket.on('validateLoginForm', (user : User) => {
            const loginValidation = LoginValidation(user);
            const validationResults = loginValidation.validateAll();
            const failedValidations = validationResults.filter((vr) => !vr.valid);

            if (failedValidations.length > 0) socket.emit('loginValidationResult', {validAll : false, validationResults : validationResults});
            else socket.emit('loginValidationResult', {validAll : true, validationResults : []});
            
        });

    });

};

