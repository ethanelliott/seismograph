import { Field, ObjectType } from 'type-graphql';

@ObjectType({
    description: 'Uptime value for interval',
})
export class UptimeOutput {
    @Field({description: 'The start date of the uptime value'})
    timestamp: Date;

    @Field({description: 'The percent uptime for the interval'})
    uptime: number;
}
