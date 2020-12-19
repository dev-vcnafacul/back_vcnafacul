/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

Factory.blueprint('App/Models/User', async (faker, i, data) => {
  return {
    email: data.email || faker.email(),
    password: data.password || faker.password(),
    firstName: faker.first(),
    lastName: faker.last(),
    phone: faker.phone(),
    gender: faker.gender(),
    birthday: faker.date(),
    state: faker.state(),
    city: faker.city(),
    isTeacher: faker.bool(),
  };
});

Factory.blueprint('App/Models/Token', async (faker, i, data) => {
  return {
    type: data.type || 'refreshtoken',
    token: faker.string({ length: 20 }),
  };
});
