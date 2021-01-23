const { test, trait } = use('Test/Suite')('Register');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

trait('Test/ApiClient');
trait('DatabaseTransactions');

test('it should register a new student', async ({ client, assert }) => {
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

  const response = await client.post('/register').send(newUser).end();

  assert.equal(response.body.msg, 'Registrado');

  response.assertStatus(200);

  const user = await User.findBy('email', newUser.email);

  const permission = await user.permission().fetch();

  assert.exists(permission);
});

test('register missing the city', async ({ client, assert }) => {
  const newUser = {
    email: 'fernando.almeida.pinto@gmail.com',
    password: '123456',
    firstName: 'Fernando',
    lastName: 'Almeida',
    phone: '11966530488',
    gender: 'Male',
    birthday: '1989-06/26',
    state: 'SP',
    isTeacher: false,
  };

  const response = await client.post('/register').send(newUser).end();

  response.assertStatus(400);

  assert.equal(response.body.msg.field, 'city');
});
