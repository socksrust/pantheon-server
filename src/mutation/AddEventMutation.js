import { GraphQLString, GraphQLNonNull, GraphQLInputObjectType, GraphQLList } from 'graphql';

import { mutationWithClientMutationId } from 'graphql-relay';

import UserType from '../type/UserType';
import { UserLoader } from '../loader';

import { Event as EventModel } from '../model';
import type { EventType } from '../loader/EventLoader';
import type { GraphQLContext } from '../TypeDefinition';

type Output = {
  message: string,
  error: string,
};

export default mutationWithClientMutationId({
  name: 'AddEvent',
  inputFields: {
    title: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'event title',
    },
    description: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'event description',
    },
    date: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'event date',
    },
    publicLimit: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'event date',
    },
    image: {
      type: GraphQLString,
      description: 'event image',
    },
    schedule: {
      type: new GraphQLList(
        new GraphQLInputObjectType({
          name: 'schedule',
          description: 'event schedule',
          fields: () => ({
            talker: {
              type: GraphQLString,
            },
            title: {
              type: GraphQLString,
            },
            description: {
              type: GraphQLString,
            },
            time: {
              type: GraphQLString,
            },
          }),
        }),
      ),
    },
  },
  mutateAndGetPayload: async (args: EventType, context: GraphQLContext) => {
    const { user } = context;

    if (!user) {
      throw new Error('invalid user');
    }

    const { title, description } = args;

    // @TODO improve validation logic
    if (!title.trim() || title.trim().length < 2) {
      return {
        message: 'Invalid title',
        error: 'INVALID_TITLE',
      };
    }

    if (!description.trim() || description.trim().length < 2) {
      return {
        message: 'Invalid description',
        error: 'INVALID_DESCRIPTION',
      };
    }

    // Create new record
    const data = new EventModel({
      ...args,
    });
    await data.save();

    // return event;
    return {
      message: 'Event created with success',
      error: null,
    };
  },
  outputFields: {
    message: {
      type: GraphQLString,
      resolve: ({ message }: Output) => message,
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }: Output) => error,
    },
  },
});
