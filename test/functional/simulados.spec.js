/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
const { after, before, test, trait } = use('Test/Suite')('Simulados');
const { ar } = require('date-fns/locale');
const faker = require('faker');
const Simulado = require('../../app/Models/Simulado');

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

/* O teste abaixo testa a criação de Simulados,
 entretanto ele requer uma quantidade grande 
 de cadastro de questoes e nem sem a forma de
  cadastro permite o teste passar, logo o teste
   esta comentado */

test('Criar um Simulado e construir um Simulado', async ({
  assert,
  client,
}) => {
  const token = await login(client, true);

  const simulate = {
    tipo: 'Enem',
    quantidade_questoes: 90,
  };

  const registersimulate = await client
    .post('/registersimulate')
    .send(simulate)
    .header('Authorization', `Bearer ${token}`)
    .end();

  registersimulate.assertStatus(200);

  let array = [];
  const numberQuestion = 20;
  for (let i = 0; i < numberQuestion; i += 1) {
    const qt = createquestion();
    array = array.concat(qt);
  }

  const registerquestion = await client
    .post('/registerquestion')
    .send(array)
    .header('Authorization', `Bearer ${token}`)
    .end();

  registerquestion.assertStatus(200);

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

  const idFake = Math.floor(Math.random() * numberQuestion);

  assert.isAbove(idFake, 0);
  assert.isBelow(idFake, numberQuestion + 1);

  const Newquestion = await Question.findBy('id', idFake);

  assert.equal(Newquestion.toJSON().status, newstatus);

  const meuSimuladoResponse = await client
    .post('/criarimulado')
    .send({
      nome: 'Meu Simulado',
      tipo: 1,
      idQuestoes: JSON.stringify([1, 3, 6]),
      idioma: 'Ing',
    })
    .header('Authorization', `Bearer ${token}`)
    .end();

  meuSimuladoResponse.assertStatus(200);

  const meuSimulado = await Simulado.findByOrFail('id', 1);

  const minhasQuestoes = JSON.parse(meuSimulado.toJSON().questions_ids);

  let count = 0;

  for (const key in minhasQuestoes) {
    count += minhasQuestoes[key].length;
  }

  // console.log(count);
  assert.isBelow(count, 180);

  const responseConstroiSimulado = await client
    .post('/constroisimulado')
    .send({ id: 1 })
    .header('Authorization', `Bearer ${token}`)
    .end();

  responseConstroiSimulado.assertStatus(200);
}).timeout(30000);
