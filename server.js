import express from 'express';
import graphQLHTTP from 'express-graphql';
import Schema from './data/Schema';

const GRAPHQL_PORT = 8080;

// Expose a GraphQL endpoint
var graphQLServer = express();

graphQLServer.use('/', express.static('public'));

graphQLServer.use('/graphql', graphQLHTTP({schema: Schema, pretty: true}));
graphQLServer.listen(GRAPHQL_PORT, () => console.log(
  `GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}`
));
