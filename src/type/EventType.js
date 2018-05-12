// @flow

import { GraphQLObjectType, GraphQLString } from 'graphql';
import { globalIdField } from 'graphql-relay';
import { NodeInterface } from '../interface/NodeInterface';

export default new GraphQLObjectType({
  name: 'Event',
  description: 'Evemt data',
  fields: () => ({
    id: globalIdField('Event'),
    _id: {
      type: GraphQLString,
      resolve: obj => obj._id,
    },
    title: {
      type: GraphQLString,
      resolve: obj => obj.title,
    },
    description: {
      type: GraphQLString,
      resolve: obj => obj.description,
    },
    date: {
      type: GraphQLString,
      resolve: obj => obj.date,
    },
    publicLimit: {
      type: GraphQLString,
      resolve: obj => obj.publicLimit,
    },
    schedule: {
      type: GraphQLString,
      resolve: obj => obj.schedule,
    },
  }),
  interfaces: () => [NodeInterface],
});
