import { GraphQLString, GraphQLNonNull, GraphQLInputObjectType, GraphQLList } from 'graphql';

import { mutationWithClientMutationId } from 'graphql-relay';

import UserType from '../type/UserType';
import { UserLoader } from '../loader';

import { Event as EventModel } from '../model';

export default mutationWithClientMutationId({
  name: 'ChangePassword',
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

    const { title, description, date, publicLimit, schedule } = args;

    // @TODO improve validation logic
    if (!title.trim() || title.trim().length < 2) {
      return {
        error: 'Título inválido',
      };
    }

    if (!description.trim() || description.trim().length < 2) {
      return {
        error: 'Descrição inválida',
      };
    }

    // Create new record
    const data = new EventModel({
      title,
      description,
      date,
      publicLimit,
      schedule,
    });
    const event = await data.save();

    return event;
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
  },
});
