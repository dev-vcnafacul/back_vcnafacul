/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class UserSchema extends Schema {
  up() {
    this.create('users', (table) => {
      table.increments();
      table.string('email', 254).notNullable().unique();
      table.string('password', 60).notNullable();
      table.string('firstName', 15).notNullable();
      table.string('lastName', 50).notNullable();
      table.string('phone').notNullable();
      table.enum('gender', ['Male', 'Female', 'Others']).notNullable();
      table.date('birthday').notNullable();
      table.string('state').notNullable();
      table.string('city').notNullable();
      table.boolean('isTeacher').notNullable();
      table.text('about');
      table.timestamps();
    });
  }

  down() {
    this.drop('users');
  }
}

module.exports = UserSchema;
