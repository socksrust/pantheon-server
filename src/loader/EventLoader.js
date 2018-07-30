// @flow
import DataLoader from 'dataloader';
import { Event as EventModel } from '../model';
import { connectionFromMongoCursor, mongooseLoader } from '@entria/graphql-mongoose-loader';
import idx from 'idx';
import type { ConnectionArguments } from 'graphql-relay';
import type { ObjectId } from 'mongoose';

import type { GraphQLContext } from '../TypeDefinition';

type Schedule = {
  talker: string,
  title: string,
  description: string,
  time: number,
};

type LocationType = {
  coordinates: Array<string>,
  cep: string,
  type: string,
  street: string,
  number: string,
};

export type EventType = {
  id: string,
  _id: ObjectId,
  image: string,
  title: string,
  description: string,
  date: string,
  publicLimit: string,
  active: boolean,
  schedule: Array<Schedule>,
  location: LocationType,
  publicList: Array<string>,
  waitList: Array<string>,
  notGoingList: Array<string>,
  createdBy: ObjectId,
};

export default class Event {
  id: string;
  _id: ObjectId;
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
  location: LocationType;
  createdBy: ObjectId;

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
    this.location = data.location;
    this.waitList = data.waitList;
    this.notGoingList = data.notGoingList;
    this.createdBy = data.createdBy;
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
  let conditions = {};

  if (args.search) {
    conditions = {
      ...conditions,
      title: {
        $regex: new RegExp(`${args.search}`, 'ig'),
      },
    };
  }

  if (args.distance && idx(args, _ => _.coordinates[0])) {
    const longitude = args.coordinates[0];
    const latitude = args.coordinates[1];

    conditions = {
      ...conditions,
      location: {
        $near: {
          $geometry: {
            coordinates: [longitude, latitude],
            type: 'Point',
          },
          $maxDistance: args.distance * 1000,
          $minDistance: 0,
        },
      },
    };
  }

  console.log('args***', args);
  const events = EventModel.find(conditions).sort({ createdAt: -1 });

  return connectionFromMongoCursor({
    cursor: events,
    context,
    args,
    loader: load,
  });
};
