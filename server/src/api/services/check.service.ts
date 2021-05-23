/*!
 * Copyright 2021 Ethan Elliott
 */


import axios from 'axios';
import moment from 'moment';
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { LoggerInterface, LogInjector } from '../../decorators/logger';
import { Checkable } from '../models/checkable';
import { CheckableRepository } from '../repositories/checkable.repository';
import { ResultsRepository } from '../repositories/results.repository';
import { ResultStatus } from '../types/result-status.enum';
import { QueueService } from './queue.service';

@Service()
export class CheckService {
    private static readonly PROCESS_NAME = 'check';

    constructor(
        @LogInjector(__filename, ['QUEUE']) private readonly log: LoggerInterface,
        @OrmRepository() private readonly _checkableRepository: CheckableRepository,
        @OrmRepository() private readonly _resultsRepository: ResultsRepository,
        private readonly _queueService: QueueService,
    ) {
        _queueService.addWorkerProcess(CheckService.PROCESS_NAME, (job) =>
            new Promise(async (resolve) => {
                const checkable: Checkable = job.data;
                const startedAt = moment();
                try {
                    const res = await axios.get(checkable.url);
                    const finishedAt = moment();
                    resolve({
                        checkable,
                        httpStatus: res.status,
                        statusText: res.statusText,
                        // maybe need some mechanism to determine what a success response looks like
                        status: res.status === 200 ? ResultStatus.SUCCESS : ResultStatus.FAIL,
                        startedAt,
                        finishedAt
                    });
                } catch (err) {
                    const finishedAt = moment();
                    const pErr = JSON.parse(JSON.stringify(err));
                    resolve({
                        checkable,
                        httpStatus: -1,
                        statusText: pErr.message,
                        status: ResultStatus.FAIL,
                        startedAt,
                        finishedAt
                    });
                }
            }));

        _queueService.registerProcessHandlerFor(CheckService.PROCESS_NAME, async data => {
            await this._resultsRepository.save(data);
        }, async (data) => {
            this.log.info('task failed because', data);
        });
    }

    async getAllToCheck(): Promise<Array<Checkable>> {
        return this._checkableRepository.find();
    }

    async dispatchCheck(checkable: Checkable): Promise<void> {
        await this._queueService.push(CheckService.PROCESS_NAME, checkable);
    }

    async doCheck() {
        const toCheck = await this.getAllToCheck();
        toCheck.forEach(tc => {
            this.dispatchCheck(tc);
        });
    }
}
