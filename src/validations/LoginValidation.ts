import { FormValidation, ValidationResult } from "./Validation";
import {MINIMUM_PASSWORD_LENGTH, MINIMUM_USERNAME_LENGTH} from './ValidationConstants';
import { YAMLConfigManager } from "../configmanagement/YAMLConfigManager";
import { User } from "../models/User";

export function LoginValidation(validationObject : User) {
    const formValidation = new FormValidation<User>(validationObject);
    const configManager = new YAMLConfigManager();
    const language = configManager.getDefaultLanguage();

    formValidation.addOrUpdateValidation('username', vo => {

        const usernameValidationPromise = new Promise<ValidationResult>((resolve, reject) => {
            if (vo.username.length < MINIMUM_USERNAME_LENGTH) 
                resolve({validationName : 'username', valid : false, message : language.validation.login.usernameEmpty}); 
        
            resolve({validationName : 'username', valid : true, message : 'OK'});
        });

        return usernameValidationPromise;

    });

    formValidation.addOrUpdateValidation('password', vo => {

        const passwordValidationPromise = new Promise<ValidationResult>((resolve, reject) => {
            const passwordLengthErrorMessage = language.validation.login.passwordLengthLimit.replace('${minPasswordLength}', MINIMUM_PASSWORD_LENGTH);
            
            if (vo.password.length < MINIMUM_PASSWORD_LENGTH) 
                resolve({validationName : 'password', valid : false, message : passwordLengthErrorMessage});

            resolve({validationName : 'password', valid : true, message : 'OK'});
        });

        return passwordValidationPromise;
    });

    return formValidation;
};