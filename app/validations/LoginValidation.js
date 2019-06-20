'use strict'
const FormValidation = require('./FormValidation.js');
const ValidationConstants = require('./ValidationConstants.js');


module.exports = (validationObject) => {
    const formValidation = new FormValidation(validationObject);

    formValidation.addOrUpdateValidation('username', (validationObject) => {
        if (typeof validationObject.username !== 'string') return {validationName : 'username', valid : false, validationCode : 'val_UsernameNotString'} ;

        return {validationName : 'username', valid : true, validationCode : 'OK'};
    });

    formValidation.addOrUpdateValidation('password', (validationObject) => {
        if (typeof validationObject.password !== 'string') return {validationName : 'password', valid : false, validationCode : 'val_PasswordNotString'} ;
        if (validationObject.password.length < ValidationConstants.MINIMUM_PASSWORD_LENGTH) return {validationName : 'password', valid : false, validationCode : 'val_PasswordLengthLimit'};

        return {validationName : 'password', valid : true, validationCode : 'OK'};
    });

    return formValidation;
};