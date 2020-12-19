/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class TeachersSchema extends Schema {
  up() {
    this.create('teachers', (table) => {
      table.increments();
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table.string('curriculum');
      table.string('nameOfCourse');
      table.enum('statusGraduation', ['Graduated', 'Graduating']);
      table.enum('kindOfUniversity', ['Public', 'Private']);
      table.string('universityName');
      table.boolean('statusValidation').defaultTo(false);
      table.timestamps();
    });
  }

  down() {
    this.drop('teachers');
  }
}

module.exports = TeachersSchema;
