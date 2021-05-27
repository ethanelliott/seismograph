import moment from 'moment';
import { Arg, FieldResolver, Query, Resolver, ResolverInterface, Root } from 'type-graphql';
import { Service } from 'typedi';
import { MoreThan } from 'typeorm';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { Checkable } from '../models/checkable';
import { Results } from '../models/results';
import { CheckableRepository } from '../repositories/checkable.repository';
import { ResultsRepository } from '../repositories/results.repository';
import { ResultStatus } from '../types/result-status.enum';
import { UptimeOutput } from './output/uptime.output';

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

    @FieldResolver(returns => [UptimeOutput], {nullable: true})
    async uptime(
        @Root() checkable: Checkable,
    ): Promise<Array<UptimeOutput>> {
        const intervalUnit = 'hours';
        const intervalCount = 168;
        const results = await this._resultsRepository.find({
            where: {
                checkable: checkable.id
            },
            order: {
                timestamp: 'DESC'
            }
        });
        const r: Array<Array<Results>> = [];
        for (let i = 0; i < intervalCount; i++) {
            r[i] = results.filter(e =>
                moment(e.timestamp).valueOf() < moment().subtract(i, intervalUnit).valueOf()
                && moment(e.timestamp).valueOf() > moment().subtract(i + 1, intervalUnit).valueOf());
        }
        return r.map((e, i) => {
            return ({
                timestamp: e[0] ? e[0].timestamp : moment().subtract(i + 1, intervalUnit).toDate(),
                uptime: e.length > 0 ? e
                    .reduce((previousValue, currentValue) =>
                        previousValue + (currentValue.status === ResultStatus.SUCCESS ? 1 : 0), 0) / e.length : 0
            });
        });
    }

    @FieldResolver(returns => Number, {nullable: true})
    async uptimeAllTime(
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

    @FieldResolver(returns => Number, {nullable: true})
    async uptimeLast24Hours(
        @Root() checkable: Checkable,
    ): Promise<number> {
        const results = await this._resultsRepository.find({
            where: {
                checkable: checkable.id,
                timestamp: MoreThan(moment().subtract(24, 'hours'))
            },
            order: {
                timestamp: 'ASC'
            }
        });
        return results.filter(e => e.status === ResultStatus.SUCCESS).length / results.length;
    }

    @FieldResolver(returns => Number, {nullable: true})
    async uptimeLast7Days(
        @Root() checkable: Checkable,
    ): Promise<number> {
        const results = await this._resultsRepository.find({
            where: {
                checkable: checkable.id,
                timestamp: MoreThan(moment().subtract(7, 'days'))
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
                checkable: checkable.id,
                timestamp: MoreThan(moment().subtract(24, 'hours'))
            },
            order: {
                timestamp: 'ASC'
            }
        });
    }
}
