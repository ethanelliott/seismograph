/*!
 * Copyright 2021 Ethan Elliott
 */


import { Action } from 'routing-controllers';
import { Connection } from 'typeorm';

// To avoid linting errors
export type AuthType = (connection: Connection) => (action: Action, roles: Array<any>) => Promise<boolean> | boolean;

export const authorizationChecker: AuthType = (connection: Connection) => {
    return async (action: Action, roles: Array<any>) => {
        return true;
    };
};
