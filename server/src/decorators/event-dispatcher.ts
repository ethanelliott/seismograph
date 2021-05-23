/*!
 * Copyright 2021 Ethan Elliott
 */


import { EventDispatcher as EventDispatcherClass } from 'event-dispatch';
import { Container } from 'typedi';
import { Logger } from '../util/logger';

export const EventDispatcher = () =>
    (object: any, propertyName: string, index?: number): any => {
        const eventDispatcher = new EventDispatcherClass();
        const logger = new Logger(__filename);
        logger.info('Registering Event Dispatcher');
        Container.registerHandler({
            object, propertyName, index, value: () => eventDispatcher,
        });
    };

export { EventDispatcher as EventDispatcherInterface } from 'event-dispatch';
