import express from 'express';
import graphQLHTTP from 'express-graphql';
import Schema from './data/Schema';
import DebugOut from 'debug';
import { printSchema } from 'graphql/utilities';

let debug = DebugOut('server.js');

const GRAPHQL_PORT = 8080;

// Expose a GraphQL endpoint
var graphQLServer = express();

graphQLServer.use('/', express.static('public'));

graphQLServer.use('/graphql', graphQLHTTP({schema: Schema, pretty: true}));
graphQLServer.listen(GRAPHQL_PORT, () => console.log(
  `GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}`
));

// Pretty print schema
debug(printSchema(Schema));
