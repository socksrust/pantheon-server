import { GraphQLString, GraphQLInputObjectType } from 'graphql';

export default new GraphQLInputObjectType({
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
});
