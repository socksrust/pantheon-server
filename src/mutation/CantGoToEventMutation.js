import { GraphQLString, GraphQLNonNull, GraphQLID } from 'graphql';

import { mutationWithClientMutationId } from 'graphql-relay';

import { Event as EventModel } from '../model';
import type { GraphQLContext } from '../TypeDefinition';

type Arguments = {
  eventId: string,
};

type Output = {
  message: string,
  error: string,
};

export default mutationWithClientMutationId({
  name: 'CantGoToEvent',
  inputFields: {
    eventId: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  mutateAndGetPayload: async (args: Arguments, { user }: GraphQLContext) => {
    if (!user) {
      return {
        message: 'Invalid User',
        error: 'INVALID_USER',
      };
    }

    const { eventId } = args;

    const event = await EventModel.findOne({
      _id: eventId,
    });

    if (!event) {
      return {
        message: 'Event does not exists',
        error: 'INVALID_EVENT',
      };
    }

    const { notGoingList } = event;

    await event.update({
      notGoingList: [...notGoingList, user._id],
    });

    return {
      message: 'Ok! we have added you to not going list',
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
