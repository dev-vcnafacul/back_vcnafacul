const faker = require('faker');

const { test, trait, after, before } = use('Test/Suite')('Question Register');

trait('Test/ApiClient');
trait('DatabaseTransactions');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Exam = use('App/Models/Exam');

// Preparando definição antes de começar os testes

before(async () => {
  await Exam.create({ exam: 'Enem', location: 'BR' });
});

after((done) => {
  done();
});

function createquestion() {
  return {
    question: faker.lorem.text(),
    enemArea: faker.random.arrayElements(
      ['Ciencias Humanas', 'Ciencias da Natureza', 'Linguagens', 'Matematica'],
      1
    )[0],
    year: 2020,
    examId: 1,
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

async function login(client) {
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
    isTeacher: true,
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

// Testes de fato começam aqui

test('it should create a question being a teacher', async ({
  client,
  assert,
}) => {
  // chama uma função que cadastra e faz o login

  const token = await login(client);

  // Criando uma função faker

  const newquestion = createquestion();

  // E agora vamos cadastrar essa questão
  // passando o token de autenticação.

  const questionResponse = await client
    .post('/registerquestion')
    .send(newquestion)
    .header('Authorization', `Bearer ${token}`)
    .end();

  questionResponse.assertStatus(200);

  // Agora precisamos verificar se tudo ocorreu como queriamos
  // Primeiro buscamos nosso usuário cadastrado no banco
  // depois buscamos todas as questões cadastrada por esse usuário

  const user = await User.findBy('email', 'fernando.almeida.pinto@gmail.com');

  const quest = await user.question().where('user_id', user.id).fetch();

  assert.isNotNull(quest.toJSON());
});

test('it show all questions of some status', async ({ client, assert }) => {
  const token = await login(client);

  const newquestion = createquestion();

  const questRegister = await client
    .post('/registerquestion')
    .send(newquestion)
    .header('Authorization', `Bearer ${token}`)
    .end();

  questRegister.assertStatus(200);

  const questPendente = await client
    .post('/showquestion')
    .send({ status: 'pendente' })
    .header('Authorization', `Bearer ${token}`)
    .end();

  questPendente.assertStatus(200);

  assert.isNotNull(questPendente.body[0].answer[1]);

  const changeResponse = await client
    .patch(
      `/changestatusquestion/${questPendente.body[0].question.id}/aprovada`
    )
    .header('Authorization', `Bearer ${token}`)
    .end();

  changeResponse.assertStatus(204);

  const questVerifica = await client
    .post('/showquestion')
    .send({ status: 'aprovada' })
    .header('Authorization', `Bearer ${token}`)
    .end();

  assert.equal(questVerifica.body[0].question.status, 'aprovada');
});

test('it should create a question with a exam does not exist', async ({
  client,
}) => {
  // chama uma função que cadastra e faz o login

  const token = await login(client);

  // Criando uma função faker

  const newquestion = createquestion();

  newquestion.examId = 2;

  // E agora vamos cadastrar essa questão
  // passando o token de autenticação.

  const questionResponse = await client
    .post('/registerquestion')
    .send(newquestion)
    .header('Authorization', `Bearer ${token}`)
    .end();

  questionResponse.assertStatus(404);

  // console.log(questionResponse.body);
});
