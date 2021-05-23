/*!
 * Copyright 2021 Ethan Elliott
 */

import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNumber, IsObject, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Field, ObjectType } from 'type-graphql';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ResultStatus } from '../types/result-status.enum';
import { Checkable } from './checkable';

@ObjectType({
    description: 'Uptime check results',
})
@Entity()
export class Results {
    @IsUUID()
    @PrimaryGeneratedColumn('uuid')
    @Field({description: 'The ID of the uptime results'})
    id: string;

    @IsDate()
    @CreateDateColumn({type: 'timestamptz'})
    @Field({description: 'The timestamp of the uptime results'})
    timestamp: Date;

    @IsDate()
    @Column({type: 'timestamptz'})
    @Field({description: 'The start time of the uptime request'})
    startedAt: Date;

    @IsDate()
    @Column({type: 'timestamptz'})
    @Field({description: 'The finish time of the uptime request'})
    finishedAt: Date;

    @IsNumber()
    @Column()
    @Field({description: 'The http status of the uptime results'})
    httpStatus: number;

    @IsString()
    @Column()
    @Field({description: 'The status text of the uptime results'})
    statusText: string;

    @IsEnum(ResultStatus)
    @Column('enum', {enum: ResultStatus})
    @Field(type => ResultStatus, {description: 'The status of the uptime results'})
    status: ResultStatus;

    @Type(() => Checkable)
    @IsObject()
    @ValidateNested()
    @ManyToOne(() => Checkable, checkable => checkable.results, {onDelete: 'CASCADE'})
    checkable: Checkable;
}
