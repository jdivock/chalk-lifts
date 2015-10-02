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
  description: 'Records of lifts recorded',
  name: 'Lift',
  fields: () => ({
    id: {
      type: GraphQLID
    },
    reps: {
      description: 'Bro Reps',
      type: GraphQLInt
    },
    sets: {
      description: 'Bro Sets',
      type: GraphQLInt
    },
    weight: {
      description: 'Bro Weight',
      type: GraphQLFloat
    },
    name: {
      description: 'Lift Name',
      type: GraphQLString
    },
    workoutid: {
      description: 'Identifier of workout lift pertains to',
      type: GraphQLID
    },
    workout: {
      type: Workout,
      resolve(obj) {
        return knex('workout').where({ id: obj.workoutid }).first();
      }
    }
  })
});

const Workout = new GraphQLObjectType({
  description: `Workout entry, consisting of individual lifts
    done during workout`,
  name: 'Workout',
  fields: () => ({
    id: {
      type: GraphQLID
    },
    date: {
      description: 'Date of the workout',
      type: GraphQLInt
    },
    name: {
      description: 'Name of the Workout',
      type: GraphQLString
    },
    account: {
      description: 'Account that the workout is tied to',
      type: Account,
      resolve(obj) {
        return knex('account').where({ id: obj.userid }).first();
      }
    },
    lifts: {
      description: 'Lifts that the workout consisted of',
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
      description: 'Name of user who holds the account',
      type: GraphQLString
    },
    email: {
      description: 'Email address of account',
      type: GraphQLString
    },
    workouts: {
      description: 'Workouts account has recorded',
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
      description: 'Query user accounts',
      type: Account,
      args: {
        id: {
          description: 'Account ID',
          type: GraphQLID
        },
        email: {
          description: 'Email address of the account',
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
    accounts: {
      description: 'List of accounts in the system',
      type: new GraphQLList(Account),
      args: {},
      resolve() {
        return knex('account');
      }
    },
    workout: {
      description: 'Workouts',
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
      description: 'Retrieve lifts by identifier',
      type: Lift,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID)
        }
      },
      resolve(obj, args) {
        return knex('lift').where({ id: args.id}).first();
      }
    },
  })
});


const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addLift: {
      description: 'Add a lift to an existing workout',
      type: Lift,
      args: {
        workoutid: {
          type: new GraphQLNonNull(GraphQLID),
          description: 'Workout identifier'
        },
        name: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'Workout identifier'
        },
        reps: {
          type: new GraphQLNonNull(GraphQLInt),
          description: 'Workout identifier'
        },
        sets: {
          type: new GraphQLNonNull(GraphQLInt),
          description: 'Workout identifier'
        },
        weight: {
          type: new GraphQLNonNull(GraphQLFloat),
          description: 'Workout identifier'
        },
      },
      resolve(obj, args) {
        var liftEntry = {
          workoutid: args.workoutid,
          name: args.name,
          reps: args.reps,
          sets: args.sets,
          weight: args.weight,
        };

        return knex('lift')
          .returning('id')
          .insert(liftEntry).then(function (id) {
            return Object.assign(liftEntry, {id: id});
          });
      }
    },
  },
});

const Schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation
});
export default Schema;
