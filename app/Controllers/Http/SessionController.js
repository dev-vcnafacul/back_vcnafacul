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

    const user = await User.findBy('email', data.email);

    return { token, firstName: user.firstName, isTeacher: user.isTeacher };
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

  async patchMe({ auth, request, response }) {
    const user = await User.findByOrFail('id', auth.user.id);

    const data = request.all();

    user.firstName = data.firstName || user.firstName;
    user.lastName = data.lastName || user.lastName;
    user.phone = data.phone || user.phone;
    user.gender = data.gender || user.gender;
    user.birthday = data.birthday || user.birthday;
    user.state = data.state || user.state;
    user.city = data.city || user.city;
    user.about = data.about || user.about;

    await user.save();

    return response.status(200).json({ msg: 'editado' });
  }
}

module.exports = SessionController;
