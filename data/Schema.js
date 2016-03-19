/* eslint no-use-before-define:0 */
import knex from './dbConnection';
import deb from 'debug';

const debug = deb('Schema.js');

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
  connectionArgs,
  connectionDefinitions,
  connectionFromPromisedArray,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
} from 'graphql-relay';


// Helpers, probably belong in their own js file eventually
function getLift(id) {
  return knex('lifts').where({ id }).first();
}

function getWorkout(id) {
  return knex('workouts').where({ id }).first();
}

function getUser(uid) {
  return knex('users').where({ uid }).first();
}

const { nodeInterface, nodeField } = nodeDefinitions(
    (globalId) => {
      const { type, id } = fromGlobalId(globalId);
      if (type === 'Lift') {
        return getLift(id);
      } else if (type === 'User') {
        return getUser(id);
      } else if (type === 'Workout') {
        return getWorkout(id);
      }

      return null;
    },
    (obj) => {
      // This is super hacky, might need bookshelf or a way
      // to define types to decent what the obj is
      if (obj.workout_id) {
        return Lift;
      } else if (obj.email) {
        return User;
      } else if (obj.user_id) {
        return Workout;
      }

      return null;
    }
);

// OBJECTS

const Lift = new GraphQLObjectType({
  description: 'Records of lifts recorded',
  name: 'Lift',
  fields: () => ({
    id: globalIdField('Lift'),
    reps: {
      description: 'Bro Reps',
      type: GraphQLInt,
    },
    sets: {
      description: 'Bro Sets',
      type: GraphQLInt,
    },
    weight: {
      description: 'Bro Weight',
      type: GraphQLFloat,
    },
    name: {
      description: 'Lift Name',
      type: GraphQLString,
    },
    comments: {
      description: 'Lift Comments',
      type: GraphQLString,
    },
    workout_id: {
      description: 'Identifier of workout lift pertains to',
      type: GraphQLID,
    },
    workout: {
      type: WorkoutConnection,
      args: connectionArgs,
      resolve: (lift, args) => connectionFromPromisedArray(
        knex('workouts')
          .where({ id: lift.workout_id })
          .orderBy('date', 'desc'),
        args,
      ),
    },
  }),
  interfaces: [nodeInterface],
});


const Workout = new GraphQLObjectType({
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

const User = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: globalIdField('User'),
    uid: {
      description: 'User Id',
      type: GraphQLID,
    },
    name: {
      description: 'Name of user who holds the user',
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

// Connections

const {
  connectionType: WorkoutConnection,
} = connectionDefinitions({
  name: 'Workout',
  nodeType: Workout,
});

const {
  connectionType: LiftConnection,
} = connectionDefinitions({
  name: 'Lift',
  nodeType: Lift,
});

// QUERIES

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    user: {
      description: 'Query user users',
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
