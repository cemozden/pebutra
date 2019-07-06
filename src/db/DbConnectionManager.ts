import * as mysql from "mysql";

import { YAMLConfigManager } from "../configmanagement/YAMLConfigManager";
import { logger } from "../util/Logger";
import { DatabaseConfig } from "./DatabaseConfig";

const configManager = new YAMLConfigManager();
const databaseSettings = configManager.getDatabaseSettings();

const dbConfig : DatabaseConfig = {
    connectionLimit : 10,
    host : databaseSettings.production.host,
    user : databaseSettings.production.username,
    password: databaseSettings.production.password,
    database : databaseSettings.production.database
};

export function getConnectionInstance(databaseConfig : DatabaseConfig = dbConfig) {
      
    return mysql.createPool(databaseConfig);
}