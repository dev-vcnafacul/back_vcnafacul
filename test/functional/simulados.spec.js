const { after, before, test, trait } = use('Test/Suite')('Simulados');
const faker = require('faker');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Exam = use('App/Models/Exam');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Question = use('App/Models/Question');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const TipoSimulado = use('App/Models/TipoSimulado');

trait('Test/ApiClient');
trait('DatabaseTransactions');

before(async () => {
  await Exam.create({ exam: 'FUVEST', location: 'SP' });
  await Exam.create({ exam: 'VUNESP', location: 'BR' });
});

after((done) => {
  done();
  // setTimeout(done(), 2000);
});

function createquestion() {
  return {
    question: faker.lorem.text(),
    enemArea: faker.random.arrayElements(
      ['Ciencias Humanas', 'Ciencias da Natureza', 'Linguagens', 'Matematica'],
      1
    )[0],
    year: 2020,
    examId: faker.random.number({ min: 1, max: 3 }),
    subjects: faker.random.arrayElements(
      [
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
        'Artes',
        'Educação Física',
        'Tecnologia da Informação e Comunicação',
        'Matemática',
      ],
      1
    )[0],
    frente: faker.random.arrayElements(
      [
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
      ],
      1
    )[0],
    answerCorrect: faker.lorem.text(),
    answerWrong: [
      faker.lorem.text(),
      faker.lorem.text(),
      faker.lorem.text(),
      faker.lorem.text(),
    ],
  };
}

async function login(client, isTeacher) {
  const newUser = {
    email: 'fernando.almeida.pinto@gmail.com',
    password: '123456',
    firstName: 'Fernando',
    lastName: 'Almeida',
    phone: '11966530488',
    gender: 'Male',
    birthday: '26/06/1989',
    state: 'SP',
    city: 'São Paulo',
    isTeacher,
  };

  // Requisição para o cadastro passando o newUser

  await client.post('/register').send(newUser).end();

  // Fazendo o Login de Usuário, pois iremos precisar
  // o token para acessar as demais requisições

  const responseUser = await client
    .post('/session')
    .send({
      email: newUser.email,
      password: newUser.password,
    })
    .end();

  const { token } = responseUser.body.token;

  return token;
}

test('Registrar um tipo de Simulado', async ({ assert, client }) => {
  const token = await login(client, true);

  const simulate = {
    tipo: 'Enem',
    quantidade_questoes: 90,
  };

  await client
    .post('/registersimulate')
    .send(simulate)
    .header('Authorization', `Bearer ${token}`)
    .end();

  const Enem = await TipoSimulado.findBy('id', 1);
  assert.isNotNull(Enem);
});

test('Criar um Simulado', async ({ assert, client }) => {
  const token = await login(client, true);

  let array = [];
  const numberQuestion = 90;
  for (let i = 0; i < numberQuestion; i += 1) {
    const qt = createquestion();
    array = array.concat(qt);
  }

  await client
    .post('/registerquestion')
    .send(array)
    .header('Authorization', `Bearer ${token}`)
    .end();

  const newstatus = 'aprovada';

  const results = [];

  for (let i = 0; i < numberQuestion; i += 1) {
    results.push(async () => {
      await client
        .patch(`/changestatusquestion/${i}/${newstatus}`)
        .header('Authorization', `Bearer ${token}`)
        .end();
    });
  }

  await Promise.all(results.map((elem) => elem()));

  const Newquestion = await Question.findBy(
    'id',
    Math.floor(Math.random() * numberQuestion)
  );

  assert.equal(Newquestion.toJSON().status, newstatus);
});
