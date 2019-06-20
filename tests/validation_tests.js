'use strict'
const assert = require('assert');
const LoginValidation = require('../app/validations/LoginValidation.js');

describe('Form Validations', () => {
    describe('Login Validations', () => {
        const loginValidation = LoginValidation({username : undefined, password : undefined});
        it('should not validate when the username is not a string', () => {
           const validationResult = loginValidation.validate('username');
           assert.ok(!validationResult.valid, `Validation fails for checking whether the username is not a string"`);
        });

        it('should not validate when the password is not a string', () => {
            const validationResult = loginValidation.validate('password');
            assert.ok(!validationResult.valid, 'Validation fails for checking whether the password is not a string');
        });

        it('should not validate when the password length is less than 8', () => {
            loginValidation.setValidationObject({username : undefined, password : '123456'});
            const validationResult = loginValidation.validate('password');
            assert.ok(!validationResult.valid, 'Validation fails for checking whether the password length should not be less than 8');
        });

        it('should validate all', () => {
            loginValidation.setValidationObject({username : 'test', password : '12345678'});
            
            let validationResult = loginValidation.validateAll().filter((vr) => !vr.valid);
            const errorMessages = validationResult.map((vr) => vr.validationCode).join(', ');
            
            assert.equal(validationResult.length, 0, `All Validations did not succeed! Validation Error Codes: ${errorMessages}`);
        });

    });
});