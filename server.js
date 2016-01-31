import express from 'express';
import graphQLHTTP from 'express-graphql';
import Schema from './data/Schema';
import debugOut from 'debug';
import { printSchema } from 'graphql/utilities';

const debug = debugOut('server.js');

const GRAPHQL_PORT = 8080;

// Expose a GraphQL endpoint
const graphQLServer = express();

graphQLServer.use('/', express.static('public'));

graphQLServer.use('/graphql', graphQLHTTP({ schema: Schema, pretty: true }));
graphQLServer.listen(GRAPHQL_PORT, () => debug(
  `GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}`
));

// Pretty print schema
debug(printSchema(Schema));
