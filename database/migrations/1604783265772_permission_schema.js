/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class PermissionSchema extends Schema {
  up() {
    this.create('permissions', (table) => {
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        .primary();
      table.boolean('cadastroQuestao').default(false);
      table.boolean('buscarQuestoes').default(false);
      table.boolean('aprovarQuestoes').default(false);
      table.boolean('searchQuestion').default(true);
      table.timestamps();
    });
  }

  down() {
    this.drop('permissions');
  }
}

module.exports = PermissionSchema;
