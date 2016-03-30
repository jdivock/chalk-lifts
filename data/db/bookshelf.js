import Knex from 'knex';
import config from './knexfile';
import Bookshelf from 'bookshelf';
import Debug from 'debug';

const env = 'development';
const debug = Debug('chalk-lifts:bookshelf');
const knex = Knex(config[env]);

// knex.migrate.latest([config]);
// knex.seed.run([config]);

const bookshelf = Bookshelf(knex);

debug('setting up bookshelf ORM');

export const Lift = bookshelf.Model.extend({
  tableName: 'lifts',
});

export const Workout = bookshelf.Model.extend({
  tableName: 'workouts',
  lifts: function lifts() { return this.hasMany(Lift); },
});

export const User = bookshelf.Model.extend({
  tableName: 'users',
  workouts: function workouts() { return this.hasMany(Workout); },
});
