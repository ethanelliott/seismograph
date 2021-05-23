/*!
 * Copyright 2021 Ethan Elliott
 */


import http from 'http';
import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework';
import { env } from '../env';
import { Logger } from '../util/logger';

// file loader on the server for public files

export const HttpLoader: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {
    const log = new Logger(__filename, ['HTTP']);

    if (settings) {
        log.info('Loading HTTP Instance');
        if (!env.isTest) {
            settings.setData('http', http);
        }
    }
};
