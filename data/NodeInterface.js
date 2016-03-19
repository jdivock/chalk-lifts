import knex from './dbConnection';

import {
  fromGlobalId,
  nodeDefinitions,
} from 'graphql-relay';

import Lift from './Lift';
import Workout from './Workout';
import User from './User';

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

export { nodeInterface, nodeField };
