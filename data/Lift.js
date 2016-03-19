import knex from './dbConnection';

import {
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import {
  connectionArgs,
  connectionFromPromisedArray,
  globalIdField,
} from 'graphql-relay';

import { WorkoutConnection } from './Connections';
import { nodeInterface } from './NodeInterface';

export default new GraphQLObjectType({
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
