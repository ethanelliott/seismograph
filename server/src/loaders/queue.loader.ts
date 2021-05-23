/*!
 * Copyright 2021 Ethan Elliott
 */


import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework';
import { Container } from 'typedi';
import { QueueService } from '../api/services/queue.service';
import { Logger } from '../util/logger';

export const QueueLoader: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {
    const log = new Logger(__filename, ['QUEUE']);
    if (settings) {
        log.info('Loading');
        Container.get(QueueService);
        log.info(`Loaded`);
    }
};
