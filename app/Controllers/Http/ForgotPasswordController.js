const { randomBytes } = require('crypto');
const { promisify } = require('util');

const Mail = use('Mail');
const Env = use('Env');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

class ForgotPasswordController {
  async store({ request, response }) {
    const { email } = request.only('email');

    const user = await User.findBy('email', email);

    if (user === null) {
      return response.status(409).json({ msg: 'Email não existe' });
    }

    const random = await promisify(randomBytes)(24);
    const token = random.toString('hex');

    const resetPasswordUrl = `${Env.get('FRONT_URL')}/reset?token=${token}`;

    await user.tokens().create({
      token,
      type: 'forgotpassword',
    });

    await Mail.send(
      'emails/forgotpassword',
      { name: user.firstName, token: resetPasswordUrl },
      (message) => {
        message
          .to(user.email)
          .from('do.not.reply@vcnafacul.com.br')
          .subject('vCnaFacul - Recuperação de senha');
      }
    );
  }
}

module.exports = ForgotPasswordController;
