/*!
 * Copyright 2021 Ethan Elliott
 */


import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework';
import { ConnectionOptions, createConnection } from 'typeorm';
import { env } from '../env';
import { Logger } from '../util/logger';

export const TypeOrmLoader: MicroframeworkLoader = async (settings: MicroframeworkSettings | undefined) => {
    const log = new Logger(__filename, ['ORM']);

    log.info('Loading ORM');

    const options: ConnectionOptions = {
        type: env.database.type as any,
        host: env.database.host,
        port: env.database.port,
        username: env.database.username,
        password: env.database.password,
        database: env.database.database,
        synchronize: true,
        ssl: {rejectUnauthorized: false},
        logging: ['schema', 'error', 'warn', 'info', 'log'],
        entities: env.app.dirs.entities,
    };
    log.info('Connecting to DB');
    const connection = await createConnection(options);

    if (settings) {
        settings.setData('connection', connection);
        settings.onShutdown(() => connection.close());
    }
};
