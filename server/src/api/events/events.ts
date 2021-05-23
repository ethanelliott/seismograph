/*!
 * Copyright 2021 Ethan Elliott
 */


import { recursiveEventNameParser, traverseApply } from './events-helpers';

const eventsObject = {
    test: {
        test: '',
    },
    check: {
        pages: ''
    }
};

recursiveEventNameParser(eventsObject, null)
    .flat(10)
    .forEach(key => traverseApply(eventsObject, key, key));

export const events = eventsObject;
