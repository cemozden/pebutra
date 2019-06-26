const shell = require('shelljs');

shell.cp('-R', 'windows', 'dist/');
shell.cp('-R', 'conf', 'dist/');
shell.cp('-R', 'src/tests/resources', 'dist/tests');