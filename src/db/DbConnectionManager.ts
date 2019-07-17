import * as mysql from "mysql";

import { YAMLConfigManager } from "../configmanagement/YAMLConfigManager";
import { DatabaseConfig } from "./DatabaseConfig";

const configManager = new YAMLConfigManager();
const databaseSettings = configManager.getDatabaseSettings();

const dbProdConfig : DatabaseConfig = {
    connectionLimit : databaseSettings.production.connectionPoolLimit,
    host : databaseSettings.production.host,
    user : databaseSettings.production.username,
    password: databaseSettings.production.password,
    database : databaseSettings.production.database
};

const dbTestConfig : DatabaseConfig = {
    host : databaseSettings.test.host,
    user : databaseSettings.test.username,
    password : databaseSettings.test.password,
    database : databaseSettings.test.database,
    connectionLimit : databaseSettings.test.connectionPoolLimit    
};

const dbConfig = process.env.NODE_ENV === 'production' ? dbProdConfig : dbTestConfig ;

export const connectionPool = mysql.createPool(dbConfig);