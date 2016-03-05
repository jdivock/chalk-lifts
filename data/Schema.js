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
  return knex('lift').where({ id }).first();
}

function getWorkout(id) {
  return knex('workout').where({ id }).first();
}

function getAccount(id) {
  return knex('account').where({ id }).first();
}

const { nodeInterface, nodeField } = nodeDefinitions(
    (globalId) => {
      const { type, id } = fromGlobalId(globalId);
      if (type === 'Lift') {
        return getLift(id);
      } else if (type === 'Account') {
        return getAccount(id);
      } else if (type === 'Workout') {
        return getWorkout(id);
      }

      return null;
    },
    (obj) => {
      // This is super hacky, might need bookshelf or a way
      // to define types to decent what the obj is
      if (obj.workoutId) {
        return Lift;
      } else if (obj.email) {
        return Account;
      } else if (obj.accountId) {
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
    workoutid: {
      description: 'Identifier of workout lift pertains to',
      type: GraphQLID,
    },
    workout: {
      type: WorkoutConnection,
      args: connectionArgs,
      resolve: (lift, args) => connectionFromPromisedArray(
          knex('workout').where({ id: lift.workoutid }),
          args
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
      type: GraphQLInt,
    },
    name: {
      description: 'Name of the Workout',
      type: GraphQLString,
    },
    comments: {
      description: 'Lift Comments',
      type: GraphQLString,
    },
    account: {
      description: 'Account that the workout is tied to',
      type: Account,
      resolve(obj) {
        return knex('account').where({ id: obj.userid }).first();
      },
    },
    lifts: {
      type: LiftConnection,
      args: connectionArgs,
      resolve: (workout, args) => connectionFromPromisedArray(
          knex('lift').where({ workoutid: workout.id }),
          args
          ),
    },
  }),
  interfaces: [nodeInterface],
});

const Account = new GraphQLObjectType({
  name: 'Account',
  fields: () => ({
    id: globalIdField('Account'),
    name: {
      description: 'Name of user who holds the account',
      type: GraphQLString,
    },
    email: {
      description: 'Email address of account',
      type: GraphQLString,
    },
    workouts: {
      type: WorkoutConnection,
      args: connectionArgs,
      resolve: (account, args) => connectionFromPromisedArray(
          knex('workout').where({ userid: account.id }),
          args
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
    account: {
      description: 'Query user accounts',
      type: Account,
      args: {
        id: {
          description: 'Account ID',
          type: GraphQLID,
        },
        email: {
          description: 'Email address of the account',
          type: GraphQLString,
        },
      },
      resolve(obj, args) {
        if (args.id) {
          return knex('account').where({ id: args.id }).first();
        } else if (args.email) {
          return knex('account').where({ email: args.email }).first();
        }
      },
    },
    accounts: {
      description: 'List of accounts in the system',
      type: new GraphQLList(Account),
      args: {},
      resolve() {
        return knex('account');
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
        return knex('workout').where({ id: args.id }).first();
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
        return knex('lift').where({ id: args.id }).first();
      },
    },
    node: nodeField,
  }),
});

// MUTATIONS

const AddLiftMutation = mutationWithClientMutationId({
  name: 'AddLiftMutation',
  inputFields: {
    workoutid: {
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
  mutateAndGetPayload: ({ workoutid, sets, reps, name, weight }) => {
    const localWorkoutId = fromGlobalId(workoutid).id;

    const liftEntry = {
      workoutid: localWorkoutId,
      name,
      reps,
      sets,
      weight,
    };

    debug(liftEntry);

    return knex('lift')
      .returning('id')
      .insert(liftEntry);
  },
});
// fields: {
//   addLift: {
//     description: 'Add a lift to an existing workout',
//     type: Lift,
//     args: {
//       workoutid: {
//         type: new GraphQLNonNull(GraphQLID),
//         description: 'Workout identifier'
//       },
//       name: {
//         type: new GraphQLNonNull(GraphQLString),
//         description: 'Workout name'
//       },
//       reps: {
//         type: new GraphQLNonNull(GraphQLInt),
//         description: 'Bro reps',
//       },
//       sets: {
//         type: new GraphQLNonNull(GraphQLInt),
//         description: 'Bro sets',
//       },
//       weight: {
//         type: new GraphQLNonNull(GraphQLFloat),
//         description: 'Bro weight',
//       },
//     },
//     resolve(obj, args) {
//       var liftEntry = {
//         workoutid: args.workoutid,
//         name: args.name,
//         reps: args.reps,
//         sets: args.sets,
//         weight: args.weight,
//       };
//
//       return knex('lift')
//         .returning('id')
//         .insert(liftEntry).then(function (id) {
//           return Object.assign(liftEntry, {id: id});
//         });
//     }
//   },
// },

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
