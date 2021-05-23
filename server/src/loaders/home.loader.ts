/*!
 * Copyright 2021 Ethan Elliott
 */


import * as express from 'express';
import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework';

import { env } from '../env';
import { Logger } from '../util/logger';

// load the root api response

export const HomeLoader: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {
    const log = new Logger(__filename, ['HOME']);

    if (settings) {
        log.info('Loading Root JSON');
        const expressApp = settings.getData('express_app');
        expressApp.get(
            `/${env.app.routePrefix}`,
            (req: express.Request, res: express.Response) => res.json({
                name: env.app.name,
                version: env.app.version,
                description: env.app.description,
            }),
        );
    }
};
