// @flow

import { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLID } from 'graphql';
import { globalIdField, connectionArgs, fromGlobalId } from 'graphql-relay';
import { NodeInterface } from '../interface/NodeInterface';

import UserType from './UserType';
import EventType from './EventType';
import { NodeField } from '../interface/NodeInterface';
import { UserLoader, EventLoader } from '../loader';
import UserConnection from '../connection/UserConnection';
import EventsConnection from '../connection/EventsConnection';

import type { GraphQLContext } from '../TypeDefinition';
import type { EventType as EventPayload } from '../loader/EventLoader';

type ConectionArguments = {
  search: string,
  first: number,
  after: String,
  last: number,
  before: string,
};

export default new GraphQLObjectType({
  name: 'Query',
  description: 'The root of all... queries',
  fields: () => ({
    node: NodeField,
    me: {
      type: UserType,
      resolve: (root, args, context: GraphQLContext) =>
        context.user ? UserLoader.load(context, context.user._id) : null,
    },
    events: {
      type: EventsConnection.connectionType,
      args: {
        ...connectionArgs,
        search: {
          type: GraphQLString,
        },
      },
      resolve: (obj: EventPayload, args: ConectionArguments, context: GraphQLContext) =>
        EventLoader.loadEvents(context, args),
    },
    user: {
      type: UserType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve: (obj, args, context) => {
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
      resolve: (obj, args: ConectionArguments, context: GraphQLContext) => UserLoader.loadUsers(context, args),
    },
  }),
});
