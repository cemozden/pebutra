import { assert } from "chai";
import { FormValidation } from "../validations/FormValidation";

describe('FormValidation', () => {
    
    describe('#getValidationCount()', () => {
        it('should yield 0 when FormValidation is initialized', () => {
            const formValidation = new FormValidation({});

            assert.equal(formValidation.getValidationCount(), 0, 'Number of validations is not 0 when the object is initialized');
        });
    });

    describe('#addOrUpdateValidation(name, validationFunction)', () => {
        
        it('should increase the number of validation after adding a new validation', () => {
            const formValidation = new FormValidation({});
            assert.equal(formValidation.getValidationCount(), 0, 'Number of validations is not 0 when the object is initialized');
            formValidation.addOrUpdateValidation('test', (vo) => { return { validationName : 'test', valid : true, message : 'none' }});
            assert.equal(formValidation.getValidationCount(), 1, 'The number of validations did not increase after adding a new validation');
            
        });
    });

    describe('#isValidationExist(name)', () => {
        it('should yield false when there is no validation specified as the parameter', () => {
            const formValidation = new FormValidation({});
            assert.isFalse(formValidation.isValidationExist('no_validation'), 'isValidationExist() does not return false when it does not find corresponding validation');
        });

        it('should yield true when there is validation specified as the parameter', () => {
            const formValidation = new FormValidation({});
            formValidation.addOrUpdateValidation('test', (vo) => { return {validationName : 'test', valid : true, message : 'none'}});
            assert.ok(formValidation.isValidationExist('test'), 'isValidationExist() does not return true when it finds corresponding validation');
        });
    });

    describe('#getValidationNames()', () => {
        it('should return validation names when it is called', () => {
            const formValidation = new FormValidation({});

            formValidation.addOrUpdateValidation('test', (vo) => { return {validationName : 'test', valid : true, message : 'none'}});
            assert.ok(formValidation.getValidationNames().includes('test'), 'Validation name is not returned after adding a new validation. Validation name: test');

            formValidation.addOrUpdateValidation('test2', (vo) => { return {validationName : 'test2', valid : true, message : 'none'}});
            assert.ok(formValidation.getValidationNames().includes('test'), 'Validation name is not returned after adding a new validation Validation name: test');
            assert.ok(formValidation.getValidationNames().includes('test2'), 'Validation name is not returned after adding a new validation Validation name: test2');

        });
    });

    describe('#removeValidation(name)', () => {
        it('should remove the given validation', () => {
            const formValidation = new FormValidation({});

            formValidation.addOrUpdateValidation('test', (vo) => { return { validationName : 'test', valid : true, message : 'none' }});
            formValidation.removeValidation('test');

            assert.isFalse(formValidation.isValidationExist('test'), 'removeValidation(name) does not remove given validation!');
        });
        
        it('should remove the number of validations after removing a validation', () => {
            const formValidation = new FormValidation({});

            formValidation.addOrUpdateValidation('test', (vo) => { return { validationName : 'test', valid : true, message : 'none' }});
            assert.equal(formValidation.getValidationCount(), 1);
            
            formValidation.removeValidation('test');
            assert.equal(formValidation.getValidationCount(), 0);
        });
    });

    describe('#validateAll(name)', () => {
        it('should validate all validations', () => {
            const formValidation = new FormValidation({});

            formValidation.addOrUpdateValidation('test', (vo) => {return {validationName : 'test', valid : true, message : 'OK'}});
            formValidation.addOrUpdateValidation('test2', (vo) => {return {validationName : 'test', valid : false, message : 'Failed'}});

            const validationResults = formValidation.validateAll();
            assert.equal(validationResults.length, 2, `validateAll() does not validate all validations.`);

        });
    });

});