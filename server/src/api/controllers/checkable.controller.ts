/*!
 * Copyright 2021 Ethan Elliott
 */

import fetchFavicon from 'get-website-favicon';
import scrape from 'html-metadata';
import isUrl from 'is-url';
import { BodyParam, Get, JsonController, Post } from 'routing-controllers';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { Checkable } from '../models/checkable';
import { CheckableRepository } from '../repositories/checkable.repository';

@JsonController('/checkable')
export class CheckableController {
    constructor(
        @OrmRepository() private readonly _checkableRepository: CheckableRepository,
    ) {
    }

    @Get('')
    async getCheckables(): Promise<Array<Checkable>> {
        return this._checkableRepository.find();
    }

    @Post('')
    async newCheckable(
        @BodyParam('url') url: string,
    ): Promise<Checkable> {
        if (isUrl(url)) {
            try {
                const metadata = await scrape(url);
                const {icons} = await fetchFavicon(url);
                icons.sort((a, b) => a.rank - b.rank);
                const icon = icons[0].src;
                return this._checkableRepository.save({
                    url,
                    icon,
                    name: metadata.general.title
                });
            } catch (err) {
                return this._checkableRepository.save({
                    url,
                    icon: '',
                    name: url
                });
            }
        }
        throw new Error('Invalid URL!');
    }
}
