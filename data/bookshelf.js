import Knex from 'knex';
import config from '../knexfile';
import Bookshelf from 'bookshelf';
import Debug from 'debug';

const debug = Debug('QLifts:bookshelf');
const env = 'development';
const knex = Knex(config[env]);

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


// knex.migrate.latest([config]);
// knex.seed.run([config]);
