import { User } from "../models/User";
import * as db from "../db/DbConnectionManager";
import { logger } from "../util/Logger";
import { Pool } from "mysql";
import { generateID } from "../util/IDUtil";

export interface UserService {
    userExist(user : User) : Promise<boolean>;
    addUser(user : User) : Promise<boolean>;
    deleteUser(user : User) : Promise<boolean>;
}

export class UserServiceImpl implements UserService {
    private dbConnectionPool : Pool = undefined;

    constructor(dbConnectionPool : Pool = db.getConnectionInstance()) {
        this.dbConnectionPool = dbConnectionPool;
    }


    userExist(user : User) : Promise<boolean> {

        const userExistPromise = new Promise<boolean>((resolve, reject) => {

            if (user.username === undefined || user.password === undefined) {
                reject(new Error('Username or password cannot be undefined'));
                return;
            }

            this.dbConnectionPool.getConnection((err, connection) => {

                if (err) {
                    logger.error(err);
                    reject(err);
                    connection.release();
                }
    
                connection.query(`SELECT COUNT(*) as UserCount FROM USERS WHERE username LIKE '${user.username}' AND password LIKE '${user.password}';`, 
                    (error : any, results : any, fields : any) => {
                                        
                        if (error) {
                            logger.error(error.toString());
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

    addUser(user : User) : Promise<boolean> {
        
        user.userId = generateID((process.env.ID_LENGTH as unknown) as number);

        const addUserPromise = new Promise<boolean>((resolve, reject) => {
            this.dbConnectionPool.getConnection((err, connection) => {
                if (err) {
                    logger.error(err);
                    reject(err);
                    connection.release();
                }

                connection.query('INSERT INTO USERS VALUES (?, ?, ?, ?, ?, ?);', 
                [   
                    user.userId, 
                    user.username,
                    user.password,
                    user.name,
                    user.surname,
                    user.emailAddress
                ], (err, results) => {
                        if (err) {
                            logger.error(err);
                            reject(err);
                            connection.release();
                        }

                        resolve(results.affectedRows === 1);
                    });

            });
        });

        return addUserPromise;
    }

    deleteUser(user: User) : Promise<boolean> {
        const deleteUserPromise = new Promise<boolean>((resolve, reject) => {
            this.dbConnectionPool.getConnection((err, connection) => {
                if (err) {
                    logger.error(err);
                    reject(err);
                    connection.release();
                }

                connection.query('DELETE FROM USERS WHERE username LIKE ?', [user.username], (err, results) => {
                    if (err) {
                        logger.error(err);
                        reject(err);
                        connection.release();
                    }
                    
                    resolve(results.affectedRows === 1);
                    
                });

            });
        });

        return deleteUserPromise;
    }

}