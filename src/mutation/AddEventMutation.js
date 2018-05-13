import { GraphQLString, GraphQLNonNull, GraphQLInputObjectType, GraphQLList } from 'graphql';

import { mutationWithClientMutationId } from 'graphql-relay';

import UserType from '../type/UserType';
import { UserLoader } from '../loader';

import { Event as EventModel } from '../model';
import EventType from '../type/EventType';

export default mutationWithClientMutationId({
  name: 'AddEvent',
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
          cep: {
            type: GraphQLString,
          },
          geolocation: {
            type: new GraphQLList(GraphQLString),
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
  mutateAndGetPayload: async (args, context) => {
    const { user } = context;
    if (!user) {
      throw new Error('invalid user');
    }

    const { title } = args;

    // @TODO improve validation logic
    if (!title.trim() || title.trim().length < 2) {
      return {
        error: 'Título inválido',
      };
    }

    // Create new record
    const data = new EventModel({
      ...args,
    });
    const event = await data.save();

    return {
      event,
      error: null,
    };
  },
  outputFields: {
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
    me: {
      type: UserType,
      resolve: (obj, args, context) => UserLoader.load(context, context.user.id),
    },
    event: {
      type: EventType,
      resolve: ({ event }) => event,
    },
  },
});
