import { User } from "../models/User";
import { FormValidation } from "./Validation";
import { YAMLConfigManager } from "../configmanagement/YAMLConfigManager";
import { MINIMUM_PASSWORD_LENGTH } from "./ValidationConstants";

export function AddUserValidation(validationObject : User) {
    const formValidation = new FormValidation<User>(validationObject);
    const configManager =new YAMLConfigManager();
    const language = configManager.getDefaultLanguage();

    formValidation.addOrUpdateValidation('username', vo => {
        
        if (vo.username === undefined || vo.username === '') 
            return { validationName : 'username', valid : false, message : language.validation.addUser.nameEmpty };

        if (vo.username.match('[^a-zA-Z.]') !== null)
        return { validationName : 'username', valid : false, message : language.validation.addUser.usernameSpecialCharacters };

        return {validationName : 'username', valid : true, message: 'OK'};
    });

    formValidation.addOrUpdateValidation('password', vo => {
        
        if (vo.password === undefined || vo.password === '') 
            return { validationName : 'password', valid : false, message : language.validation.addUser.passwordEmpty };

        if (vo.password.length < MINIMUM_PASSWORD_LENGTH) {
            const passwordLengthErrorMessage = language.validation.login.passwordLengthLimit.replace('${minPasswordLength}', MINIMUM_PASSWORD_LENGTH);
            return { validationName : 'password', valid : false, message : passwordLengthErrorMessage };
        }

        return {validationName : 'password', valid : true, message: 'OK'};
    });

    formValidation.addOrUpdateValidation('name', vo => {
        
        if (vo.name === undefined || vo.name === '')
            return { validationName : 'name', valid : false, message : language.validation.addUser.nameEmpty };

        return {validationName : 'name', valid : true, message: 'OK'};
    });

    formValidation.addOrUpdateValidation('surname', vo => {
        
        if (vo.surname === undefined || vo.surname === '') 
            return { validationName : 'surname', valid : false, message : language.validation.addUser.surnameEmpty };

        return {validationName : 'surname', valid : true, message: 'OK'};
    });

    formValidation.addOrUpdateValidation('emailAddress', vo => {
        
        if (vo.emailAddress === undefined || vo.emailAddress === '') 
            return { validationName : 'emailAddress', valid : false, message : language.validation.addUser.emailAddressEmpty };
        
        // Check whether e-mail address is a valid address.
        if (vo.emailAddress.match("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$") == null) {
            const message = language.validation.addUser.emailAddressNotValid.replace('${emailAddress}', vo.emailAddress);
            return { validationName : 'emailAddress', valid : false, message : message };
        }

        return {validationName : 'emailAddress', valid : true, message: 'OK'};
    });

    return formValidation;
}