/**
  @typedef {import('@adonisjs/framework/src/Request')} Request
  @typedef {import('@adonisjs/framework/src/View')} View
  @typedef {import('@adonisjs/auth/src/Schemes/Session')} AuthSession
   */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

class SessionController {
  /**
   * @param {object} ctx
   * @param {AuthSession} ctx.auth
   * @param {Request} ctx.request
   * @param {View} ctx.view
   */
  async store({ request, auth }) {
    const data = request.only(['email', 'password']);

    const token = await auth.attempt(data.email, data.password);

    return { token };
  }

  async me({ auth, response }) {
    const user = await User.findByOrFail('id', auth.user.id);

    const myreturn = {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      gender: user.gender,
      birthday: user.birthday,
      state: user.state,
      city: user.city,
      isTeacher: user.isTeacher,
      about: user.about,
    };

    return response.status(200).json({ msg: myreturn });
  }
}

module.exports = SessionController;
