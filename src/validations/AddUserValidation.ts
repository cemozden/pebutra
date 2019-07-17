import { User } from "../models/User";
import { FormValidation, ValidationResult } from "./Validation";
import { YAMLConfigManager } from "../configmanagement/YAMLConfigManager";
import { MINIMUM_PASSWORD_LENGTH } from "./ValidationConstants";
import { UserServiceImpl } from "../services/UserService";

export function AddUserValidation(validationObject : User) {
    const formValidation = new FormValidation<User>(validationObject);
    const configManager =new YAMLConfigManager();
    const language = configManager.getDefaultLanguage();
    const userService = new UserServiceImpl();

    formValidation.addOrUpdateValidation('username', async vo => {
        //TODO: Check whether a user exist with the given username.
        const usernameValidationPromise = new Promise<ValidationResult>(async (resolve, reject) => {
            if (vo.username === undefined || vo.username === '') 
            resolve({ validationName : 'username', valid : false, message : language.validation.addUser.nameEmpty });

            if (vo.username.match('[^a-zA-Z.]') !== null)
                resolve({ validationName : 'username', valid : false, message : language.validation.addUser.usernameSpecialCharacters });

            const userExist = await userService.userExist(vo, true);
            
            if (userExist)
                resolve({ validationName : 'username', valid : false, message : language.validation.addUser.usernameExist.replace('${username}', vo.username) });
            
            resolve({validationName : 'username', valid : true, message: 'OK'});
        });

        return usernameValidationPromise;

    });

    formValidation.addOrUpdateValidation('password', vo => {
        
        const passwordValidationPromise = new Promise<ValidationResult>((resolve, reject) => {
            
            if (vo.password === undefined || vo.password === '') 
                resolve({ validationName : 'password', valid : false, message : language.validation.addUser.passwordEmpty });

            if (vo.password.length < MINIMUM_PASSWORD_LENGTH) {
                const passwordLengthErrorMessage = language.validation.login.passwordLengthLimit.replace('${minPasswordLength}', MINIMUM_PASSWORD_LENGTH);
                resolve({ validationName : 'password', valid : false, message : passwordLengthErrorMessage });
            }

            resolve({validationName : 'password', valid : true, message: 'OK'});
        });

        return passwordValidationPromise;
    });

    formValidation.addOrUpdateValidation('name', vo => {
        
        const nameValidationPromise = new Promise<ValidationResult>((resolve, reject) => {
            if (vo.name === undefined || vo.name === '')
                resolve({ validationName : 'name', valid : false, message : language.validation.addUser.nameEmpty });

            resolve({validationName : 'name', valid : true, message: 'OK'});
        });

        return nameValidationPromise;
    });

    formValidation.addOrUpdateValidation('surname', vo => {
        const surnameValidationPromise = new Promise<ValidationResult>((resolve, reject) => {
            if (vo.surname === undefined || vo.surname === '') 
                resolve({ validationName : 'surname', valid : false, message : language.validation.addUser.surnameEmpty });

            resolve({validationName : 'surname', valid : true, message: 'OK'});
        });
        
        return surnameValidationPromise;
    });

    formValidation.addOrUpdateValidation('emailAddress', vo => {
        const emailAddressValidationPromise = new Promise<ValidationResult>((resolve, reject) => {
            if (vo.emailAddress === undefined || vo.emailAddress === '') 
                resolve({ validationName : 'emailAddress', valid : false, message : language.validation.addUser.emailAddressEmpty });
        
            // Check whether e-mail address is a valid address.
            if (vo.emailAddress.match("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$") == null) {
                const message = language.validation.addUser.emailAddressNotValid.replace('${emailAddress}', vo.emailAddress);
                resolve({ validationName : 'emailAddress', valid : false, message : message });
            }

            resolve({validationName : 'emailAddress', valid : true, message: 'OK'});
        });

        return emailAddressValidationPromise;
    });

    return formValidation;
}