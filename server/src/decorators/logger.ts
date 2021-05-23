/*!
 * Copyright 2021 Ethan Elliott
 */


import { Container } from 'typedi';

import { Logger } from '../util/logger';

export const LogInjector = (scope: string, customDecorator?: Array<string>) =>
    (object: any, propertyName: string, index?: number): any => {
        const logger = new Logger(scope, customDecorator);
        Container.registerHandler({
            object, propertyName, index, value: () => logger,
        });
    };

export { LoggerInterface } from '../util/logger-interface';
