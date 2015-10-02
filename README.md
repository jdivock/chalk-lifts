# Lift-GraphQL

Yeah, writing this (again), using graphQL/Relay, let's see if I can actually get it working.

It'd make a crapton more sense to just get this going with react native and parse or some precooked backend, but what would I learn then eh?

## To load db

```
$ psql -f scripts/createdb.sql <user>
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
