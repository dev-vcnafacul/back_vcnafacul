/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class QuestionsSchema extends Schema {
  up() {
    this.create('questions', (table) => {
      table.increments();
      // Quem é o Usuário que Cadastrou a questão
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      // Pergunta
      table.text('question', ['mediumtext']).notNullable().unique();
      // Areas do Enem, uma boa forma de entender a pergunta
      table
        .enum('enemArea', [
          'Ciencias Humanas',
          'Ciencias da Natureza',
          'Linguagens',
          'Matematica',
        ])
        .notNullable();
      // Dificuldade da questão de 0 a 100
      table
        .enum('subjects', [
          'História',
          'Geografia',
          'Filosofia',
          'Sociologia',
          'Química',
          'Física',
          'Biologia',
          'Língua Portuguesa',
          'Literatura',
          'Inglês',
          'Espanhol',
          'Artes',
          'Educação Física',
          'Tecnologia da Informação e Comunicação',
          'Matemática',
        ])
        .notNullable();
      // Esse Campo precisa se enum com todas as frentes bem listadas
      table
        .enum('frente', [
          'Botânica e ecologia',
          'Fisiologia animal e origem da vida',
          'Metabolismo celular, Bioquímica e Genética',
          'Eletromagnetismo',
          'Mecânica',
          'Óptica e Térmica',
          'Aritmética e Algebra',
          'Financeira e Trigonometria',
          'Geometria',
          'Físico-Química',
          'Química Geral',
          'Química Orgânica',
          'Atualidade',
          'Filosofia',
          'Sociologia',
          'Geografia do Brasil',
          'Geografia Geral',
          'História do Brasil',
          'História Geral',
          'Artes',
          'Espanhol',
          'Gramática',
          'Inglês',
          'Literatura',
          'Leitura e Produção de Texto',
        ])
        .notNullable();
      // Toda questão é cadastrada como pendente e precisa ser aprovada por um adm/professor
      table.integer('difficulty').default(0).notNullable();
      // Quantidades de vezes que essa questão foi respondida
      table.integer('quantity').default(0).notNullable();
      // Quantidade de vezes que essa questão apareceu em simulados diferentes
      table.integer('quantity_test').default(0).notNullable();
      // Possível imagem que pode ter a Pergunta
      table.string('image');
      // Qual vestibular essa questão apareceu
      table
        .enum('year', [
          2000,
          2001,
          2002,
          2003,
          2004,
          2005,
          2006,
          2007,
          2008,
          2009,
          2010,
          2011,
          2012,
          2013,
          2014,
          2015,
          2016,
          2017,
          2018,
          2019,
          2020,
          2021,
        ])
        .notNullable();
      // Em qual ano ?
      table.integer('year').notNullable();
      table
        .enum('status', ['aprovada', 'reprovada', 'pendente'])
        .default('pendente');
      table.timestamps();
    });
  }

  down() {
    this.drop('questions');
  }
}

module.exports = QuestionsSchema;
