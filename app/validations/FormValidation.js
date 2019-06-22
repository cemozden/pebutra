'use strict'

class FormValidation {

    constructor(validationObject) {
        this.validationProcessors = new Map();
        this.validationObject = validationObject;
    }
    
    /**
     * 
     * @param {string} name 
     * @param {(validationObject) => ValidationResult} validationFunction 
     */
    addOrUpdateValidation(name, validationFunction) {
        this.validationProcessors.set(name, validationFunction);
    }

    getValidationNames() {
        
        return Array.from(this.validationProcessors.keys());
    }

    getValidationCount() {
        return this.validationProcessors.size;
    }

    isValidationExist(name) {
        return this.validationProcessors.has(name);
    }

    removeValidation(name) {
        this.validationProcessors.delete(name);
    }

    /**
     * 
     * @param {string} name
     * @returns {ValidationResult} 
     */
    validate(name) {
        return this.validationProcessors.get(name)(this.validationObject);
    }

    validateAll() {
        const validationNames = this.validationProcessors.keys();
        const validationResults = [];
        
        for (const name of validationNames) {
            validationResults.push(this.validationProcessors.get(name)(this.validationObject));
        }

        return validationResults;
    }

}

module.exports = FormValidation;