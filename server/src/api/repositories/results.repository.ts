/*!
 * Copyright 2021 Ethan Elliott
 */


import { EntityRepository, Repository } from 'typeorm';
import { Results } from '../models/results';

@EntityRepository(Results)
export class ResultsRepository extends Repository<Results> {
}
