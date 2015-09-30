// TODO This feels like bad idea jeans
// Also, bookshelf or knex might not be the worst idea
import pgp from 'pg-promise';
import {CONN_STRING} from './config';

var db = pgp()(CONN_STRING);

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
        return db.query(
            'SELECT * FROM Workout WHERE id = ${id^}',
            {id: obj.workoutid},
            1
        );
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
        return db.query(
            'SELECT * FROM Account WHERE id = ${id^}',
            {id: obj.userid},
            1
        );
      }
    },
    lifts: {
      type: new GraphQLList(Lift),
      resolve(obj) {
        return db.query(
            'SELECT * FROM Lift WHERE workoutId = ${id^}',
            {id: obj.id}
        );
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
        return db.query(
            'SELECT * FROM Workout WHERE userId = ${id^}',
            {id: obj.id}
        );
      }
    }
  })
});

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    viewer: {
      type: Account,
      resolve(obj, args) {
        return db.query(
            'SELECT * FROM Account WHERE id = ${id^}',
            {id: args.id},
            1
        );
      }
    },
    account: {
      type: Account,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID)
        }
      },
      resolve(obj, args) {
        return db.query(
            'SELECT * FROM Account WHERE id = ${id^}',
            {id: args.id},
            1
        );
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
        return db.query(
            'SELECT * FROM Workout WHERE id = ${id^}',
            {id: args.id},
            1
        );
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
        return db.query('SELECT * FROM Lift WHERE id = ${id^}',{id: args.id},1);
      }
    }
  })
});

const Schema = new GraphQLSchema({
  query: Query
});
export default Schema;
