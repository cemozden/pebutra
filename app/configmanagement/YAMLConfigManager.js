'use strict'
const YAML = require('js-yaml');
const fs = require('fs');
const mustache = require('mustache');
const ValidationConstants = require('../validations/ValidationConstants.js');

const SETTINGS_YAML_LANGUAGE_PROPERTY_NAME = 'language';

class YAMLConfigManager {

    /**
     * 
     * @param {string} settingsFilePath Optional parameter whether to be giving settings.yaml file as a parameter. Used in config tests.  
     */
    getPebutraSettings(settingsFilePath) {
        const pebutraSettings = settingsFilePath == undefined || settingsFilePath == '' 
            ? YAML.safeLoad(fs.readFileSync(process.env.CONFIG_DIR_PATH + 'settings.yaml')) 
            : YAML.safeLoad(fs.readFileSync(settingsFilePath));

            if (!pebutraSettings.hasOwnProperty(SETTINGS_YAML_LANGUAGE_PROPERTY_NAME)) {
                throw `settings.yaml file do not have the property "language". Please define this YAML property in the settings.yaml file with the value of language alias such as "en"`;
            }

            const languageFilePath = `${process.env.LANGUAGES_FOLDER}lang_${pebutraSettings.language}.yaml`;
            if (!fs.existsSync(languageFilePath))
               throw `Could not find the corresponding language file configuration. File Path: ${languageFilePath}`;

        return pebutraSettings;
    }

    getDatabaseSettings() {
        const databaseSettings = YAML.safeLoad(fs.readFileSync(process.env.CONFIG_DIR_PATH + 'db_conf.yaml'));

        return databaseSettings;
    }

    /**
     * Loads the entire language configuration from the languages folder.
     * @param {string} langAlias The alias of the language that will be looked in the languages folder
     * @return {LanguageObject}   
     */
    loadLanguage(langAlias) {
        
        if (langAlias == undefined) throw `The langAlias parameter cannot be undefined!`;
        if (typeof langAlias != 'string') throw 'The langAlias parameter can only be string!';
        if (langAlias === '') throw 'The langAlias parameter cannot be empty!';

        const languageFilePath = `${process.env.LANGUAGES_FOLDER}lang_${langAlias}.yaml`;
        if (!fs.existsSync(languageFilePath))
           throw `Could not find the corresponding language file configuration. File Path: ${languageFilePath}`;
        
        const languageObject = YAML.safeLoad(fs.readFileSync(languageFilePath));
        
        const languageVariableValues = {
               year : new Date().getFullYear(),
            creator : process.env.npm_package_author_name,
            version : process.env.npm_config_init_version,
            minPasswordLength : ValidationConstants.MINIMUM_PASSWORD_LENGTH
        };
        
        // Replace mustache variables with the given value object.
        for (const langKey in languageObject) {
            if (languageObject.hasOwnProperty(langKey)) 
                languageObject[langKey] = mustache.render(languageObject[langKey], languageVariableValues);
        }

        return languageObject;
    }

    /**
     * The function that returns the current system language from configuration file.
     * @returns {LanguageObject}
     */
    getDefaultLanguage() {
        const defaultLanguage = this.getPebutraSettings().language;

        return this.loadLanguage(defaultLanguage);
    }

    /**
     * 
     * @param {string} languageDirPath Optional parameter to determine the folder where languages configurations are being held. Used in tests. 
     * @returns {Array}
     */
    getAvailableLanguagesInfo(languageDirPath) {

        const languageDir = languageDirPath == undefined || languageDirPath == '' 
            ? process.env.LANGUAGES_FOLDER 
            : languageDirPath;
        
        if (!fs.existsSync(languageDir)) throw 'Cannot find the languages folder';
        const languageInfoArray = [];

        const files = fs.readdirSync(languageDir, 'utf8');

        files.forEach((file) => {
            if (file.match('lang_[a-z]{2}\.yaml') == null) throw `${file} is not a language configuration file! Please make sure "${languageDir}" only contains language configuration files!`;
            
            const languageFilePath = `${languageDir}/${file}`;
            const languageObject = YAML.safeLoad(fs.readFileSync(languageFilePath));

            languageInfoArray.push({alias : languageObject.alias , fullName : languageObject.fullName});
        });

        return languageInfoArray;

    }

    writePebutraSettings(pebutraSettings) {

        fs.writeFile(process.env.CONFIG_DIR_PATH + 'settings.yaml', YAML.safeDump(pebutraSettings), (err) => {
            if (err) {
                console.log('Unable to write to the settings.yaml file');
            }
        });
    }


}

module.exports = YAMLConfigManager;