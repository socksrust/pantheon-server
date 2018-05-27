import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLFloat } from 'graphql';

export default new GraphQLObjectType({
  name: 'location',
  description: 'event location',
  fields: () => ({
    coordinates: {
      type: new GraphQLList(GraphQLFloat),
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
