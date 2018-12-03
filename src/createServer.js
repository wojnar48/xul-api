
const { GraphQLServer } = require('graphql-yoga');
const Mutation = require('./resolvers/Mutation');
const Query = require('./resolvers/Query');
const db = require('./db');

// Create the GraphQL Yoga Server
function createServer() {
  return new GraphQLServer({
    typeDefs: 'src/schema.graphql',
    // Define the API we want to expose for querying/mutating data
    resolvers: {
      Mutation,
      Query,
    },
    resolverValidationOptions: {
      requireResolversForResolveType: false,
    },
    // Gives us access to the db in resolvers
    context: req => ({ ...req, db }),
  });
}

module.exports = createServer;
