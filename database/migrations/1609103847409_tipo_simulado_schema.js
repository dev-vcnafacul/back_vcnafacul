/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class TipoSimuladoSchema extends Schema {
  up() {
    this.create('tipo_simulados', (table) => {
      table.increments();
      table.string('tipo').notNullable();
      table.integer('quantidade_questoes').notNullable();
      table.timestamps();
    });
  }

  down() {
    this.drop('tipo_simulados');
  }
}

module.exports = TipoSimuladoSchema;
