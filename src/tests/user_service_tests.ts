import { assert } from "chai";
import { UserServiceImpl } from "../services/UserService";
import { User } from "../models/User";
import { DatabaseConfig } from "../db/DatabaseConfig";
import { YAMLConfigManager } from "../configmanagement/YAMLConfigManager";

import * as db from "../db/DbConnectionManager";

import 'mocha';

describe('UserService', () => {
    const configManager = new YAMLConfigManager();
    const testSettings = configManager.getDatabaseSettings().test;
    
    // Setting up database configurations 
    const pebutra_test_settings : DatabaseConfig = {
        host : testSettings.host,
        user : testSettings.username,
        password : testSettings.password,
        database : testSettings.database,
        connectionLimit : testSettings.connectionPoolLimit
    };

    const connectionInstance = db.getConnectionInstance(pebutra_test_settings);
    const userService = new UserServiceImpl(connectionInstance);

    describe('#userExist(user : User) : Promise<boolean>', () => {
        it('should yield false when the parameters are undefined', async () => {
            
            const user : User = {username : '1231', password : 'xxx'};
            const result = await userService.userExist(user);

            assert.isFalse(result);

        });
    });
});