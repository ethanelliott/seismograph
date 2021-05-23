/*!
 * Copyright 2021 Ethan Elliott
 */


import { Application } from 'express';
import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework';
import { createExpressServer } from 'routing-controllers';

// Checkers
import { authorizationChecker } from '../api/auth/authorization-checker';
import { currentUserChecker } from '../api/auth/current-user-checker';

import { env } from '../env';
import { Logger } from '../util/logger';

// load the express server, and all of the controllers
export const ExpressLoader: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {
    const log = new Logger(__filename, ['EXPRESS']);

    if (settings) {
        log.info('Loading Express');

        const connection = settings.getData('connection');

        const expressApp: Application = createExpressServer({
            cors: true,
            classTransformer: true,
            routePrefix: `/${env.app.routePrefix}`,
            defaultErrorHandler: false,
            controllers: env.app.dirs.controllers,
            middlewares: env.app.dirs.middlewares,
            authorizationChecker: authorizationChecker(connection),
            currentUserChecker: currentUserChecker(connection),
        });

        const server = settings.getData('http').createServer(expressApp);
        settings.setData('server', server);
        settings.setData('express_app', expressApp);
    }
};
