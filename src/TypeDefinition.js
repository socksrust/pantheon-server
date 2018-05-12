/* @flow */
import type Dataloader from 'dataloader';
import type { UserType } from './loader/UserLoader';

type Key = string;

export type Dataloaders = {
  UserLoader: Dataloader<Key, *>,
};

export type GraphQLContext = {
  user?: UserType,
  dataloaders: Dataloaders,
};
