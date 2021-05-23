/*!
 * Copyright 2021 Ethan Elliott
 */


import { EntityRepository, Repository } from 'typeorm';
import { Checkable } from '../models/checkable';

@EntityRepository(Checkable)
export class CheckableRepository extends Repository<Checkable> {
}
