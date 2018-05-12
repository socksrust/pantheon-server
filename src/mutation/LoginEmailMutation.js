// @flow
import { GraphQLString, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import { User } from '../model';
import { generateToken } from '../auth';

import type { UserType } from '../loader/UserLoader';

export default mutationWithClientMutationId({
  name: 'LoginEmail',
  inputFields: {
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    password: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async ({ email, password }: UserType) => {
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return {
        token: null,
        error: 'Invalid email or password',
      };
    }

    const correctPassword = user.authenticate(password);

    if (!correctPassword) {
      return {
        token: null,
        error: 'Invalid email or password',
      };
    }

    return {
      token: generateToken(user),
      error: null,
    };
  },
  outputFields: {
    token: {
      type: GraphQLString,
      resolve: ({ token }) => token,
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});
