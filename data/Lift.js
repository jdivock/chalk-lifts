import { Lift } from './bookshelf';

export const getLift = (id) =>
  new Lift({ id })
    .fetch()
    .then(lift => lift.toJSON())
    .catch(() => {});

export const getLifts = (workout_id) =>
  new Lift({ workout_id })
    .query(q => q.orderBy('date', 'desc'))
    .fetchAll()
    .then(lifts => lifts.toJSON())
    .catch(() => []);

export const addLift = (lift) =>
  new Lift(lift)
    .save()
    .then(newLift => newLift.id);
