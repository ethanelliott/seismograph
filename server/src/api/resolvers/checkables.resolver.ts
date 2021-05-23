import moment from 'moment';
import { Arg, FieldResolver, Query, Resolver, ResolverInterface, Root } from 'type-graphql';
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { Checkable } from '../models/checkable';
import { Results } from '../models/results';
import { CheckableRepository } from '../repositories/checkable.repository';
import { ResultsRepository } from '../repositories/results.repository';
import { ResultStatus } from '../types/result-status.enum';

@Service()
@Resolver(type => Checkable)
export class CheckablesResolver implements ResolverInterface<Checkable> {

    constructor(
        @OrmRepository() private readonly _checkableRepository: CheckableRepository,
        @OrmRepository() private readonly _resultsRepository: ResultsRepository,
    ) {
    }

    @Query(returns => [Checkable])
    async applications(): Promise<Array<Checkable>> {
        return this._checkableRepository.find();
    }

    @Query(returns => Checkable)
    async application(
        @Arg('id') id: string,
    ): Promise<Checkable> {
        return this._checkableRepository.findOne(id);
    }

    @FieldResolver(returns => Results, {nullable: true})
    async recentResult(
        @Root() checkable: Checkable,
    ): Promise<Results> {
        return this._resultsRepository.findOne({
            where: {
                checkable: checkable.id
            },
            order: {
                timestamp: 'DESC'
            }
        });
    }

    @FieldResolver(returns => Number, {nullable: true})
    async averageResponseTime(
        @Root() checkable: Checkable,
    ): Promise<number> {
        const results = await this._resultsRepository.find({
            where: {
                checkable: checkable.id
            },
            order: {
                timestamp: 'ASC'
            }
        });
        return results.map(e => moment(e.finishedAt).diff(e.startedAt, 'milliseconds')).reduce((sum, v) => sum + v, 0) / results.length;
    }

    @FieldResolver(returns => Number, {nullable: true})
    async uptime(
        @Root() checkable: Checkable,
    ): Promise<number> {
        const results = await this._resultsRepository.find({
            where: {
                checkable: checkable.id
            },
            order: {
                timestamp: 'ASC'
            }
        });
        return results.filter(e => e.status === ResultStatus.SUCCESS).length / results.length;
    }

    @FieldResolver(returns => [Results])
    async results(
        @Root() checkable: Checkable,
    ): Promise<Array<Results>> {
        return this._resultsRepository.find({
            where: {
                checkable: checkable.id
            },
            order: {
                timestamp: 'ASC'
            }
        });
    }
}
