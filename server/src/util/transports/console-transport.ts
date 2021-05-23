/*!
 * Copyright 2021 Ethan Elliott
 */


import chalk from 'chalk';
import Transport from 'winston-transport';

export class ConsoleTransport extends Transport {
    constructor(opts) {
        super(opts);
    }

    log(info: any, next: () => void): any {
        // disabling because its the logging transport
        // tslint:disable-next-line:no-console
        console.log(`[${chalk.magenta(info.timestamp)}][${this.colourizeLevel(info.level)}]${info.message}`);
        next();
    }

    colourizeLevel(level) {
        switch (level) {
            case 'error':
                return chalk.red(level);
            case 'warn':
                return chalk.redBright(level);
            case 'help':
                return chalk.cyan(level);
            case 'info':
                return chalk.green(level);
            case 'debug':
                return chalk.blue(level);
            case 'silly':
                return chalk.magenta(level);
            default:
                return level;
        }
    }
}
