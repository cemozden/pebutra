'use strict'
const assert = require('assert');
const fs = require('fs');
const YAML = require('js-yaml');

const ConfigUtil = require('../app/configmanagement/ConfigUtil');
const YAMLConfigManager = require('../app/configmanagement/YAMLConfigManager');

describe('Configuration', () => {
    describe('conf folder', () => {
        it('should exist in the root path', () => {
           assert.ok(fs.existsSync(ConfigUtil.CONFIG_DIR_PATH), `The conf folder cannot be found in the directory ${ConfigUtil.CONFIG_DIR_PATH}`);
        });
    });

    // Write tests that will validate settings.yaml file such as language is available etc.
    describe('settings.yaml', () => {
        it('should exist in the conf folder', () => {
            const settingsFilePath = `${ConfigUtil.CONFIG_DIR_PATH}/settings.yaml`;
            assert.ok(fs.existsSync(settingsFilePath), 
                    `The settings.yaml file cannot be found in the path: ${settingsFilePath}`)});
    });

    describe('db_conf.yaml', () => {
        it('should exist in the conf folder', () => {
            const settingsFilePath = `${ConfigUtil.CONFIG_DIR_PATH}/db_conf.yaml`;
            assert.ok(fs.existsSync(settingsFilePath), 
                    `The db_conf.yaml file cannot be found in the path: ${settingsFilePath}`)});
    });

    describe('Language Configurations', () => {
        it('should contain at least the english language configuration file',
            () => {
                const langEnFilePath = `${ConfigUtil.LANGUAGES_FOLDER}/lang_en.yaml`;
                assert.ok(fs.existsSync(langEnFilePath), `The english language file cannot be found in the path: ${langEnFilePath}`)
            });

        it('should contain requiredlanguagekeys.txt file to check the required keys',
            () => {
                const requiredLanguageKeysFilePath = `${ConfigUtil.TESTS_DIR_PATH}/resources/requiredlanguagekeys.txt`;
                assert.ok(fs.existsSync(requiredLanguageKeysFilePath));
        });

        it('should contain all required language keys', () => {
            
            fs.readFile(`${ConfigUtil.TESTS_DIR_PATH}resources/requiredlanguagekeys.txt`,'utf8', (err, data) => {
                const requiredLanguageKeys = data.split('\n');
  
                fs.readdir(ConfigUtil.LANGUAGES_FOLDER, 'utf8', (err, files) => {

                    if (err) {
                        throw err;
                    }

                    files.forEach((file) => {
                        const languageFilePath = ConfigUtil.LANGUAGES_FOLDER + file;        
                        const languageFileObject = YAML.safeLoad(fs.readFileSync(languageFilePath));
                        
                        requiredLanguageKeys.filter((key) => key != undefined && key != "").
                        forEach((requiredKey) => assert.ok(languageFileObject.hasOwnProperty(requiredKey), 
                            `"${requiredKey}" key doesn't exist in the language file ${file}`));
                    });  
                });

            });

        });

        describe('YAMLConfigManager', () => {
            describe('#loadLanguage(langAlias)', () => {
                const configManager = new YAMLConfigManager();

                it('should throw an error when it cannot find the corresponding language configuration file', () => {
                    assert.throws(() => {
                        configManager.loadLanguage('none');
                    }, `The function doesn't throw an exception when it cannot find the corresponding file`);
                });

                it('should throw an error when the parameter is undefined or empty or not string', () => {
                    assert.throws(() => {
                        configManager.loadLanguage(undefined);
                    }, `The function doesn't throw an exception when the langAlias parameter is undefined!`);

                    assert.throws(() => {
                        configManager.loadLanguage(123456);
                    }, `The function doesn't throw an exception when the langAlias parameter is undefined!`);

                    assert.throws(() => {
                        configManager.loadLanguage('');
                    }, `The function doesn't throw an exception when the langAlias parameter is undefined!`);

                });

            });

            describe('#getPebutraSettings()', () => {
                const configManager = new YAMLConfigManager();

                it('should throw an error when it cannot find the corresponding language configuration file given in the settings', () => {
                    assert.throws(() => {
                        configManager.getPebutraSettings('none');
                    }, `getPebutraSettings() doesn't throw an exception when it cannot find the corresponding language file given in the settings`);
                });

                it('should throw an error when the language parameter is missing', () => {
                    assert.throws(() => {
                        configManager.getPebutraSettings(`${ConfigUtil.TESTS_DIR_PATH}resources/not_valid_settings.yaml`);
                    }, `getPebutraSettings() doesn't throw an exception when the settingsFilePath parameter is undefined!`);

                });

            });

            describe('#getAvailableLanguagesInfo()', () => {
                const configManager = new YAMLConfigManager();
                
                it('should throw an error when it cannot find the languages folder', () => {
                    assert.throws(() => {
                        configManager.getAvailableLanguagesInfo('no path');
                    }, 
                    `getAvailableLanguagesInfo() doesn't throw an exception when it cannot find the languages folder`);
                });
                
                it('should throw an error when it cannot find files in the languages folder that starts with lang_*.yaml', () => {
                    assert.throws(() => {
                        configManager.getAvailableLanguagesInfo(ConfigUtil.TESTS_DIR_PATH);
                    }, 'getAvailableLanguagesInfo() does not throw an error when it cannot find files in the languages folder that starts with lang_*.yaml');
                });

            });

        });

    });
});