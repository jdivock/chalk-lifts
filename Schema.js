// TODO This feels like bad idea jeans
// Also, bookshelf or knex might not be the worst idea
// import pgp from 'pg-promise';
import knexLib from 'knex';
import {CONN_STRING} from './config';

console.log(CONN_STRING);

var knex = knexLib({
  client: 'pg',
  connection: CONN_STRING
});

import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID,
  GraphQLInt,
  GraphQLFloat,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList
} from 'graphql';

const Lift = new GraphQLObjectType({
  name: 'Lift',
  fields: () => ({
    id: {
      type: GraphQLID
    },
    reps: {
      type: GraphQLInt
    },
    sets: {
      type: GraphQLInt
    },
    weight: {
      type: GraphQLFloat
    },
    name: {
      type: GraphQLString
    },
    workout: {
      type: Workout,
      resolve(obj) {
        return knex('workout').where({ id: obj.workoutId }).first();
      }
    }
  })
});

const Workout = new GraphQLObjectType({
  name: 'Workout',
  fields: () => ({
    id: {
      type: GraphQLID
    },
    date: {
      type: GraphQLInt
    },
    name: {
      type: GraphQLString
    },
    account: {
      type: Account,
      resolve(obj) {
        return knex('account').where({ id: obj.userId }).first();
      }
    },
    lifts: {
      type: new GraphQLList(Lift),
      resolve(obj) {
        return knex('lift').where({ workoutid: obj.id });
      }
    }
  })
});


const Account = new GraphQLObjectType({
  name: 'Account',
  fields: () => ({
    id: {
      type: GraphQLID
    },
    name: {
      type: GraphQLString
    },
    email: {
      type: GraphQLString
    },
    workouts: {
      type: new GraphQLList(Workout),
      resolve(obj) {
        return knex('workout').where({ userid: obj.id });
      }
    }
  })
});

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    account: {
      type: Account,
      args: {
        id: {
          type: GraphQLID
        },
        email: {
          type: GraphQLString
        }
      },
      resolve(obj, args) {
        if (args.id) {
          return knex('account').where({ id: args.id }).first();
        } else if (args.email) {
          return knex('account').where({ email: args.email }).first();
        }
      }
    },
    workout: {
      type: Workout,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID)
        }
      },
      resolve(obj, args) {
        return knex('workout').where({ id: args.id }).first();
      }
    },
    lift: {
      type: Lift,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID)
        }
      },
      resolve(obj, args) {
        return knex('lift').where({ id: args.id}).first();
      }
    }
  })
});

const Schema = new GraphQLSchema({
  query: Query
});
export default Schema;
