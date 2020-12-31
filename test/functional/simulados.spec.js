const { after, test, trait } = use('Test/Suite')('Simulados');
const faker = require('faker');

trait('Test/ApiClient');

// Eu removi o DatabaseTrasactions pois eu quero carregar os test aqui

/* trait('DatabaseTransactions'); */

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

test('Registrar um tipo de Simulado', async ({ assert, client }) => {});
