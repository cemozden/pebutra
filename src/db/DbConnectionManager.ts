import * as mysql from "mysql";
import { YAMLConfigManager } from "../configmanagement/YAMLConfigManager";
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
              console.log('Error to connect to the database server.');
              return;
          }
        
          console.log(`Connected to the database server "${databaseSettings.host}"`);
          return connection;
      });
}
