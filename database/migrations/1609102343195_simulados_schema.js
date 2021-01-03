/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class SimuladosSchema extends Schema {
  up() {
    this.create('simulados', (table) => {
      table.increments();
      table.string('name').notNullable();
      table
        .integer('tipo_simulados_id')
        .unsigned()
        .references('id')
        .inTable('tipo_simulados')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table.integer('respondido').notNullable().default(0);
      table.integer('aproveitamento').notNullable().default(0);
      table.json('questions_ids').notNullable();
      table.timestamps();
    });
  }

  down() {
    this.drop('simulados');
  }
}

module.exports = SimuladosSchema;
