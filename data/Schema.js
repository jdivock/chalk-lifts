/* eslint no-use-before-define:0, new-cap: 0 */
import Debug from 'debug';
import { getUser, getUserByEmail, getUsers } from './User';
import { getLift, getLifts, addLift } from './Lift';
import { getWorkout, getWorkouts } from './Workout';

const debug = Debug('chalk-lifts:Schema.js');

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
    lifts: {
      type: LiftConnection,
      args: connectionArgs,
      resolve: (workout, args) => connectionFromPromisedArray(
          getLifts(workout.id),
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
          getWorkouts(user.id),
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
  edgeType: GraphQLLiftEdge,
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
      resolve(obj, { id, email }) {
        debug('fetching user');
        if (id) {
          return getUser(id);
        }

        return getUserByEmail(email);
      },
    },
    users: {
      description: 'List of users in the system',
      type: new GraphQLList(User),
      args: {},
      resolve() {
        return getUsers();
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
      resolve(_, args) {
        return getWorkout(args.id);
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
      resolve(_, args) {
        return getLift(args.id);
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
    liftEdge: {
      type: Lift,
      // Some weird danger here, postgres returns an array of inserted
      // ids, in this case just one, and the last member is the
      // clientMutationId which I have no clue what it does.
      // So this works for now but thar be dragons
      resolve: (lift) => { debug(`derpin: ${lift.toJSON()}`); return lift.toJSON(); },
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

    return addLift(liftEntry);
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
