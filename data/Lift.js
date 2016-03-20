import { Lift } from './bookshelf';

export const getLiftById = (id) =>
  new Lift({ id })
    .fetch()
    .then(lift => lift.toJSON())
    .catch(() => {});
