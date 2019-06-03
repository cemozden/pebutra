const assert = require('assert');
const fs = require('fs');
const YAML = require('js-yaml');

const ConfigUtil = require('../app/configparser/ConfigUtil');

describe('Configuration', () => {
    describe('conf folder', () => {
        it('should exist in the root path', () => {
           assert.ok(fs.existsSync(ConfigUtil.CONFIG_DIR_PATH));
        });
    });

    describe('settings.yaml', () => {
        it('should exist in the conf folder', () => assert.ok(fs.existsSync(ConfigUtil.CONFIG_DIR_PATH + '/settings.yaml')));
    });

    describe('Language Configurations', () => {
        it('should contain at least the english language configuration file',
            () => assert.ok(fs.existsSync(ConfigUtil.LANGUAGES_FOLDER + 'lang_en.yaml')));

        it('should contain requiredlanguagekeys.txt file to check the required keys',
            () => assert.ok(fs.existsSync(ConfigUtil.APPLICATION_PATH + '/tests/resources/requiredlanguagekeys.txt')));

        it('should contain all required language keys', () => {
            
            fs.readFile(ConfigUtil.APPLICATION_PATH + '/tests/resources/requiredlanguagekeys.txt','utf8', (err, data) => {
                const requiredLanguageKeys = data.split('\n');
  
                fs.readdir(ConfigUtil.LANGUAGES_FOLDER, 'utf8', (err, files) => {
                    files.forEach((file) => {
                        const languageFilePath = ConfigUtil.LANGUAGES_FOLDER + file;        
                        const languageFileObject = YAML.safeLoad(fs.readFileSync(languageFilePath));
                        
                        requiredLanguageKeys.forEach((requiredKey) => {
                            
                            assert.ok(languageFileObject.hasOwnProperty(requiredKey));
                            //assert.equal(languageFileObject.hasOwnProperty(requiredKey), true);
                        });
                    
                    });  
                });

            });

        });

    });
});