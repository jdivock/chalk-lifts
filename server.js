/* eslint no-console: 0, no-unused-vars: 0 */
import Debug from 'debug';
import express from 'express';
import graphQLHTTP from 'express-graphql';
import path from 'path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

import { Schema } from './data/schema';

const debug = Debug('chalk-lifts:server.js');

Debug.enable('chalk-lifts*');

debug('server starting');

const APP_PORT = 3000;
const GRAPHQL_PORT = 8080;

// Expose a GraphQL endpoint
const graphQLServer = express();

graphQLServer.use('/', graphQLHTTP(({ User, Lift, Workout }) => ({
  graphiql: true,
  pretty: true,
  schema: Schema,
})));

graphQLServer.listen(GRAPHQL_PORT, () => console.log(
  `GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}`
));

// Serve the Relay app
const compiler = webpack({
  entry: [
    'webpack-dev-server/client?http://localhost:3000/',
    path.resolve(__dirname, 'js', 'app.js'),
  ],
  module: {
    loaders: [
      {
        exclude: /node_modules/,
        loader: 'babel',
        test: /\.js$/,
      },
    ],
  },
  resolve: {
    root: path.resolve(__dirname),
    alias: {
      mutations: 'js/mutations',
      components: 'js/components',
      db: 'data/db',
      schema: 'data/schema',
    },
  },
  output: { filename: 'app.js', path: '/' },
});

const app = new WebpackDevServer(compiler, {
  contentBase: '/public/',
  proxy: { '/graphql': `http://localhost:${GRAPHQL_PORT}` },
  publicPath: '/js/',
  stats: { colors: true },
  noInfo: true,
});

// Serve static resources
app.use('/', express.static(path.resolve(__dirname, 'public')));
app.listen(APP_PORT, () => {
  console.log(`App is now running on http://localhost:${APP_PORT}`);
});
