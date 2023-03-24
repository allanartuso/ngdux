import { ActionCreator } from '@ngrx/store';

export type ActionPayload<T extends ActionCreator> = Omit<ReturnType<T>, 'type'>;
