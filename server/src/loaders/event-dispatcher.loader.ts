/*!
 * Copyright 2021 Ethan Elliott
 */


import { glob } from 'glob';
import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework';
import { env } from '../env';

export const EventDispatchLoader: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {
    if (settings) {
        env.app.dirs.subscribers.map(pattern => glob.sync(pattern).forEach(file => import(file)));
    }
};
