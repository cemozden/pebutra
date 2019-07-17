import { User } from "../models/User";
import  {connectionPool} from "../db/DbConnectionManager";
import { logger } from "../util/Logger";
import { generateID } from "../util/IDUtil";

export interface UserService {
    userExist(user : User, checkOnlyUsername : boolean) : Promise<boolean>;
    addUser(user : User) : Promise<boolean>;
    deleteUser(user : User) : Promise<boolean>;
}

export class UserServiceImpl implements UserService {

    userExist(user : User, checkOnlyUsername : boolean = false) : Promise<boolean> {

        const userExistPromise = new Promise<boolean>((resolve, reject) => {

            if (user.username === undefined || user.password === undefined) {
                reject(new Error('Username or password cannot be undefined'));
                return;
            }

            const queryStr = checkOnlyUsername ? `SELECT COUNT(*) as UserCount FROM USERS WHERE username LIKE '${user.username}';` : 
                    `SELECT COUNT(*) as UserCount FROM USERS WHERE username LIKE '${user.username}' AND password LIKE '${user.password}';`;

            connectionPool.query(queryStr, 
                (error : any, results : any, fields : any) => {
                                    
                    if (error) {
                        logger.error(error.toString());
                        reject(error);
                    }
                    resolve(results[0].UserCount === 1);
                });
            
        });

        return userExistPromise;        
    }

    addUser(user : User) : Promise<boolean> {
        
        user.userId = generateID((process.env.ID_LENGTH as unknown) as number);

        const addUserPromise = new Promise<boolean>((resolve, reject) => {
            connectionPool.query('INSERT INTO USERS VALUES (?, ?, ?, ?, ?, ?);', 
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
                           
                        }

                        resolve(results.affectedRows === 1);
                    });
        });

        return addUserPromise;
    }

    deleteUser(user: User) : Promise<boolean> {
        const deleteUserPromise = new Promise<boolean>((resolve, reject) => {
        
        connectionPool.query('DELETE FROM USERS WHERE username LIKE ?', [user.username], (err, results) => {
            if (err) {
                logger.error(err);
                reject(err);
            }
            
            resolve(results.affectedRows === 1);
            
        });

        });

        return deleteUserPromise;
    }

}