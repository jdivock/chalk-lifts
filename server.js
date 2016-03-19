/* eslint no-console: 0 */
import Debug from 'debug';
import express from 'express';
import graphQLHTTP from 'express-graphql';
import path from 'path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

import { Schema } from './data/schema';
import dbMiddleware from './dbMiddleware';

const debug = Debug('QLifts:server.js');

Debug.enable('*');

debug('server starting');

const APP_PORT = 3000;
const GRAPHQL_PORT = 8080;

// Expose a GraphQL endpoint
const graphQLServer = express();

graphQLServer.use(dbMiddleware);
graphQLServer.use('/', graphQLHTTP(request => ({
  graphiql: true,
  pretty: true,
  rootValue: { knex: request.knex },
  schema: Schema,
})));

graphQLServer.listen(GRAPHQL_PORT, () => console.log(
  `GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}`
));

// Serve the Relay app
// const compiler = webpack({
//   entry: path.resolve(__dirname, 'js', 'app.js'),
//   module: {
//     loaders: [
//       {
//         exclude: /node_modules/,
//         loader: 'babel',
//         test: /\.js$/,
//       },
//     ],
//   },
//   output: { filename: 'app.js', path: '/' },
// });
//
// const app = new WebpackDevServer(compiler, {
//   contentBase: '/public/',
//   proxy: { '/graphql': `http://localhost:${GRAPHQL_PORT}` },
//   publicPath: '/js/',
//   stats: { colors: true },
// });
//
// // Serve static resources
// app.use('/', express.static(path.resolve(__dirname, 'public')));
// app.listen(APP_PORT, () => {
//   console.log(`App is now running on http://localhost:${APP_PORT}`);
// });
