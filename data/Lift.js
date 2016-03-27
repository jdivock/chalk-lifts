import Debug from 'debug';
import { Lift } from './bookshelf';

const debug = Debug('chalk-lifts:data/Lift.js');

debug('instantiating Lift model');

export const getLift = (id) =>
  new Lift({ id })
    .fetch()
    .then(lift => lift.toJSON())
    .catch(() => {});

export const getLifts = (workout_id) =>
  new Lift()
    .where({ workout_id })
    .fetchAll()
    .then(lifts => lifts.toJSON())
    .catch(() => []);

export const addLift = (lift) =>
  new Lift(lift)
    .save()
    .then(newLift => newLift.toJSON());
