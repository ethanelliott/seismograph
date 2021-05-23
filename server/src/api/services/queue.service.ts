/*!
 * Copyright 2021 Ethan Elliott
 */

import { Job, Queue, QueueEvents, Worker } from 'bullmq';
import EventEmitter from 'events';
import { Service } from 'typedi';
import { LoggerInterface, LogInjector } from '../../decorators/logger';

@Service()
export class QueueService {
    private static readonly QUEUE_NAMESPACE = 'EVENT_QUEUE';
    private static readonly QUEUE_WORKER_COUNT = 10;

    private readonly _workerProcesses: Map<string, (job: Job) => Promise<any>>;

    private readonly _jobIdToName: Map<string, string>;
    private readonly _jobEventEmitters: Map<string, EventEmitter>;

    private readonly _queue: Queue;
    private readonly _workers: Array<Worker>;
    private readonly _queueEvents: QueueEvents;

    constructor(
        @LogInjector(__filename, ['QUEUE']) private readonly log: LoggerInterface,
    ) {
        this._workerProcesses = new Map<string, (job: Job) => Promise<any>>();
        this._queue = new Queue(QueueService.QUEUE_NAMESPACE);
        this._queueEvents = new QueueEvents(QueueService.QUEUE_NAMESPACE);
        this._jobIdToName = new Map<string, string>();
        this._jobEventEmitters = new Map<string, EventEmitter>();
        this._workers = [];
        this.createWorkers(QueueService.QUEUE_WORKER_COUNT);
        this.setupQueueEvents();
    }

    registerProcessHandlerFor(name: string, onSuccess: (data) => void, onFail: (data) => void) {
        const eventEmitter = this._jobEventEmitters.get(name);
        eventEmitter.on('completed', async (data) => onSuccess(data.returnvalue));
        eventEmitter.on('failed', async (data) => onFail(data.failedReason));
    }

    addWorkerProcess(name: string, process: (job: Job) => Promise<any>) {
        this.log.debug(`registering worker process '${name}'`);
        if (this._workerProcesses.has(name)) {
            throw new Error(`process '${name}' already exists`);
        }
        this._jobEventEmitters.set(name, new EventEmitter());
        this._workerProcesses.set(name, process);
    }

    async push(processName, data) {
        const job = await this._queue.add(processName, data);
        this._jobIdToName.set(job.id, job.name);
        return this._jobEventEmitters.get(job.name);
    }

    private createWorkers(count: number) {
        for (let i = 0; i < count; i++) {
            this._workers.push(new Worker(QueueService.QUEUE_NAMESPACE, async job => {

                if (!this._workerProcesses.has(job.name)) {
                    throw new Error(`process '${job.name}' doesn't exist`);
                }
                return this._workerProcesses.get(job.name)(job);
            }, {concurrency: count}));
        }
        this.log.debug(`created ${this._workers.length} workers`);
    }

    private setupQueueEvents() {
        this._queueEvents.on('completed', data => {
            const jobName = this._jobIdToName.get(data.jobId);
            this._jobEventEmitters.get(jobName).emit('completed', data);
        });

        this._queueEvents.on('failed', (data) => {
            const jobName = this._jobIdToName.get(data.jobId);
            this._jobEventEmitters.get(jobName).emit('failed', data);
        });
    }
}
