const { test, trait } = use('Test/Suite')('Forgot PassWord');

const { subHours } = require('date-fns');

const Mail = use('Mail');

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash');

trait('Test/ApiClient');
trait('DatabaseTransactions');

test('it should send mail forgot password', async ({ assert, client }) => {
  Mail.fake();

  const user = await Factory.model('App/Models/User').create();

  const response = await client
    .post('/forgot')
    .send({ email: user.email })
    .end();

  response.assertStatus(204);

  const token = await user.tokens().first();

  const recentEmail = Mail.pullRecent();

  assert.equal(recentEmail.message.to[0].address, user.email);

  assert.include(token.toJSON(), {
    user_id: user.id,
    type: 'forgotpassword',
  });
  Mail.restore();
});

test('it should be able to reset password', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const token = await Factory.model('App/Models/Token').make();

  await user.tokens().save(token);

  await client
    .post('/reset')
    .send({
      token: token.token,
      password: '123456',
      password_confirmation: '123456',
    })
    .end();

  await user.reload();

  const checkPassword = await Hash.verify('123456', user.password);

  assert.isTrue(checkPassword);
});

test('it should reset password after 2h of forgot password request', async ({
  client,
}) => {
  const user = await Factory.model('App/Models/User').create();
  const userToken = await Factory.model('App/Models/Token').make();

  await user.tokens().save(userToken);

  userToken.created_at = subHours(new Date(), 2);
  await userToken.save();

  const response = await client
    .post('/reset')
    .send({
      token: userToken.token,
      password: '123456',
      password_confirmation: '123456',
    })
    .end();

  response.assertStatus(400);
});

test('it send a email invalid', async ({ client }) => {
  await Factory.model('App/Models/User').create();

  const response = await client
    .post('/forgot')
    .send({ email: 'fernando.almeida.pinto@gmail.com' })
    .end();

  response.assertStatus(404);
});
