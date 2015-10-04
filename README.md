# Lift-GraphQL

Yeah, writing this (again), using graphQL/Relay, let's see if I can actually get it working.

It'd make a crapton more sense to just get this going with react native and parse or some precooked backend, but what would I learn then eh?

## To load db

```
$ psql -f scripts/createdb.sql <user>
```

### Relay Queries

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

Getting 'first' for free with connections
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

Kitchen Sink
```
# Welcome to GraphiQL
#
# GraphiQL is an in-browser IDE for writing, validating, and
# testing GraphQL queries.
#
# Type queries into this side of the screen, and you will
# see intelligent typeaheads aware of the current GraphQL type schema and
# live syntax and validation errors highlighted within the text.
#
# To bring up the auto-complete at any point, just press Ctrl-Space.
#
# Press the run button above, or Cmd-Enter to execute the query, and the result
# will appear in the pane to the right.

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
