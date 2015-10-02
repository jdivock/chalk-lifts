# Lift-GraphQL

Yeah, writing this (again), using graphQL/Relay, let's see if I can actually get it working.

It'd make a crapton more sense to just get this going with react native and parse or some precooked backend, but what would I learn then eh?

## Setup

Install postgres
```
$ brew install postgres
```

Run db init script
```
$ psql -f scripts/createdb.sql <user>
```

Start up the server
```
$ npm start
```

GraphIQL IDE is hosted at localhost:8080, have fun poking around

### Sample Queries

Super basic query
```
{
	account(email:"jdivock@jdivock.com"){
    id,
    name,
    email
  }
}
```

Joining some stuff together
```
{
	account(email:"jdivock@jdivock.com"){
    id,
    name,
    email,
    workouts {
      id,
      name,
      date,
      lifts {
        name,
        sets,
        reps,
        weight
      }
    }
  }
}
```

Fragments
```
fragment JayFragment on Account {
  email,
  id
}

query UseFragment {
  jay: account(id: 1) {
    ...JayFragment
  }
}
```

### Mutations

Add a record, retrieve pieces of the record, then join back up to it's parent table to fetch even more
```
mutation M {
  addLift(workoutid: 1, name: "test 5 lift", reps: 2, sets: 5, weight: 100) {
    id,
    name,
    reps,
    workout {
      name,
      id
    }
  }
}
```

### Schema
```
type Account {
  id: ID
  name: String
  email: String
  workouts: [Workout]
}

type Lift {
  id: ID
  reps: Int
  sets: Int
  weight: Float
  name: String
  workoutid: ID
  workout: Workout
}

type Mutation {
  addLift(workoutid: ID!, name: String!, reps: Int!, sets: Int!, weight: Float!): Lift
}

type Query {
  account(id: ID, email: String): Account
  accounts: [Account]
  workout(id: ID!): Workout
  lift(id: ID!): Lift
}

type Workout {
  id: ID
  date: Int
  name: String
  account: Account
  lifts: [Lift]
}
```
