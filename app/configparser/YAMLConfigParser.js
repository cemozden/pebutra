const YAML = require('js-yaml');
const fs = require('fs');
const configUtil = require('./ConfigUtil.js');

const pebutraSettings = YAML.safeLoad(fs.readFileSync(configUtil.CONFIG_DIR_PATH + 'db_conf.yaml'));

module.exports = {
    getPebutraSettings() {
        return pebutraSettings;
    }
};