import { User } from './bookshelf';

export const getUser = (query) =>
  new User(query)
    .fetch()
    .then(user => user.toJSON())
    .catch(() => {});

export const getWorkoutsForUser = (id) =>
  new User({ id })
    .fetch({
      withRelated: [
        { workouts: (query) => query.orderBy('date', 'desc') },
      ],
    })
    .then(user => user.related('workouts').toJSON());
