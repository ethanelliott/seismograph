/*!
 * Copyright 2021 Ethan Elliott
 */

import { Get, JsonController } from 'routing-controllers';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { Results } from '../models/results';
import { ResultsRepository } from '../repositories/results.repository';

@JsonController('/results')
export class ResultsController {
    constructor(
        @OrmRepository() private readonly _resultsRepository: ResultsRepository,
    ) {
    }

    @Get('')
    async getResults(): Promise<Array<Results>> {
        return this._resultsRepository.find({relations: ['checkable']});
    }

    @Get('/error')
    async throwError(): Promise<number> {
        // throw new HttpError(500, 'SERVER ERROR');
        return 4;
    }
}
