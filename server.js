/* eslint no-console: 0 */
import {schema} from './data/Schema';
import WebpackDevServer from 'webpack-dev-server';
import express from 'express';
import graphQLHTTP from 'express-graphql';
import path from 'path';
import webpack from 'webpack';

const GRAPHQL_PORT = 8080;
const APP_PORT = 3000;

// Expose a GraphQL endpoint
const graphQLServer = express();
graphQLServer.use('/', graphQLHTTP({ schema, pretty: true }));
graphQLServer.listen(GRAPHQL_PORT, () => console.log(
  `GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}`
));

// Serve the Relay app
const compiler = webpack({
  entry: path.resolve(__dirname, 'js', 'app.js'),
  module: {
    loaders: [
      {
        loader: 'babel',
        test: /\.js$/,
        cacheDirectory: true,
        presets: ['es2015', 'react', 'stage-0', 'relay'],
      },
    ],
  },
  output: { filename: 'app.js', path: '/' },
});

const app = new WebpackDevServer(compiler, {
  contentBase: '/public/',
  proxy: { '/graphql': `http://localhost:${GRAPHQL_PORT}` },
  publicPath: '/js/',
  stats: { colors: true },
});

app.use('/', express.static(path.resolve(__dirname, 'public')));
app.listen(APP_PORT, () => {
  console.log(`App is now running on http://localhost:${APP_PORT}`);
});
