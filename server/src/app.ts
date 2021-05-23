/*!
 * Copyright 2021 Ethan Elliott
 */


import 'reflect-metadata';
import { SeismographServer } from './seismograph.server';


SeismographServer
    .main()
    .catch(err => {
        SeismographServer.log.error('SERVER HAS CRASHED!\n', err);
    });
