import { User } from './bookshelf';

export const getUsers = () =>
  new User()
    .fetchAll()
    .then(users => users.toJSON())
    .catch(() => {});

export const getUser = (id) =>
  new User({ id })
    .fetch()
    .then(user => user.toJSON())
    .catch(() => {});

export const getUserByEmail = (email) =>
  new User({ email })
    .fetch()
    .then(user => user.toJSON())
    .catch(() => {});
