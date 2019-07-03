import * as mysql from "mysql";

import { YAMLConfigManager } from "../configmanagement/YAMLConfigManager";
import { logger } from "../util/Logger";

const configManager = new YAMLConfigManager();
const databaseSettings = configManager.getDatabaseSettings();

const pool = mysql.createPool({
    connectionLimit : 10,
    host : databaseSettings.host,
    user : databaseSettings.username,
    password: databaseSettings.password,
    database : databaseSettings.database
});


export function getConnectionInstance() {
      return pool.getConnection((err, connection) => {
          if (err) {
              connection.release();
              logger.info('Error to connect to the database server.');
              return;
          }
        
          logger.info(`Connected to the database server "${databaseSettings.host}"`);
          return connection;
      });
}
