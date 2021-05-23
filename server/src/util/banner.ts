/*!
 * Copyright 2021 Ethan Elliott
 */


import glob from 'glob';
import { env } from '../env';
import { Logger } from './logger';

const globToFile = g => {
    return glob.sync(g)
        .map(f => f.split('/'))
        .map(a => a[a.length - 1].split('.')[0]);
};

export const banner = (log: Logger) => {
    const route = () => `${env.app.schema}://${env.app.host}:${env.app.port}/`;
    log.info('-------------------------------------------------------------------------------------------------');
    log.info('');
    log.info(`SEISMOGRAPH is running at ${route()}${env.app.routePrefix}`);
    log.info('');
    log.info('-------------------------------------------------------------------------------------------------');
    log.info(`Environment  : ${env.node}`);
    log.info(`Version      : ${env.app.version}`);
    log.info('');
    log.info(`API Info     : ${route()}${env.app.routePrefix}`);
    if (env.swagger.enabled) {
        log.info(`Swagger      : ${route()}${env.swagger.route}`);
    }
    if (env.graphql.enabled) {
        log.info(`Swagger      : ${route()}${env.graphql.route}`);
    }
    log.info(`Front        : ${env.app.front.url}`);
    log.info('-------------------------------------------------------');
    log.info(`Loaded Loaders: [${env.app.dirs.loaders.map(globToFile)}]`);
    log.info(`Loaded Entities: [${env.app.dirs.entities.map(globToFile)}]`);
    log.info(`Loaded Controllers: [${env.app.dirs.controllers.map(globToFile)}]`);
    log.info(`Loaded Middlewares: [${env.app.dirs.middlewares.map(globToFile)}]`);
    log.info(`Loaded Subscribers: [${env.app.dirs.subscribers.map(globToFile)}]`);
    log.info(`Loaded Services: [${env.app.dirs.services.map(globToFile)}]`);
    log.info(`Loaded CronJobs: [${env.app.dirs.cronJobs.map(globToFile)}]`);
    log.info('-------------------------------------------------------');
    log.info('');
};
