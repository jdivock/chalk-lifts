import knex from './dbConnection';

import {
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import {
  connectionArgs,
  connectionFromPromisedArray,
  globalIdField,
} from 'graphql-relay';

import User from './User';
import { LiftConnection } from './Connections';
import { nodeInterface } from './NodeInterface';

export default new GraphQLObjectType({
  description: `Workout entry, consisting of individual lifts
    done during workout`,
  name: 'Workout',
  fields: () => ({
    id: globalIdField('Workout'),
    date: {
      description: 'Date of the workout',
      type: GraphQLString,
    },
    created_at: {
      description: 'Date workout was created on',
      type: GraphQLString,
    },
    updated_at: {
      description: 'Date workout was last updated on',
      type: GraphQLString,
    },
    name: {
      description: 'Name of the Workout',
      type: GraphQLString,
    },
    comments: {
      description: 'Lift Comments',
      type: GraphQLString,
    },
    user: {
      description: 'User that the workout is tied to',
      type: User,
      resolve(obj) {
        return knex('users').where({ uid: obj.user_id }).first();
      },
    },
    lifts: {
      type: LiftConnection,
      args: connectionArgs,
      resolve: (workout, args) => connectionFromPromisedArray(
          knex('lifts').where({ workout_id: workout.id }),
          args
          ),
    },
  }),
  interfaces: [nodeInterface],
});
