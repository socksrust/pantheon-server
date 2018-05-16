// @flow
import DataLoader from 'dataloader';
import { Event as EventModel } from '../model';
import { connectionFromMongoCursor, mongooseLoader } from '@entria/graphql-mongoose-loader';

import type { ConnectionArguments } from 'graphql-relay';
import type { GraphQLContext } from '../TypeDefinition';

type Schedule = {
  talker: string,
  title: string,
  description: string,
  time: number,
};

export type EventType = {
  id: string,
  _id: string,
  image: string,
  title: string,
  description: string,
  date: string,
  publicLimit: string,
  active: boolean,
  schedule: Array<Schedule>,
  publicList: Array<string>,
  waitList: Array<string>,
  notGoingList: Array<string>,
};

export default class Event {
  id: string;
  _id: string;
  image: string;
  title: string;
  description: string;
  date: string;
  publicLimit: string;
  active: boolean;
  schedule: Array<Schedule>;
  publicList: Array<string>;
  waitList: Array<string>;
  notGoingList: Array<string>;

  constructor(data: EventType) {
    this.id = data.id;
    this._id = data._id;
    this.image = data.image;
    this.title = data.title;
    this.description = data.description;
    this.date = data.date;
    this.publicLimit = data.publicLimit;
    this.active = data.active;
    this.schedule = data.schedule;
    this.publicList = data.publicList;
    this.waitList = data.waitList;
    this.notGoingList = data.notGoingList;
  }
}

export const getLoader = () => new DataLoader(ids => mongooseLoader(EventModel, ids));

const viewerCanSee = (context, data) =>
  // Anyone can see another user
  true;

export const load = async (context: GraphQLContext, id: string): Promise<?Event> => {
  if (!id) {
    return null;
  }

  let data;
  try {
    data = await context.dataloaders.EventLoader.load(id);
  } catch (err) {
    return null;
  }
  return viewerCanSee(context, data) ? new Event(data, context) : null;
};

export const clearCache = ({ dataloaders }: GraphQLContext, id: string) => dataloaders.EventLoader.clear(id.toString());

export const loadEvents = async (context: GraphQLContext, args: ConnectionArguments) => {
  console.log('context****', context);
  let conditions = {};

  if (args.search) {
    conditions = {
      ...conditions,
      title: {
        $regex: new RegExp(`${args.search}`, 'ig'),
      },
    };
  }

  const events = EventModel.find(conditions).sort({ createdAt: -1 });

  return connectionFromMongoCursor({
    cursor: events,
    context,
    args,
    loader: load,
  });
};
