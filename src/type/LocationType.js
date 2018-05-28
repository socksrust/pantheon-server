import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLFloat } from 'graphql';

export default new GraphQLObjectType({
  name: 'Location',
  description: 'Location Type',
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
