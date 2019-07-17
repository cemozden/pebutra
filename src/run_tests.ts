process.env.APPLICATION_DIR = `${process.env.PWD}/dist`;
process.env.CONFIG_DIR_PATH = `${process.env.APPLICATION_DIR}/conf/`;
process.env.LANGUAGES_FOLDER = `${process.env.APPLICATION_DIR}/conf/languages/`;
process.env.TESTS_DIR_PATH = `${process.env.APPLICATION_DIR}/tests/`;
process.env.ID_LENGTH = '10';

import * as Mocha from "mocha";
import * as fs from "fs";
import * as path from "path";
import { connectionPool } from "./db/DbConnectionManager";

// Instantiate a Mocha instance.
const mocha = new Mocha();

const testDir = __dirname +  '/tests'

// Add each .js file to the mocha instance
fs.readdirSync(testDir).filter(function(file) {
    // Only keep the .js files
    return file.substr(-3) === '.js';

}).forEach(function(file) {
    mocha.addFile(
        path.join(testDir, file)
    );
});

// Run the tests.
mocha.run(function(failures) {
    process.exitCode = failures ? 1 : 0;  // exit with non-zero status if there were failures
    closePoolAfterTests();
});

function closePoolAfterTests() {
    console.log('Closing pool');
    connectionPool.end();
}