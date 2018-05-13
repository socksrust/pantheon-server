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
  name: 'AttendToEvent',
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

    const { publicList, publicLimit, waitList } = event;

    if (publicList.length >= parseInt(publicLimit)) {
      await event.update({
        waitList: [...waitList, user._id],
      });
      return {
        message: 'You have been added to the wait list',
        error: null,
      };
    }

    await event.update({
      publicList: [...publicList, user._id],
    });

    return {
      message: 'You have been added to eventList',
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
