import { ContainerInstance } from 'typedi';

export interface Context {
    requestId: string;
    container: ContainerInstance;
}
