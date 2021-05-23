/*!
 * Copyright 2021 Ethan Elliott
 */


import { registerController } from 'cron-decorators';
import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework';
import { env } from '../env';
import { Logger } from '../util/logger';

export const CronLoader: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {
    const log = new Logger(__filename, ['CRON']);
    if (settings) {
        log.info('Loading Cron jobs...');
        registerController(env.app.dirs.cronJobs);
    }
};
