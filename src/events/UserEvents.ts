import { ipcMain, BrowserWindow, dialog, MessageBoxOptions } from "electron";
import { User } from "../models/User";
import { UserServiceImpl } from "../services/UserService";
import { AddUserValidation } from "../validations/AddUserValidation";
import { YAMLConfigManager } from "../configmanagement/YAMLConfigManager";

const configManager = new YAMLConfigManager();

export function UserEvents(io : any, mainWindow : BrowserWindow) {

    ipcMain.on('addUserProcess', (event : any, user : User) => {
        
        const validationResults = AddUserValidation(user).validateAll();
        const failedValidations = validationResults.filter((vr) => !vr.valid);
    
        if (failedValidations.length > 0) {
            event.sender.send('addUserValidationFailed', failedValidations);
            return;
        }

        const userService = new UserServiceImpl();
        const language = configManager.getDefaultLanguage();

        userService.addUser(user).then((userAdded) => {
            if (userAdded) {
                const dialogOptions : MessageBoxOptions = {
                    type: 'info',
                    buttons: ['Ok'],
                    title: 'Pebutra | ' + language.info,
                    message: language.addUserSuccessful.replace('${username}', user.username)
                };
                dialog.showMessageBox(null, dialogOptions);
                event.sender.send('closeModal');
            }
            else {
                const dialogOptions : MessageBoxOptions = {
                    type: 'error',
                    buttons: ['Ok'],
                    title: 'Pebutra | ' + language.error,
                    message: language.addUserFailed.replace('${username}', user.username)
                };
                dialog.showMessageBox(null, dialogOptions);
            }
        })
        .catch((reason) => {
            const dialogOptions : MessageBoxOptions = {
                type: 'error',
                buttons: ['Ok'],
                title: 'Pebutra | ' + language.error,
                message: reason.toString()
            };
            dialog.showMessageBox(null, dialogOptions);
        });
        
    
    });

}