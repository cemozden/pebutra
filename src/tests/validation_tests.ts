import { assert } from "chai";
import { LoginValidation } from "../validations/LoginValidation";

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
});