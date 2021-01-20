/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route');

Route.post('/session', 'SessionController.store');
Route.post('/register', 'RegisterController.store');
Route.post('/forgot', 'ForgotPasswordController.store');
Route.post('/reset', 'ResetPasswordController.store');

Route.get('/me', 'SessionController.me').middleware(['auth']);

Route.post('/registerquestion', 'QuestionController.store').middleware([
  'auth',
]);

Route.post('/showquestion', 'QuestionController.show').middleware(['auth']);

Route.patch(
  '/changestatusquestion/:id/:status',
  'QuestionController.changestatusquestion'
).middleware(['auth']);

Route.post('/registersimulate', 'SimuladoController.typeSimulate').middleware([
  'auth',
]);

Route.post('/criarimulado', 'SimuladoController.create').middleware(['auth']);
Route.post('/constroisimulado', 'SimuladoController.store').middleware([
  'auth',
]);
