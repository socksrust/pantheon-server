// @flow

import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
  GraphQLList,
  GraphQLFloat,
  GraphQLInt,
} from 'graphql';
import { connectionArgs, fromGlobalId } from 'graphql-relay';
import { NodeField } from '../interface/NodeInterface';

import UserType from './UserType';
import EventType from './EventType';
import { UserLoader, EventLoader } from '../loader';
import UserConnection from '../connection/UserConnection';
import EventsConnection from '../connection/EventsConnection';

import type { GraphQLContext } from '../TypeDefinition';
import type { EventType as EventPayload } from '../loader/EventLoader';
import type { UserType as UserPayload } from '../loader/UserLoader';

type ConectionArguments = {
  search: string,
  first: number,
  after: String,
  last: number,
  before: string,
};

type LoadByIdArgs = {
  id: string,
};

export default new GraphQLObjectType({
  name: 'Query',
  description: 'The root of all... queries',
  fields: () => ({
    node: NodeField,
    me: {
      type: UserType,
      resolve: (root: UserPayload, args: void, context: GraphQLContext) =>
        context.user ? UserLoader.load(context, context.user._id) : null,
    },
    events: {
      type: EventsConnection.connectionType,
      args: {
        ...connectionArgs,
        search: {
          type: GraphQLString,
        },
        distance: {
          type: GraphQLInt,
        },
        days: {
          type: GraphQLInt,
        },
        coordinates: {
          type: new GraphQLList(GraphQLFloat),
        },
      },
      resolve: (obj: EventPayload, args: ConectionArguments, context: GraphQLContext) =>
        EventLoader.loadEvents(context, args),
    },
    event: {
      type: EventType,
      args: {
        id: {
          type: GraphQLID,
        },
      },
      resolve: (obj: EventPayload, args: LoadByIdArgs, context: GraphQLContext) => {
        const { id } = fromGlobalId(args.id);
        return EventLoader.load(context, id);
      },
    },
    user: {
      type: UserType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve: (obj: UserPayload, args: LoadByIdArgs, context: GraphQLContext) => {
        const { id } = fromGlobalId(args.id);
        return UserLoader.load(context, id);
      },
    },
    users: {
      type: UserConnection.connectionType,
      args: {
        ...connectionArgs,
        search: {
          type: GraphQLString,
        },
      },
      resolve: (obj: UserPayload, args: ConectionArguments, context: GraphQLContext) =>
        UserLoader.loadUsers(context, args),
    },
  }),
});
