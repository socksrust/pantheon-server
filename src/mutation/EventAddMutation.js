import { GraphQLString, GraphQLNonNull, GraphQLInputObjectType, GraphQLList, GraphQLFloat } from 'graphql';

import { mutationWithClientMutationId } from 'graphql-relay';

import { Event as EventModel } from '../model';
import EventType from '../type/EventType';
import type { EventType as EvType } from '../loader/EventLoader';
import type { GraphQLContext } from '../TypeDefinition';

type Output = {
  message: string,
  error: string,
};

export default mutationWithClientMutationId({
  name: 'EventAdd',
  inputFields: {
    title: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'event title',
    },
    description: {
      type: GraphQLString,
      description: 'event description',
    },
    date: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'event date',
    },
    publicLimit: {
      type: GraphQLString,
      description: 'event date',
    },
    image: {
      type: GraphQLString,
      description: 'event image',
    },
    location: {
      type: new GraphQLInputObjectType({
        name: 'location',
        description: 'event location',
        fields: () => ({
          coordinates: {
            type: new GraphQLList(GraphQLFloat),
          },
          cep: {
            type: GraphQLString,
          },
          street: {
            type: GraphQLString,
          },
          number: {
            type: GraphQLString,
          },
        }),
      }),
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
  mutateAndGetPayload: async (args: EvType, context: GraphQLContext) => {
    const { user } = context;
    if (!user) {
      throw new Error('invalid user');
    }

    const { title } = args;

    // @TODO improve validation logic
    if (!title.trim() || title.trim().length < 2) {
      return {
        message: 'Invalid title',
        error: 'INVALID_TITLE',
      };
    }

    // Create new record
    const data = new EventModel({
      ...args,
    });
    const event = await data.save();

    // return event;
    return {
      message: 'Event created with success',
      error: null,
      event,
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
    event: {
      type: EventType,
      resolve: ({ event }) => event,
    },
  },
});
