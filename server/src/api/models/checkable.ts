/*!
 * Copyright 2021 Ethan Elliott
 */

import { Type } from 'class-transformer';
import { IsArray, IsString, IsUrl, IsUUID, ValidateNested } from 'class-validator';
import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Results } from './results';

@ObjectType({
    description: 'Application to be checked',
})
@Entity()
export class Checkable {
    @IsUUID()
    @PrimaryGeneratedColumn('uuid')
    @Field({description: 'The ID of the application'})
    id: string;

    @IsUrl()
    @Column()
    @Field({description: 'The URL of the application'})
    url: string;

    @IsUrl()
    @Column()
    @Field({description: 'The icon of the application'})
    icon: string;

    @IsString()
    @Column()
    @Field({description: 'The name of the application'})
    name: string;

    @Type(() => Results)
    @IsArray()
    @ValidateNested()
    @OneToMany(() => Results, results => results.checkable, {cascade: true, onDelete: 'CASCADE'})
    @Field(type => [Results], {description: 'The uptime results of the application'})
    results: Array<Results>;
}
