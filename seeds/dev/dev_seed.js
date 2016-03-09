
export const seed = (knex, Promise) =>
  Promise.join(
    // Deletes ALL existing entries
    knex('users').del(),

    // Inserts seed entries
    knex('users').insert({
      uid: 1,
      username: 'jdivock',
      name: 'Jay',
      email: 'jay@jay.com',
      profile_pic_url: 'http://www.gravatar.com/avatar/7185c88617c1a8f06add08209fbb9173.jpg',
    }),
  );
