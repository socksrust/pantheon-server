import { GraphQLString, GraphQLInputObjectType, GraphQLList, GraphQLFloat } from 'graphql';

export default new GraphQLInputObjectType({
  name: 'location',
  description: 'event location',
  fields: () => ({
    coordinates: {
      type: GraphQLList(GraphQLFloat),
    },
    cep: {
      type: GraphQLString,
    },
    street: {
      type: GraphQLString,
    },
    number: {
      type: GraphQLString,
    },
  }),
});
