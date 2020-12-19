/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class AnswerSchema extends Schema {
  up() {
    this.create('answers', (table) => {
      table.increments();
      table
        .integer('question_id')
        .unsigned()
        .references('id')
        .inTable('questions')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table.text('answer', ['mediumtext']);
      table.boolean('correct').notNullable().default(false);
      table.timestamps();
    });
  }

  down() {
    this.drop('answers');
  }
}

module.exports = AnswerSchema;
