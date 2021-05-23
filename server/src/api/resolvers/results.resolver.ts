import moment from 'moment';
import { FieldResolver, Resolver, ResolverInterface, Root } from 'type-graphql';
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { Checkable } from '../models/checkable';
import { Results } from '../models/results';
import { ResultsRepository } from '../repositories/results.repository';

@Service()
@Resolver(type => Results)
export class ResultsResolver implements ResolverInterface<Results> {

    constructor(
        // @OrmRepository() private readonly _checkableRepository: CheckableRepository,
        @OrmRepository() private readonly _resultsRepository: ResultsRepository,
    ) {
    }

    @FieldResolver(returns => Number)
    async responseTime(
        @Root() results: Results,
    ): Promise<number> {
        return moment(results.finishedAt).diff(results.startedAt, 'milliseconds');
    }

    @FieldResolver(returns => Checkable)
    async checkable(
        @Root() results: Results,
    ): Promise<Checkable> {
        const result = await this._resultsRepository.findOne(results.id, {relations: ['checkable']});
        return result.checkable;
    }
}
