import { ipcMain, BrowserWindow, dialog, MessageBoxOptions } from "electron";
import { User } from "../models/User";
import { UserServiceImpl } from "../services/UserService";
import { AddUserValidation } from "../validations/AddUserValidation";
import { YAMLConfigManager } from "../configmanagement/YAMLConfigManager";
import { logger } from "../util/Logger";

const configManager = new YAMLConfigManager();

export function UserEvents(io : any, mainWindow : BrowserWindow) {

    ipcMain.on('addUserProcess', (event : any, user : User) => {
        
        const addUserValidations = AddUserValidation(user).validateAll();

        addUserValidations.then(validationResults => {
            const failedValidations = validationResults.filter(vr => !vr.valid);
    
            if (failedValidations.length > 0) {
                event.sender.send('addUserValidationFailed', failedValidations);
                return;
            }

            const userService = new UserServiceImpl();
            const language = configManager.getDefaultLanguage();

            userService.addUser(user).then(userAdded => {
                if (userAdded) {
                    const message = language.addUserSuccessful.replace('${username}', user.username);
                    const dialogOptions : MessageBoxOptions = {
                        type: 'info',
                        buttons: ['Ok'],
                        title: 'Pebutra | ' + language.info,
                        message: message
                    };
                    logger.info(`[Add User] ${message}`);
                    dialog.showMessageBox(null, dialogOptions);
                    event.sender.send('closeModal');
                }
                else {
                    const message = language.addUserFailed.replace('${username}', user.username);
                    const dialogOptions : MessageBoxOptions = {
                        type: 'error',
                        buttons: ['Ok'],
                        title: 'Pebutra | ' + language.error,
                        message: message
                    };
                    logger.error(`[Add User] ${message}`);
                    dialog.showMessageBox(null, dialogOptions);
                }
            })
            .catch(reason => {
                logger.error(`[Add User Promise] Validation Failed: ${reason.toString()}`);
                const dialogOptions : MessageBoxOptions = {
                    type: 'error',
                    buttons: ['Ok'],
                    title: 'Pebutra | ' + language.error,
                    message: reason.toString()
                };
                dialog.showMessageBox(null, dialogOptions);
            });
        });
        
    });

}