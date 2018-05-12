// @flow

import { GraphQLObjectType, GraphQLString, GraphQLList } from 'graphql';
import { globalIdField } from 'graphql-relay';
import { NodeInterface } from '../interface/NodeInterface';
import ScheduleType from './ScheduleType';

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
    image: {
      type: GraphQLString,
      description: 'event image',
      resolve: obj => obj.image,
    },
    schedule: {
      type: new GraphQLList(ScheduleType),
      description: 'schedule',
      resolve: obj => obj.schedule,
    },
  }),
  interfaces: () => [NodeInterface],
});
