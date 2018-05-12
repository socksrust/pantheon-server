// @flow

import { GraphQLInt } from 'graphql';

import { connectionDefinitions } from 'graphql-relay';

import EventType from '../type/EventType';

export default connectionDefinitions({
  name: 'Event',
  nodeType: EventType,
  connectionFields: {
    count: {
      type: GraphQLInt,
    },
  },
});
