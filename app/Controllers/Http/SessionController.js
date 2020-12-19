/**
  @typedef {import('@adonisjs/framework/src/Request')} Request
  @typedef {import('@adonisjs/framework/src/View')} View
  @typedef {import('@adonisjs/auth/src/Schemes/Session')} AuthSession
   */

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
}

module.exports = SessionController;
