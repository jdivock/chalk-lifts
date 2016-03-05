import knex from 'knex';
import { CONN_STRING } from './config';
import deb from 'debug';

const debug = deb('dbConnection.js');

debug(CONN_STRING);

export default knex({
  client: 'pg',
  connection: CONN_STRING,
});
