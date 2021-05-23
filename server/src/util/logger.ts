/*!
 * Copyright 2021 Ethan Elliott
 */


import chalk from 'chalk';
import * as path from 'path';
import * as winston from 'winston';
import { env } from '../env';
import { LoggerInterface } from './logger-interface';

export class Logger implements LoggerInterface {
    static DEFAULT_SCOPE = 'app';

    private readonly scope: string;
    private readonly customDecorators: Array<string>;

    constructor(scope?: string, customDecorators?: Array<string>) {
        this.scope = Logger.parsePathToScope((scope) || Logger.DEFAULT_SCOPE);
        this.customDecorators = customDecorators || [];
    }

    private static parsePathToScope(filepath: string): string {
        if (filepath.indexOf(path.sep) >= 0) {
            filepath = filepath.replace(process.cwd(), '');
            filepath = filepath.replace(`${path.sep}src${path.sep}`, '');
            filepath = filepath.replace(`${path.sep}dist${path.sep}`, '');
            filepath = filepath.replace('.ts', '');
            filepath = filepath.replace('.js', '');
            filepath = filepath.replace(/[/\\]/g, ':');
        }
        return filepath;
    }

    debug(...args: Array<any>): void {
        this.log('debug', args);
    }

    info(...args: Array<any>): void {
        this.log('info', args);
    }

    warn(...args: Array<any>): void {
        this.log('warn', args);
    }

    error(...args: Array<any>): void {
        this.log('error', args);
    }

    private log(level: string, message: Array<any>): void {
        if (winston) {
            message = message.map(m => {
                if (m && typeof m !== 'string') {
                    if (m && m instanceof Error) {
                        if (env.isProduction) {
                            return `${m.name}: ${m.message}`;
                        } else {
                            return `${m.name}: ${m.message}\n${m.stack}`;
                        }
                    } else if (m.hasOwnProperty('toString')) {
                        return m.toString();
                    } else {
                        return JSON.stringify(m);
                    }
                }
                return m;
            });
            winston[level](`${this.formatScope()}${this.formatCustomDecorators()} ${message.join(' ')}`);
        }
    }

    private formatCustomDecorators(): string {
        return this.customDecorators.map(d => `[${chalk.cyan(d)}]`).join('');
    }

    private formatScope(): string {
        return `[${chalk.blueBright(this.scope)}]`;
    }
}
