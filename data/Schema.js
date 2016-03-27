/* eslint no-use-before-define:0, new-cap: 0 */
import _findIndex from 'lodash.findindex';
import Debug from 'debug';

import {
  getUser,
  getUserByEmail,
  getUsers,
} from './User';

import {
  getLift,
  getLifts,
  removeLift,
  saveLift,
} from './Lift';

import {
  getWorkout,
  getWorkouts,
} from './Workout';

// Stubs needed to regenerate schema . . . not ideal
// const removeLift = () => {};
// const getUserByEmail = () => {};
// const getUser = () => {};
// const getLifts = () => {};
// const getWorkouts = () => {};
// const getWorkout = () => {};
// const getUsers = () => {};
// const getLift = () => {};
// const saveLift = () => {};

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
  offsetToCursor,
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
        return liftType;
      } else if (obj.email) {
        return userType;
      } else if (obj.user_id) {
        return workoutType;
      }

      return null;
    }
);

// OBJECTS

const liftType = new GraphQLObjectType({
  description: 'Records of lifts recorded',
  name: 'Lift',
  fields: () => ({
    id: globalIdField('Lift'),
    reps: {
      description: 'Reps',
      type: GraphQLInt,
    },
    sets: {
      description: 'Sets',
      type: GraphQLInt,
    },
    weight: {
      description: 'Weight',
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


const workoutType = new GraphQLObjectType({
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

const userType = new GraphQLObjectType({
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
  nodeType: workoutType,
});

const {
  connectionType: LiftConnection,
  edgeType: GraphQLLiftEdge,
} = connectionDefinitions({
  name: 'lift',
  nodeType: liftType,
});

// QUERIES

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    user: {
      description: 'Query user users',
      type: userType,
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
      type: new GraphQLList(userType),
      args: {},
      resolve() {
        return getUsers();
      },
    },
    workout: {
      description: 'Workouts',
      type: workoutType,
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
      type: liftType,
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
const EditLiftMutation = mutationWithClientMutationId({
  name: 'EditLiftMutation',
  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description: 'Lift Id',
    },
    workout_id: {
      type: new GraphQLNonNull(GraphQLID),
      description: 'Workout ID',
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Workout name',
    },
    reps: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'Reps',
    },
    sets: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'Sets',
    },
    weight: {
      type: new GraphQLNonNull(GraphQLFloat),
      description: 'Weight',
    },
  },
  outputFields: {
    lift: {
      type: liftType,
      resolve: (lift) => lift,
    },
  },
  mutateAndGetPayload: ({ id, name, reps, sets, weight, workout_id }) => {
    const localLiftId = fromGlobalId(id).id;

    const liftEntry = {
      workout_id,
      id: localLiftId,
      name,
      reps,
      sets,
      weight,
    };

    return saveLift(liftEntry);
  },
});

const RemoveLiftMutation = mutationWithClientMutationId({
  name: 'RemoveLiftMutation',
  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description: 'Lift Id',
    },
  },
  outputFields: {
    removedLiftId: {
      type: GraphQLID,
      resolve: ({ id }) => id,
    },
    workout: {
      type: workoutType,
      resolve: (lift) => getWorkout(lift.workout_id),
    },
  },
  mutateAndGetPayload: ({ id }) => {
    const localLiftId = fromGlobalId(id).id;
    let lift;

    return getLift({ id: localLiftId })
      .then((dbLift) => {lift = dbLift; return removeLift(lift.id);})
      .then(() => lift);
  },
});

const AddLiftMutation = mutationWithClientMutationId({
  name: 'AddLiftMutation',
  inputFields: {
    workout_id: {
      type: new GraphQLNonNull(GraphQLID),
      description: 'Workout ID',
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Workout name',
    },
    reps: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'Reps',
    },
    sets: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'Sets',
    },
    weight: {
      type: new GraphQLNonNull(GraphQLFloat),
      description: 'Weight',
    },
  },
  outputFields: {
    newLiftEdge: {
      type: GraphQLLiftEdge,
      resolve: (payload) => Promise.all([
        getLifts(payload.workout_id),
        getLift(payload.id),
      ]).then(([lifts, lift]) => ({
        cursor: offsetToCursor(_findIndex(lifts, ['id', lift.id])),
        node: lift,
      })),
    },
    workout: {
      type: workoutType,
      resolve: (payload) => getWorkout(payload.workout_id),
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

    return saveLift(liftEntry);
  },
});

const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    addLift: AddLiftMutation,
    removeLift: RemoveLiftMutation,
    editLift: EditLiftMutation,
  }),
});

export const Schema = new GraphQLSchema({
  query: Query,
  mutation: mutationType,
});

export default Schema;
