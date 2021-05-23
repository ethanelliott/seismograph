/*!
 * Copyright 2021 Ethan Elliott
 */


import { MicroframeworkLoader } from 'microframework';
import winston from 'winston';
import { env } from '../env';
import { ConsoleTransport } from '../util/transports/console-transport';


export const LoggerLoader: MicroframeworkLoader = () => {
    const {format, transports} = winston;
    const {
        combine, timestamp, printf,
    } = format;

    const devFormat = () => {
        const formatMessage = (info: { timestamp: any; level: any; message: any; durationMs: any; }) =>
            `[${info.timestamp}] [${info.level}] ${info.message} ${(info.durationMs ? `Timer: ${info.durationMs}ms` : '')}`;
        const formatError = (info: { timestamp: any; level: any; message: any; durationMs: any; }) =>
            `[${info.timestamp}] [${info.level}] ${info.message}`;
        const selectFormat = (info: { timestamp: any; level: any; message: any; durationMs: any; }) =>
            (info instanceof Error ? formatError(info) : formatMessage(info));
        return printf(selectFormat as any);
    };

    const consoleLogFormat = (): any => combine(timestamp(), devFormat());

    const fileLogFormat = () => combine(timestamp(), devFormat());

    winston.configure({
        level: env.logLevel,
        exitOnError: false,
        transports: [
            new transports.File({filename: 'combined.log', format: fileLogFormat()}),
            new ConsoleTransport({format: consoleLogFormat()}),
        ],
        exceptionHandlers: [
            new winston.transports.File({
                filename: 'exceptions.log',
            }),
        ],
    });
};
