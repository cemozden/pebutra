'use strict'

import * as YAML from 'js-yaml';
import * as fs from 'fs';
import * as mustache from "mustache";
import { MINIMUM_PASSWORD_LENGTH } from "../validations/ValidationConstants";

const SETTINGS_YAML_LANGUAGE_PROPERTY_NAME = 'language';

interface PebutraSettings {
    language : string
}

interface LanguageInfo {
    alias : string
    fullName : string
}

interface DatabaseSettings {
    host : string
    username: string
    password : string
    database : string
    connectionPoolLimit : number
}

export class YAMLConfigManager {

    getPebutraSettings() : PebutraSettings {

        const pebutraSettings : PebutraSettings = YAML.safeLoad(fs.readFileSync(process.env.CONFIG_DIR_PATH + 'settings.yaml'));
        if (!(SETTINGS_YAML_LANGUAGE_PROPERTY_NAME in pebutraSettings)) 
            throw `settings.yaml file do not have the property "language". Please define this YAML property in the settings.yaml file with the value of language alias such as "en"`;

        const languageFilePath = `${process.env.LANGUAGES_FOLDER}lang_${pebutraSettings.language}.yaml`;
        if (!fs.existsSync(languageFilePath))
               throw `Could not find the corresponding language file configuration. File Path: ${languageFilePath}`;

        return pebutraSettings;
    }

    getDatabaseSettings() : DatabaseSettings {
        const databaseSettings = YAML.safeLoad(fs.readFileSync(process.env.CONFIG_DIR_PATH + 'db_conf.yaml'));

        return databaseSettings;
    }

     /**
     * Loads the entire language configuration from the languages folder.
     * @param langAlias The alias of the language that will be looked in the languages folder
     * @return {LanguageObject}   
     */
    loadLanguage(langAlias : string) {
        
        if (langAlias === '') throw 'The langAlias parameter cannot be empty!';

        const languageFilePath = `${process.env.LANGUAGES_FOLDER}lang_${langAlias}.yaml`;
        
        if (!fs.existsSync(languageFilePath))
           throw `Could not find the corresponding language file configuration. File Path: ${languageFilePath}`;
        
        const languageObject = YAML.safeLoad(fs.readFileSync(languageFilePath));
        
        const languageVariableValues = {
               year : new Date().getFullYear(),
            creator : process.env.npm_package_author_name,
            version : process.env.npm_config_init_version,
            minPasswordLength : MINIMUM_PASSWORD_LENGTH
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
    getAvailableLanguagesInfo() : LanguageInfo[] {
        
        if (!fs.existsSync(process.env.LANGUAGES_FOLDER)) throw 'Cannot find the languages folder';
        const languageInfoArray : LanguageInfo[] = [];

        const files = fs.readdirSync(process.env.LANGUAGES_FOLDER, 'utf8');

        files.forEach((file : string) => {
            if (file.match('lang_[a-z]{2}\.yaml') == null) throw `${file} is not a language configuration file! Please make sure "${process.env.LANGUAGES_FOLDER}" only contains language configuration files!`;
            
            const languageFilePath = `${process.env.LANGUAGES_FOLDER}/${file}`;
            const languageObject = YAML.safeLoad(fs.readFileSync(languageFilePath));

            languageInfoArray.push({alias : languageObject.alias, fullName : languageObject.fullName});
        });

        return languageInfoArray;

    }

    writePebutraSettings(pebutraSettings : PebutraSettings) {

        fs.writeFile(process.env.CONFIG_DIR_PATH + 'settings.yaml', YAML.safeDump(pebutraSettings), (err) => {
            if (err) {
                console.log('Unable to write to the settings.yaml file');
            }
        });
    }

}