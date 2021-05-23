import { bootstrapMicroframework } from 'microframework';
import { CronLoader } from './loaders/cron.loader';
import { EventDispatchLoader } from './loaders/event-dispatcher.loader';
import { ExpressLoader } from './loaders/express.loader';
import { FileLoader } from './loaders/file.loader';
import { GraphqlLoader } from './loaders/graphql.loader';
import { HomeLoader } from './loaders/home.loader';
import { HttpLoader } from './loaders/http.loader';
import { IocLoader } from './loaders/ioc.loader';
import { LoggerLoader } from './loaders/logger.loader';
import { QueueLoader } from './loaders/queue.loader';
import { ServerLoader } from './loaders/server.loader';
import { SwaggerLoader } from './loaders/swagger.loader';
import { TypeOrmLoader } from './loaders/type-orm.loader';
import { banner } from './util/banner';
import { Logger } from './util/logger';

export class SeismographServer {
    static log = new Logger(__filename);

    static async main() {
        await bootstrapMicroframework({
            loaders: [
                LoggerLoader,
                QueueLoader,
                HttpLoader,
                IocLoader,
                TypeOrmLoader,
                EventDispatchLoader,
                ExpressLoader,
                SwaggerLoader,
                HomeLoader,
                FileLoader,
                ServerLoader,
                GraphqlLoader,
                CronLoader,
            ],
        });
        banner(SeismographServer.log);
    }
}
