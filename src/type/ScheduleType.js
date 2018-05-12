import { GraphQLObjectType, GraphQLString } from 'graphql';

export default new GraphQLObjectType({
  name: 'Schedule',
  description: 'Represents Schedules',
  fields: () => ({
    _id: {
      type: GraphQLString,
      resolve: ({ _id }) => _id,
    },
    talker: {
      type: GraphQLString,
      resolve: obj => obj.talker,
    },
    title: {
      type: GraphQLString,
      resolve: obj => obj.title,
    },
    description: {
      type: GraphQLString,
      resolve: obj => obj.description,
    },
    time: {
      type: GraphQLString,
      resolve: obj => obj.time,
    },
  }),
});
