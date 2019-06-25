import { FormValidation } from "./FormValidation";
import {MINIMUM_PASSWORD_LENGTH, MINIMUM_USERNAME_LENGTH} from './ValidationConstants';
import { YAMLConfigManager } from "../configmanagement/YAMLConfigManager";
import { User } from "../models/User";

export function LoginValidation(validationObject : User) {
    const formValidation = new FormValidation<User>(validationObject);
    const configManager = new YAMLConfigManager();
    const language = configManager.getDefaultLanguage();

    formValidation.addOrUpdateValidation('username', (vo) => {
        if (vo.username.length < MINIMUM_USERNAME_LENGTH) 
            return {validationName : 'username', valid : false, message : language.val_UsernameEmpty}; 
        
        return {validationName : 'username', valid : true, message : 'OK'};
    });

    formValidation.addOrUpdateValidation('password', (vo) => {
        const passwordLengthErrorMessage = language.val_PasswordLengthLimit.replace('${minPasswordLength}', MINIMUM_PASSWORD_LENGTH);
        if (vo.password.length < MINIMUM_PASSWORD_LENGTH) 
            return {validationName : 'password', valid : false, message : passwordLengthErrorMessage};

        return {validationName : 'password', valid : true, message : 'OK'};
    });

    return formValidation;
};