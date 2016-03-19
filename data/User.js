import knex from './dbConnection';

import {
  GraphQLID,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import {
  connectionArgs,
  connectionFromPromisedArray,
  globalIdField,
} from 'graphql-relay';

import { nodeInterface } from './NodeInterface.js';
import { WorkoutConnection } from './Connections';

const User = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: globalIdField('User'),
    uid: {
      description: 'User Id',
      type: GraphQLID,
    },
    name: {
      description: 'Name of user who holds the account',
      type: GraphQLString,
    },
    email: {
      description: 'Email address of user',
      type: GraphQLString,
    },
    profile_pic_url: {
      description: 'Profile pic url',
      type: GraphQLString,
    },
    workouts: {
      type: WorkoutConnection,
      args: connectionArgs,
      resolve: (user, args) =>
        connectionFromPromisedArray(
          knex('workouts')
            .where({ user_id: user.uid })
            .orderBy('created_at', 'desc'),
          args,
        ),
    },
  }),
  interfaces: [nodeInterface],
});

export default User;
