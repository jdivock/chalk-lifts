# Chalk Lifts [![Build Status](https://travis-ci.org/jdivock/chalk-lifts.svg?branch=master)](https://travis-ci.org/jdivock/chalk-lifts)

Yeah, writing this (again), using graphQL/Relay, let's see if I can actually get it working.

## Setup

### Prereqs

* Postgres (may do sqllite for dev)

### Setup

```sh
> npm install
> npm start
```

Relay GraphIQL on http://localhost:8080
App on http://localhost:3000

## Relay Queries

##### Basic
```
{
  user(email:"jay@jay.com") {
    workouts {
      edges {
        node {
          id,
          name
          lifts {
            edges {
              node {
                id,
                name,
              }
            }
          }
        }
      }
    }
  }
}
```
```js
{
  workout(id:1) {
    id,
    lifts {
      edges {
        cursor,
        node {
          id,
          name,
          sets,
          reps
        }
      },
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
}
```

##### Getting 'first' for free with connections
```js
{
  workout(id:1) {
    id,
    lifts(first:1) {
      edges {
        cursor,
        node {
          id,
          name,
          sets,
          reps
        }
      },
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
}
```

##### Kitchen Sink
```
{
  liftToWorkout: lift(id:1) {
    id,
    sets,
    name,
    workout {
      edges {
        cursor,
        node {
          id,
          name,
          date
        }
      }
    }
  }
  workout: workout(id:1) {
    id,
    lifts(first: 2) {
      edges {
        cursor,
        node {
          id,
          name,
          sets,
          reps
        }
      },
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  },
  account: account(id:1) {
    id,
    email,
    workouts {
      edges {
        cursor,
        node {
          id,
          name,
          date
        }
      }
    }
  }
}
```

##### Finding by globalId
```js
query AccountQuery {
  node(id: "QWNjb3VudDox") {
    id
    ... on Account {
      name,
      email
    }
  }
}
```

##### Using Cursors
```js
{
  workout: workout(id:1) {
    id,
    name,
    lifts(first: 1) {
      edges {
        cursor,
        node {
          id,
          name
        }
      }
    }
  }
  workoutCont: workout(id:1) {
    id,
    name,
    lifts(first: 5 after: "YXJyYXljb25uZWN0aW9uOjA=") {
      pageInfo {
        hasPreviousPage,
        hasNextPage
      }
      edges {
        cursor,
        node {
          id,
          name
        }
      }
    }
  }
}
```

#### Mutations

##### Query
```js
mutation AddLiftMutation($input: AddLiftMutationInput!) {
  addLiftMutation(input: $input) {
    liftEdge {
      node {
        id,
        sets,
        weight,
        reps,
      }
    },
    clientMutationId
  }
}
```

##### Variables
```js
{
  "input": {
    "workout_id": "V29ya291dDox",
    "sets": 1,
    "reps": 2,
    "weight": 100,
    "name": "stuff",
    "clientMutationId": 0
  }
}
```

## DB (knex)

Stil figuring out why, but if I'm tinkering and killing the servr during a seed or migration bad things can happy. in that case

```sh
knex migrate:rollback

knex migrate:latest
```
