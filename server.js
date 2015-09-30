import express from 'express';
import graphQLHTTP from 'express-graphql';
import Schema from './Schema';

const GRAPHQL_PORT = 8080;

// Expose a GraphQL endpoint
var graphQLServer = express();

graphQLServer.use(express.static(__dirname));

graphQLServer.use('/graphql', graphQLHTTP({schema: Schema, pretty: true}));
graphQLServer.listen(GRAPHQL_PORT, () => console.log(
  `GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}`
));
