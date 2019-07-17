import { assert } from "chai";
import { LoginValidation } from "../validations/LoginValidation";
import { AddUserValidation } from "../validations/AddUserValidation";
import { User } from "../models/User";
import { ValidationResult } from "../validations/Validation";
import { connectionPool } from "../db/DbConnectionManager";

describe('Form Validations', () => {
    describe('Login Validations', () => {

        it('should not validate when the password length is less than 8', async () => {
            const loginValidation = LoginValidation({username : undefined, password : '123456'});
            const validationResult = await loginValidation.validate('password').then(vr => vr);
            assert.ok(!validationResult.valid, 'Validation fails for checking whether the password length should not be less than 8');
        });
        //TODO: Implement try -> catch method for promises
        it('should validate all', async () => {
            const loginValidation = LoginValidation({username : 'test', password : '123456789'});
            let validationResult : ValidationResult[] = [];
            loginValidation.validateAll().then(validationResult => {
                validationResult = validationResult.filter((vr) => !vr.valid);
                const errorMessages = validationResult.map((vr) => vr.message).join(', ');
                
                assert.equal(validationResult.length, 0, `All Validations did not succeed! Validation Error Codes: ${errorMessages}`);
            });
            
        });

    });

    describe('Add User Validations', () => {
        it('should not validate when fields are empty or undefined', async () => {
            let user : User = {
                userId : "",
                username : "",
                password : "",
            };
            let addUserValidation = AddUserValidation(user);

            let usernameValidation = await addUserValidation.validate('username').then(vr => vr);
            let passwordValidation = await addUserValidation.validate('password').then(vr => vr);
            let nameValidation = await addUserValidation.validate('name').then(vr => vr);
            let surnameValidation = await addUserValidation.validate('surname').then(vr => vr);
            let emailAddressValidation = await addUserValidation.validate('emailAddress').then(vr => vr);

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

            usernameValidation = await addUserValidation.validate('username').then(vr => vr);
            passwordValidation = await addUserValidation.validate('password').then(vr => vr);
            nameValidation = await addUserValidation.validate('name').then(vr => vr);
            surnameValidation = await addUserValidation.validate('surname').then(vr => vr);
            emailAddressValidation = await addUserValidation.validate('emailAddress').then(vr => vr);

            assert.isTrue(usernameValidation.valid, `The validation does not succeed when username is not empty or undefined. Expected: true, Actual: ${usernameValidation.valid}`);
            assert.isTrue(passwordValidation.valid, `The validation does not succeed when password is not empty or undefined. Expected: true, Actual: ${passwordValidation.valid}`);
            assert.isTrue(nameValidation.valid, `The validation does not succeed when name is not empty or undefined. Expected: true, Actual: ${nameValidation.valid}`);
            assert.isTrue(surnameValidation.valid, `The validation does not succeed when surname is not empty or undefined. Expected: true, Actual: ${surnameValidation.valid}`);
            assert.isTrue(emailAddressValidation.valid, `The validation does not succeed when emailAddress is not empty or undefined. Expected: true, Actual: ${emailAddressValidation.valid}`);

        });

        it('should not validate when the password length is less than MINIMUM_PASSWORD_LENGTH', async () => {
            const user : User = {
                userId : "",
                username : "test",
                password : "123456",
            };
            const addUserValidation = AddUserValidation(user);
            const passwordValidation = await addUserValidation.validate('password').then(vr => vr);

            assert.isFalse(passwordValidation.valid, `Validation failed while checking for minimum password length`);
        });

        it('should not validate when email address is not a valid e-mail address', async () => {
            const user : User = {
                username : '',
                password : '', 
                emailAddress : 'test'
            };

            const addUserValidation = AddUserValidation(user);
            const emailAddressValidation = await addUserValidation.validate('emailAddress').then(vr => vr);

            assert.isFalse(emailAddressValidation.valid, `The validation does not succeed when e-mail address is not a valid e-mail address`);

        });

        it('should not validate when username is not a valid username', async () => {
            const user : User = {
                username : 'test$[]',
                password : ''
            };

            const addUserValidation = AddUserValidation(user);
            const usernameValidation = await addUserValidation.validate('username').then(vr => vr);

            assert.isFalse(usernameValidation.valid, `The validation does not succeed when username is not a valid username`);

        });

        it('should not validate when username already exist', async () => {
            const user : User = {
                username : 'root',
                password : ''
            };

            const addUserValidation = AddUserValidation(user);
            const usernameValidation = await addUserValidation.validate('username').then(vr => vr);

            assert.isFalse(usernameValidation.valid, `The validation does not succeed when a given username already exist`);

        });

        it('should validate all', async () => {
            const user : User = {
                username : 'cem',
                emailAddress : 'cem@cemozden.com',
                name : 'Cem',
                surname : 'Ozden',
                password : '12345678'
            };

            const addUserValidation = AddUserValidation(user);
            let validationResult : ValidationResult[] = [];
            
            addUserValidation.validateAll().then(validationResult => {
                validationResult = validationResult.filter((vr) => !vr.valid);
            
                const errorMessages = validationResult.map((vr) => vr.message).join(', ');
                assert.equal(validationResult.length, 0, `All Validations did not succeed! Validation Error Codes: ${errorMessages}`);
            });

        });

    });

});