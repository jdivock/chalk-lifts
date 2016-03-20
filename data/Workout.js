import { Workout } from './bookshelf';

export const getWorkout = (query) =>
  new Workout(query)
    .fetch()
    .then(workout => workout.toJSON())
    .catch(() => {});

export const getWorkouts = (query) =>
  new Workout(query)
    .fetch()
    .then(workout => workout.toJSON())
    .catch(() => {});
