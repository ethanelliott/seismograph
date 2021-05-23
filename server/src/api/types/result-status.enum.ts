import { registerEnumType } from 'type-graphql';

export enum ResultStatus {
    SUCCESS= 'SUCCESS',
    FAIL= 'FAIL',
}

registerEnumType(ResultStatus, {
    name: 'ResultStatus',
    description: 'The result status',
});
