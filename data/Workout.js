import { Workout } from './bookshelf';
import Debug from 'debug';

const debug = Debug('chalk-lifts:data/Workout.js');

debug('instantiating workout model');

export const getWorkout = (id) =>
  new Workout({ id })
    .fetch()
    .then(workout => workout.toJSON())
    .catch(() => {});

export const getWorkouts = (user_id) =>
  new Workout()
    .where({ user_id })
    .query(q => q.orderBy('date', 'desc'))
    .fetchAll()
    .then(workouts => workouts.toJSON())
    .catch(() => []);
