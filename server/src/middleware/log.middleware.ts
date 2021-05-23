/*!
 * Copyright 2021 Ethan Elliott
 */


import chalk from 'chalk';
import * as express from 'express';
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';
import { Logger } from '../util/logger';

// express middleware for debugging route calls

@Middleware({type: 'before'})
export class LogMiddleware implements ExpressMiddlewareInterface {
    private readonly log = new Logger(__filename);

    use(req: express.Request, res: express.Response, next: express.NextFunction): any {
        this.log.debug(`[${chalk.yellow('EXPRESS')}] (${this.colourizeHttpMethod(req.method)}) ${req.path}`);
        next();
    }

    colourizeHttpMethod(method: string) {
        switch (method) {
            case 'GET':
                return chalk.blue(method);
            case 'POST':
                return chalk.green(method);
            case 'DELETE':
                return chalk.red(method);
            case 'PUT':
                return chalk.yellow(method);
            default:
                return method;
        }
    }
}
