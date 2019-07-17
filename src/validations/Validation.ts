 export interface ValidationResult {
     readonly validationName : string
     readonly valid : boolean
     readonly message : string
 }

 export class FormValidation<T> {

     private _validationObject : T;
     private readonly validationProcessors : Map<string, (validationObject : T) => Promise<ValidationResult>> = 
                 new Map<string, (validationObject : T) => Promise<ValidationResult>>();
 
     constructor(validationObject : T) {
         this.validationObject = validationObject;
     }
 
     set validationObject(newValidationObject : T) {
         this._validationObject = newValidationObject;
     }
 
     get validationObject() : T {
         return this._validationObject;
     }
     
     /**
      * 
      */
     addOrUpdateValidation(name : string, validationFunction : (validationObject : T) => Promise<ValidationResult>) {
         this.validationProcessors.set(name, validationFunction);
     }
 
     getValidationNames() : string[] {
         return Array.from(this.validationProcessors.keys());
     }
 
     getValidationCount() : number {
         return this.validationProcessors.size;
     }
 
     isValidationExist(name : string) : boolean {
         return this.validationProcessors.has(name);
     }
 
     removeValidation(name : string) {
         this.validationProcessors.delete(name);
     }
 
     /**
      * 
      * @param {string} name
      * @returns {ValidationResult} 
      */
     validate(name : string) : Promise<ValidationResult> {
         return this.validationProcessors.get(name)(this.validationObject);
     }
 
     async validateAll() : Promise<ValidationResult[]> {
         const validationNames = this.validationProcessors.keys();
         const validationResults : ValidationResult[] = [];
         
         for (const name of validationNames)
            validationResults.push(await this.validationProcessors.get(name)(this.validationObject));
         
         return validationResults;
     }
 
 }