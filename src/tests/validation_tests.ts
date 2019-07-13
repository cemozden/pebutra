import { assert } from "chai";
import { LoginValidation } from "../validations/LoginValidation";
import { AddUserValidation } from "../validations/AddUserValidation";
import { User } from "../models/User";

describe('Form Validations', () => {
    describe('Login Validations', () => {

        it('should not validate when the password length is less than 8', () => {
            const loginValidation = LoginValidation({username : undefined, password : '123456'});
            const validationResult = loginValidation.validate('password');
            assert.ok(!validationResult.valid, 'Validation fails for checking whether the password length should not be less than 8');
        });

        it('should validate all', () => {
            const loginValidation = LoginValidation({username : 'test', password : '123456789'});

            let validationResult = loginValidation.validateAll().filter((vr) => !vr.valid);
            const errorMessages = validationResult.map((vr) => vr.message).join(', ');
            
            assert.equal(validationResult.length, 0, `All Validations did not succeed! Validation Error Codes: ${errorMessages}`);
        });

    });

    describe('Add User Validations', () => {
        it('should not validate when fields are empty or undefined', () => {
            let user : User = {
                userId : "",
                username : "",
                password : "",
            };
            let addUserValidation = AddUserValidation(user);

            let usernameValidation = addUserValidation.validate('username');
            let passwordValidation = addUserValidation.validate('password');
            let nameValidation = addUserValidation.validate('name');
            let surnameValidation = addUserValidation.validate('surname');
            let emailAddressValidation = addUserValidation.validate('emailAddress');

            assert.isFalse(usernameValidation.valid, `The validation does not succeed when username is empty or undefined. Expected: false, Actual: ${usernameValidation.valid}`);
            assert.isFalse(passwordValidation.valid, `The validation does not succeed when password is empty or undefined. Expected: false, Actual: ${passwordValidation.valid}`);
            assert.isFalse(nameValidation.valid, `The validation does not succeed when name is empty or undefined. Expected: false, Actual: ${nameValidation.valid}`);
            assert.isFalse(surnameValidation.valid, `The validation does not succeed when surname is empty or undefined. Expected: false, Actual: ${surnameValidation.valid}`);
            assert.isFalse(emailAddressValidation.valid, `The validation does not succeed when emailAddress is empty or undefined. Expected: false, Actual: ${emailAddressValidation.valid}`);
            
             user = {
                userId : "test",
                username : "test",
                password : "test1234",
                emailAddress : 'test@test.com',
                name : 'test',
                surname :'test'
            };
            addUserValidation = AddUserValidation(user);

            usernameValidation = addUserValidation.validate('username');
            passwordValidation = addUserValidation.validate('password');
            nameValidation = addUserValidation.validate('name');
            surnameValidation = addUserValidation.validate('surname');
            emailAddressValidation = addUserValidation.validate('emailAddress');

            assert.isTrue(usernameValidation.valid, `The validation does not succeed when username is not empty or undefined. Expected: true, Actual: ${usernameValidation.valid}`);
            assert.isTrue(passwordValidation.valid, `The validation does not succeed when password is not empty or undefined. Expected: true, Actual: ${passwordValidation.valid}`);
            assert.isTrue(nameValidation.valid, `The validation does not succeed when name is not empty or undefined. Expected: true, Actual: ${nameValidation.valid}`);
            assert.isTrue(surnameValidation.valid, `The validation does not succeed when surname is not empty or undefined. Expected: true, Actual: ${surnameValidation.valid}`);
            assert.isTrue(emailAddressValidation.valid, `The validation does not succeed when emailAddress is not empty or undefined. Expected: true, Actual: ${emailAddressValidation.valid}`);

        });

        it('should not validate when the password length is less than MINIMUM_PASSWORD_LENGTH', () => {
            const user : User = {
                userId : "",
                username : "test",
                password : "123456",
            };
            const addUserValidation = AddUserValidation(user);
            const passwordValidation = addUserValidation.validate('password');

            assert.isFalse(passwordValidation.valid, `Validation failed while checking for minimum password length`);
        });

        it('should not validate when email address is not a valid e-mail address', () => {
            const user : User = {
                username : '',
                password : '', 
                emailAddress : 'test'
            };

            const addUserValidation = AddUserValidation(user);
            const emailAddressValidation = addUserValidation.validate('emailAddress');

            assert.isFalse(emailAddressValidation.valid, `The validation does not succeed when e-mail address is not a valid e-mail address`);

        });

        it('should not validate when username is not a valid username', () => {
            const user : User = {
                username : 'test$[]',
                password : ''
            };

            const addUserValidation = AddUserValidation(user);
            const emailAddressValidation = addUserValidation.validate('username');

            assert.isFalse(emailAddressValidation.valid, `The validation does not succeed when username is not a valid username`);

        });

        it('should validate all', () => {
            const user : User = {
                username : 'cem',
                emailAddress : 'cem@cemozden.com',
                name : 'Cem',
                surname : 'Ozden',
                password : '12345678'
            };

            const addUserValidation = AddUserValidation(user);
           
            const validationResult = addUserValidation.validateAll().filter((vr) => !vr.valid);
            const errorMessages = validationResult.map((vr) => vr.message).join(', ');
            
            assert.equal(validationResult.length, 0, `All Validations did not succeed! Validation Error Codes: ${errorMessages}`);
        });

    });

});