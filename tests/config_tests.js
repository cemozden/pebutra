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

    describe('settings.yaml', () => {
        it('should exist in the conf folder', () => {
            const settingsFilePath = `${ConfigUtil.CONFIG_DIR_PATH}/settings.yaml`;
            assert.ok(fs.existsSync(settingsFilePath), 
                    `The settings.yaml file cannot be found in the path: ${settingsFilePath}`)});
    });

    describe('Language Configurations', () => {
        it('should contain at least the english language configuration file',
            () => {
                const langEnFilePath = `${ConfigUtil.LANGUAGES_FOLDER}/lang_en.yaml`;
                assert.ok(fs.existsSync(langEnFilePath), `The english language file cannot be found in the path: ${langEnFilePath}`)
            });

        it('should contain requiredlanguagekeys.txt file to check the required keys',
            () => {
                const requiredLanguageKeysFilePath = `${ConfigUtil.APPLICATION_PATH}/tests/resources/requiredlanguagekeys.txt`;
                assert.ok(fs.existsSync(requiredLanguageKeysFilePath));
        });

        it('should contain all required language keys', () => {
            
            fs.readFile(ConfigUtil.APPLICATION_PATH + '/tests/resources/requiredlanguagekeys.txt','utf8', (err, data) => {
                const requiredLanguageKeys = data.split('\n');
  
                fs.readdir(ConfigUtil.LANGUAGES_FOLDER, 'utf8', (err, files) => {
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
        });

    });
});