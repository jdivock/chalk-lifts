/* eslint no-use-before-define:0 */
import knex from './dbConnection';
import deb from 'debug';

import User from './User';
import Workout from './Workout';
import Lift from './Lift';

import { nodeField } from './NodeInterface';

import {
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

import {
  fromGlobalId,
  mutationWithClientMutationId,
} from 'graphql-relay';

const debug = deb('Schema.js');

function getLift(id) {
  return knex('lifts').where({ id }).first();
}


// QUERIES

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    user: {
      description: 'Query users',
      type: User,
      args: {
        id: {
          description: 'User ID',
          type: GraphQLID,
        },
        email: {
          description: 'Email address of the user',
          type: GraphQLString,
        },
      },
      resolve(obj, args) {
        if (args.id) {
          return knex('users').where({ uid: args.id }).first();
        }

        return knex('users').where({ email: args.email }).first();
      },
    },
    users: {
      description: 'List of users in the system',
      type: new GraphQLList(User),
      args: {},
      resolve() {
        return knex('users');
      },
    },
    workout: {
      description: 'Workouts',
      type: Workout,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve(obj, args) {
        return knex('workouts').where({ id: args.id }).first();
      },
    },
    lift: {
      description: 'Retrieve lifts by identifier',
      type: Lift,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve(obj, args) {
        return knex('lifts').where({ id: args.id }).first();
      },
    },
    node: nodeField,
  }),
});

// MUTATIONS

const AddLiftMutation = mutationWithClientMutationId({
  name: 'AddLiftMutation',
  inputFields: {
    workout_id: {
      type: new GraphQLNonNull(GraphQLID),
      description: 'Workout identifier',
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Workout name',
    },
    reps: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'Bro reps',
    },
    sets: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'Bro sets',
    },
    weight: {
      type: new GraphQLNonNull(GraphQLFloat),
      description: 'Bro weight',
    },
  },
  outputFields: {
    newLift: {
      type: Lift,
      resolve: (id) => {
        // Some weird danger here, postgres returns an array of inserted
        // ids, in this case just one, and the last member is the
        // clientMutationId which I have no clue what it does.
        // So this works for now but thar be dragons
        debug('returned id', id);
        return getLift(id[0]);
      },
    },
  },
  mutateAndGetPayload: ({ workout_id, sets, reps, name, weight }) => {
    const localWorkoutId = fromGlobalId(workout_id).id;

    const liftEntry = {
      workout_id: localWorkoutId,
      name,
      reps,
      sets,
      weight,
    };

    debug(liftEntry);

    return knex('lifts')
      .returning('id')
      .insert(liftEntry);
  },
});

const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    addLiftMutation: AddLiftMutation,
  }),
});

export const Schema = new GraphQLSchema({
  query: Query,
  mutation: mutationType,
});

export default Schema;
