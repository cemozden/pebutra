import { User } from "../models/User";
import * as db from "../db/DbConnectionManager";
import { logger } from "../util/Logger";
import { Pool } from "mysql";

export interface UserService {
    userExist(user : User) : Promise<boolean>;
}

export class UserServiceImpl implements UserService {
    private dbConnectionPool : Pool = undefined;

    constructor(dbConnectionPool : Pool = db.getConnectionInstance()) {
        this.dbConnectionPool = dbConnectionPool;
    }


    userExist(user : User) : Promise<boolean> {

        const userExistPromise = new Promise<boolean>((resolve, reject) => {
            this.dbConnectionPool.getConnection((err, connection) => {

                if (err) {
                    logger.error(err);
                    reject(err);
                    connection.release();
                }
    
                connection.query(`SELECT COUNT(*) as UserCount FROM USERS WHERE username LIKE '${user.username}' AND password LIKE '${user.password}';`, 
                    (error : any, results : any, fields : any) => {
                                        
                        if (error) {
                            logger.error(error);
                            reject(error);
                            connection.release();
                        }
                        
                        connection.release();
                        resolve(results[0].UserCount === 1);
                    });
            });
        });

        return userExistPromise;        
    }

}