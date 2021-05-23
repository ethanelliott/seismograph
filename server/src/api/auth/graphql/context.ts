import { Container } from 'typedi';
import { v4 } from 'uuid';
import { Context } from '../../types/context';

export const context = async (expressContext): Promise<Context> => {
    const requestId = v4();
    const container = Container.of(requestId);
    const c: Context = {
        requestId,
        container,
    };
    container.set('context', c);
    return c;
};
