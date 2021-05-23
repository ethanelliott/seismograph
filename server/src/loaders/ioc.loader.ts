/*!
 * Copyright 2021 Ethan Elliott
 */


import { useContainer as classValidatorUseContainer } from 'class-validator';
import { useContainer as cronUseContainer } from 'cron-decorators';
import { MicroframeworkLoader } from 'microframework';
import { useContainer as routingUseContainer } from 'routing-controllers';
import { Container } from 'typedi';
import { useContainer as ormUseContainer } from 'typeorm';
import { Logger } from '../util/logger';

// load DI containers for easier sharing of services
export const IocLoader: MicroframeworkLoader = () => {
    const log = new Logger(__filename, ['IOC']);
    log.info('Loading Containers');
    routingUseContainer(Container);
    ormUseContainer(Container);
    cronUseContainer(Container);
    classValidatorUseContainer(Container);
};
