const { test, trait } = use('Test/Suite')('Sessions');

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

trait('Test/ApiClient');
trait('DatabaseTransactions');

test('it should login in aplication', async ({ assert, client }) => {
  const sessionPaylod = {
    email: 'fernando.almeida.pinto@gmail.com',
    password: '123456',
  };

  await Factory.model('App/Models/User').create(sessionPaylod);

  const response = await client.post('/session').send(sessionPaylod).end();

  assert.exists(response.body.token);
});

test('it not should login in aplication', async ({ assert, client }) => {
  const sessionPaylod = {
    email: 'fernando.almeida.pinto@gmail.com',
    password: '123456',
  };

  await Factory.model('App/Models/User').create(sessionPaylod);

  const response = await client
    .post('/session')
    .send({
      email: 'fernand.almeida.pinto@gmail.com',
      password: '123456',
    })
    .end();

  response.assertStatus(401);
});

test('it not should login in aplication', async ({ assert, client }) => {
  const sessionPaylod = {
    email: 'fernando.almeida.pinto@gmail.com',
    password: '123456',
  };

  await Factory.model('App/Models/User').create(sessionPaylod);

  const responseUser = await client
    .post('/session')
    .send({
      email: sessionPaylod.email,
      password: sessionPaylod.password,
    })
    .end();

  const { token } = responseUser.body.token;

  const response = await client
    .get('/me')
    .header('Authorization', `Bearer ${token}`)
    .end();

  console.log(response.body);
});
