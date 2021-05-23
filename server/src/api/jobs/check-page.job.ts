/*!
 * Copyright 2021 Ethan Elliott
 */


import { Cron, CronController } from 'cron-decorators';
import { EventDispatcher, EventDispatcherInterface } from '../../decorators/event-dispatcher';
import { events } from '../events/events';

@CronController('check-page')
export class CheckPageJob {

    constructor(
        @EventDispatcher() private readonly eventDispatcher: EventDispatcherInterface,
    ) {
    }


    @Cron('check', '*/1 * * * *')
    async testJob() {
        this.eventDispatcher.dispatch(events.check.pages);
    }
}
