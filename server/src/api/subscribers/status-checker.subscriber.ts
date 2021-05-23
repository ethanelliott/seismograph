/*!
 * Copyright 2021 Ethan Elliott
 */


import { EventSubscriber, On } from 'event-dispatch';
import { Container } from 'typedi';
import { events } from '../events/events';
import { CheckService } from '../services/check.service';

@EventSubscriber()
export class StatusCheckerSubscriber {

    private readonly checkService: CheckService;

    constructor() {
        this.checkService = Container.get(CheckService);
    }

    @On(events.check.pages)
    async checkPages(): Promise<void> {
        await this.checkService.doCheck();
    }
}
