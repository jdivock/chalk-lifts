/* eslint no-param-reassign: 0 */
import knex from './data/dbConnection';

export default (req, res, next) => {
  req.knex = knex;
  next();
};
