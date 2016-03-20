/* eslint no-param-reassign: 0 */
import { User, Workout, Lift } from './data/bookshelf';

export default (req, res, next) => {
  req = Object.assign(req, { User, Workout, Lift });
  next();
};
