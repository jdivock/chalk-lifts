import moment from 'moment';

export const seed = (knex, Promise) =>
Promise.join(
  // Deletes ALL existing entries
  knex('lifts').del(),
  knex('workouts').del(),
  knex('users').del(),

  // Inserts seed entries
  knex('users')
  .insert({
    username: 'jdivock',
    name: 'Jay',
    email: 'jay@jay.com',
    created_at: moment().format('LLL'),
    updated_at: moment().format('LLL'),
    profile_pic_url: 'http://www.gravatar.com/avatar/7185c88617c1a8f06add08209fbb9173.jpg',
  })
  .returning('id')
  .then(
    resp =>
    knex('workouts')
    .insert([{
      name: 'Squat day',
      comments: 'Shit sucked yo',
      date: '2/15/2016',
      created_at: moment().format('LLL'),
      updated_at: moment().format('LLL'),
      user_id: resp[0],
    }, {
      name: 'Bench day',
      comments: 'meh',
      date: '2/18/2016',
      created_at: moment().format('LLL'),
      updated_at: moment().format('LLL'),
      user_id: resp[0],
    }])
    .returning('id')
    .then(ids =>
          Promise.all(
            ids.map(id =>
                    knex('lifts')
                    .insert([{
                      name: 'bench',
                      reps: 5,
                      sets: 3,
                      weight: 200,
                      workout_id: id,
                    }, {
                      name: 'speed bench',
                      reps: 5,
                      sets: 6,
                      weight: 180,
                      workout_id: id,
                    }, {
                      name: 'paused wide grip bench',
                      reps: 5,
                      sets: 3,
                      weight: 200,
                      workout_id: id,
                    }, {
                      name: 'dips',
                      reps: 5,
                      sets: 3,
                      workout_id: id,
                    }, {
                      name: 'situps',
                      reps: 12,
                      sets: 3,
                      workout_id: id,
                    },
                    ])
                   )
          )
         )
  ),
);
