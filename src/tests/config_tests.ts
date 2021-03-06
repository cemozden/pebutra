import { assert } from "chai";
import * as fs from 'fs';
import 'mocha';
import { YAMLConfigManager } from "../configmanagement/YAMLConfigManager";

process.env.CONFIG_DIR_PATH = `${process.env.PWD}/dist/conf/`;
process.env.LANGUAGES_FOLDER = `${process.env.PWD}/dist/conf/languages/`;
process.env.TESTS_DIR_PATH = `${process.env.PWD}/dist/tests/`;

describe('Configuration', () => {
    describe('conf folder', () => {
        it('should exist in the root path', () => {
           assert.ok(fs.existsSync(process.env.CONFIG_DIR_PATH), `The conf folder cannot be found in the directory ${process.env.CONFIG_DIR_PATH}`);
        });
    });

    // Write tests that will validate settings.yaml file such as language is available etc.
    describe('settings.yaml', () => {
        it('should exist in the conf folder', () => {
            const settingsFilePath = `${process.env.CONFIG_DIR_PATH}/settings.yaml`;
            assert.ok(fs.existsSync(settingsFilePath), 
                    `The settings.yaml file cannot be found in the path: ${settingsFilePath}`)});
    });

    describe('db_conf.yaml', () => {
        it('should exist in the conf folder', () => {
            const settingsFilePath = `${process.env.CONFIG_DIR_PATH}/db_conf.yaml`;
            assert.ok(fs.existsSync(settingsFilePath), 
                    `The db_conf.yaml file cannot be found in the path: ${settingsFilePath}`)});
    });

    describe('Language Configurations', () => {
        it('should contain at least the english language configuration file',
            () => {
                const langEnFilePath = `${process.env.LANGUAGES_FOLDER}/lang_en.yaml`;
                assert.ok(fs.existsSync(langEnFilePath), `The english language file cannot be found in the path: ${langEnFilePath}`)
            });

        describe('YAMLConfigManager', () => {
            describe('#loadLanguage(langAlias)', () => {
                const configManager = new YAMLConfigManager();

                it('should throw an error when it cannot find the corresponding language configuration file', () => {

                    assert.throw(() => {
                        configManager.loadLanguage('none');
                    });
                });

            });


        });

    });
});