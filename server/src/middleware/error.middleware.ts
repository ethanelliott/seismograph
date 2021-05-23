/*!
 * Copyright 2021 Ethan Elliott
 */


import * as express from 'express';
import { ExpressErrorMiddlewareInterface, HttpError, Middleware } from 'routing-controllers';

import { env } from '../env';
import { Logger } from '../util/logger';

// handle the express errors nicely using our logger

@Middleware({type: 'after'})
export class ErrorMiddleware implements ExpressErrorMiddlewareInterface {
    private readonly log = new Logger(__filename);

    error(error: HttpError, req: express.Request, res: express.Response, next: express.NextFunction): void {
        res.status(error.httpCode || 500);
        if (env.isProduction) {
            res.json({
                name: error.name,
            });
        } else {
            res.json({
                name: error.name,
                message: error.message,
            });
        }

        this.log.error(error);
        next();
    }
}
