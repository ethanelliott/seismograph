/*!
 * Copyright 2021 Ethan Elliott
 */


import { Service } from 'typedi';
import { EventDispatcher, EventDispatcherInterface } from '../../decorators/event-dispatcher';
import { events } from '../events/events';

@Service()
export class TestService {
    constructor(
        @EventDispatcher() private readonly eventDispatcher: EventDispatcherInterface,
    ) {
    }

    async test(): Promise<void> {
        this.eventDispatcher.dispatch(events.check.pages);
    }
}
