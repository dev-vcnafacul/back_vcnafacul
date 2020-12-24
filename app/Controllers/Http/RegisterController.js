/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Student = use('App/Models/Student');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Teacher = use('App/Models/Teacher');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Permission = use('App/Models/Permission');

const { validate } = use('Validator');

/**
  @typedef {import('@adonisjs/framework/src/Request')} Request
  @typedef {import('@adonisjs/framework/src/View')} View
  @typedef {import('@adonisjs/auth/src/Schemes/Session')} AuthSession
   */

class RegisterController {
  /**
   * @param {object} ctx
   * @param {AuthSession} ctx.auth
   * @param {Request} ctx.request
   * @param {View} ctx.view
   */

  async store({ request, response }) {
    const data = request.all();

    const rulesUser = {
      email: 'required',
      password: 'required',
      firstName: 'required',
      lastName: 'required',
      phone: 'required',
      gender: 'required',
      birthday: 'required',
      state: 'required',
      city: 'required',
      isTeacher: 'required|boolean',
      status: 'boolean',
    };

    const validation = await validate(data, rulesUser);

    const InstUser = new User();

    const permission = InstUser.permissionType(data.isTeacher);

    try {
      if (!validation.fails()) {
        const user = await User.create(data);
        await Permission.create({
          user_id: user.id,
          ...permission,
        });
        response.status(200);
        return { message: 'Registed' };
      }
      // eslint-disable-next-line no-underscore-dangle
      const error = validation._errorMessages[0];
      response.status(200);
      return { error };
    } catch (error) {
      return { message: error };
    }
  }
}

module.exports = RegisterController;
