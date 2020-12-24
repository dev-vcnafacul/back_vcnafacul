/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class ExamSchema extends Schema {
  up() {
    this.create('exams', (table) => {
      table.increments();
      table.string('exam');
      table.enum('location', [
        'AC',
        'AL',
        'AP',
        'AM',
        'BA',
        'CE',
        'ES',
        'GO',
        'MA',
        'MT',
        'MS',
        'MG',
        'PA',
        'PB',
        'PR',
        'PE',
        'PI',
        'RJ',
        'RN',
        'RS',
        'RO',
        'RR',
        'SC',
        'SP',
        'SE',
        'TO',
        'DF',
        'BR',
      ]);
      table.timestamps();
    });
  }

  down() {
    this.drop('exams');
  }
}

module.exports = ExamSchema;
