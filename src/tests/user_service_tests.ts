import { assert } from "chai";
import { UserServiceImpl } from "../services/UserService";
import { User } from "../models/User";
import { DatabaseConfig } from "../db/DatabaseConfig";
import { YAMLConfigManager } from "../configmanagement/YAMLConfigManager";

import * as db from "../db/DbConnectionManager";

import 'mocha';

process.env.ID_LENGTH = '10';

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
            
            const user : User = {username : undefined, password : undefined};
            
            await userService.userExist(user).catch((e : Error) => assert.equal(e.name, 'Error'));
        });

        it('should return false when it cannot find any user given by the parameter', async () => {
            const user : User = {username : 'undefined', password : 'undefined'};
            
            const result = await userService.userExist(user);

            assert.isFalse(result);

        });

        it('should return true when it can find a user given by the parameter', async () => {
            const user : User = {username : 'root', password : 'root'};
            const result = await userService.userExist(user);

            assert.isTrue(result, 'The "root" user does not exist in the database!');
        });

    });

    describe('#addUser(user : User) : Promise<boolean>', () => {

        it('should add the user given as parameter', async () => {
            const user : User = {
                                username : 'test', 
                                password : 'test1234', 
                                name : 'test',
                                surname : 'test',
                                emailAddress : 'test@test.com'};
            
            const result = await userService.addUser(user);
            const deleteTempUser = await userService.deleteUser(user);
            
            assert.isTrue(result, `Unable to add user "${user.username}".`);
            assert.isTrue(deleteTempUser, `Unable to delete temporary user.`);
        });

    });

    after(() => {
        connectionInstance.end();
    });

});