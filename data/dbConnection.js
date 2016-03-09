import knexLib from 'knex';
import config from '../knexfile';

const env = 'development';
const knex = knexLib(config[env]);

module.exports = knex;

knex.migrate.latest([config]);
knex.seed.run([config]);
