rt knex from '../data/dbConnection';

knex.schema.dropTable('Account');
knex.schema.dropTable('Workout');
knex.schema.dropTable('Lift');

knex.schema.createTable('Account', (table) => {
  table.increments();
  table.string('name');
  table.string('email');
  table.string('password');
  table.string('profilePicUrl');
  table.timestamps();
}).then( () => console.log('sup') );

// knex.schema.createTable('Workout', (table) => {
//   table.increments();
//   table.string('name');
//   table.text('comments');
//   table.foreign('userId').references('Account.id');
//   table.timestamps();
// });

