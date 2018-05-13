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
  name: 'MoveToPresenceList',
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

    if (publicList.length === parseInt(publicLimit)) {
      return {
        message: "There's no more room on the presence list",
        error: 'NO_MORE_ROOM',
      };
    }

    const newWaitList = waitList.filter(person => person === user._id);
    console.log(newWaitList);

    await event.update({
      waitList: [...newWaitList],
      publicList: [...publicList, user._id],
    });

    return {
      message: 'You have been moved to the presence list',
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
