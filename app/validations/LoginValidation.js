'use strict'

const FormValidation = require('./FormValidation.js');
const ValidationConstants = require('./ValidationConstants.js');
const YAMLConfigManager = require('../configmanagement/YAMLConfigManager.js');

module.exports = (validationObject) => {
    const formValidation = new FormValidation(validationObject);
    const configManager = new YAMLConfigManager();
    const language = configManager.getDefaultLanguage();

    formValidation.addOrUpdateValidation('username', (vo) => {
        if (typeof validationObject.username !== 'string') return {validationName : 'username', valid : false, message : language.val_UsernameNotString} ;
        if (vo.username.length < ValidationConstants.MINIMUM_USERNAME_LENGTH) return {validationName : 'username', valid : false, message : language.val_UsernameEmpty}; 
        
        return {validationName : 'username', valid : true, message : 'OK'};
    });

    formValidation.addOrUpdateValidation('password', (vo) => {
        const passwordLengthErrorMessage = language.val_PasswordLengthLimit.replace('${minPasswordLength}', ValidationConstants.MINIMUM_PASSWORD_LENGTH);
        if (typeof validationObject.password !== 'string') return {validationName : 'password', valid : false, message : language.val_PasswordNotString};
        if (validationObject.password.length < ValidationConstants.MINIMUM_PASSWORD_LENGTH) return {validationName : 'password', valid : false, message : passwordLengthErrorMessage};

        return {validationName : 'password', valid : true, message : 'OK'};
    });

    return formValidation;
};