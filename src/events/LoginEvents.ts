import { YAMLConfigManager } from "../configmanagement/YAMLConfigManager";
import { LoginValidation } from "../validations/LoginValidation";
import { BrowserWindow } from "electron";
import { User } from "../models/User";
import { ipcMain } from "electron";
import { logger } from "../util/Logger";
import { UserServiceImpl } from "../services/UserService";
import { ValidationResult } from "../validations/Validation";

const configManager = new YAMLConfigManager();

export function LoginEvent(io : any, mainWindow : BrowserWindow) {

    io.of('/login').on('connection', (socket : any) => {
        logger.info('Socket.IO /login connection successful.');
        
        socket.on('disconnect', () => {
            logger.info('Socket.IO disconnected.');
        });

        socket.on('languageChanged', (langAlias : string) => {
            const language = configManager.loadLanguage(langAlias);
            const pebutraSettings = configManager.getPebutraSettings();

            pebutraSettings.language = langAlias;
            configManager.writePebutraSettings(pebutraSettings);

            socket.emit('setupLanguage', language);
            logger.info(`Language Changed to ${language.fullName}`);
        });

        ipcMain.on('performLogin', (event : any, user : User) => {

            const userService = new UserServiceImpl();
            userService.userExist(user)
                .then(userExist => {
                    // If the username or password is wrong, then send a message to the client.
                    if (!userExist) { 
                        const language = configManager.getDefaultLanguage();
                        event.sender.send('performLoginError', language.validation.login.loginFailed); 
                    }
                    else {
                        mainWindow.loadURL(`${process.env.EXPRESS_URL}/main`);
                    }

                })
                .catch((err : Error) => event.sender.send('performLoginError', err.message));

        });

        ipcMain.on('validateLoginForm', async (event : any, user : User) => {
            const loginValidation = LoginValidation(user);

            loginValidation.validateAll().then(validationResults => {
                const failedValidations = validationResults.filter((vr) => !vr.valid);
            
                if (failedValidations.length > 0) event.sender.send('loginValidationResult', {validAll : false, validationResults : validationResults});
                else event.sender.send('loginValidationResult', {validAll : true, validationResults : []});
            });
            
        });

    });

};

