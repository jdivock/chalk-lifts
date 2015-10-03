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
