const { test, trait } = use('Test/Suite')('Exam');

trait('Test/ApiClient');
trait('DatabaseTransactions');

test('student not permition to register a new exam', async ({ client }) => {
  const newUser = {
    email: 'fernando.almeida.pinto@gmail.com',
    password: '123456',
    firstName: 'Fernando',
    lastName: 'Almeida',
    phone: '(xx)9xxxx-xxxx',
    gender: 'Male',
    birthday: '1989-06-26',
    state: 'SP',
    city: 'São Paulo',
    isTeacher: false,
  };

  await client.post('/register').send(newUser).end();

  const response = await client
    .post('/session')
    .send({
      email: newUser.email,
      password: newUser.password,
    })
    .end();

  const responseExam = await client
    .post('/newexam')
    .send({
      exam: 'Enem',
      location: 'BR',
    })
    .header('Authorization', `Bearer ${response.body.token.token}`)
    .end();

  responseExam.assertStatus(404);
});

test('teacher can register a new exam', async ({ client }) => {
  const newUser = {
    email: 'fernando.almeida.pinto@gmail.com',
    password: '123456',
    firstName: 'Fernando',
    lastName: 'Almeida',
    phone: '(xx)9xxxx-xxxx',
    gender: 'Male',
    birthday: '1989-06-26',
    state: 'SP',
    city: 'São Paulo',
    isTeacher: true,
  };

  await client.post('/register').send(newUser).end();

  const response = await client
    .post('/session')
    .send({
      email: newUser.email,
      password: newUser.password,
    })
    .end();

  const responseExam = await client
    .post('/newexam')
    .send({
      exam: 'Enem',
      location: 'BR',
    })
    .header('Authorization', `Bearer ${response.body.token.token}`)
    .end();

  responseExam.assertStatus(200);
});
