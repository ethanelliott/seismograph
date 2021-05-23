/*!
 * Copyright 2021 competence.one Inc.
 */

import { ApolloServer } from 'apollo-server-express';
import { Express } from 'express';
import { execute, subscribe } from 'graphql';
import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework';
import path from 'path';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { buildSchema } from 'type-graphql';
import { Container } from 'typedi';
import { context } from '../api/auth/graphql/context';
import { env } from '../env';
import { Logger } from '../util/logger';

export const GraphqlLoader: MicroframeworkLoader = async (settings: MicroframeworkSettings | undefined) => {
    const log = new Logger(__filename, ['GRAPHQL']);
    if (settings) {
        if (env.graphql.enabled) {
            log.info('Starting graphql');
            const app: Express = settings.getData('express_app');
            const schemaPath = path.resolve(__dirname, '../', 'gql', 'schema.graphql');

            const schema = await buildSchema({
                container: Container,
                resolvers: env.app.dirs.resolvers as [string, ...Array<string>],
                emitSchemaFile: schemaPath,
                dateScalarMode: 'isoDate',
            });

            const apolloServer = new ApolloServer({
                playground: !env.isProduction,
                introspection: !env.isProduction,
                schema,
                logger: log,
                context,
                plugins: [
                    {
                        requestDidStart: () => ({
                            willSendResponse(requestContext) {
                                Container.reset(requestContext.context.requestId);
                            },
                        }),
                    },
                ],
            });
            apolloServer.applyMiddleware({
                app,
                path: `/${env.graphql.route}`,
            });

            const server = settings.getData('server');
            const ss = new SubscriptionServer({
                execute,
                subscribe,
                schema,
            }, {
                server,
                path: `/${env.graphql.route}`,
            });
            log.info(ss.server.path);
        }
    }
};
