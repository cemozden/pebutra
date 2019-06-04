const YAML = require('js-yaml');
const fs = require('fs');
const configUtil = require('./ConfigUtil.js');

const pebutraSettings = YAML.safeLoad(fs.readFileSync(configUtil.CONFIG_DIR_PATH + 'db_conf.yaml'));

class YAMLConfigManager {

    getPebutraSettings() {
        return pebutraSettings;
    }

    loadLanguage(langAlias) {
        
        if (langAlias === undefined) throw `The langAlias parameter cannot be undefined!`;
        if (typeof langAlias != 'string') throw 'The langAlias parameter can only be string!';
        if (langAlias === '') throw 'The langAlias parameter cannot be empty!';

        const languageFilePath = `${configUtil.LANGUAGES_FOLDER}lang_${langAlias}.yaml`;
        if (!fs.existsSync(languageFilePath))
           throw `Could not find the corresponding language file configuration. File Path: ${languageFilePath}`;
        
        const languageObject = YAML.safeLoad(fs.readFileSync(languageFilePath));

        return languageObject;
    }

}

module.exports = YAMLConfigManager;