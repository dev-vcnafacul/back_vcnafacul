/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with simulados
 */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const TipoSimulado = use('App/Models/TipoSimulado');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Simulado = use('App/Models/Simulado');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Question = use('App/Models/Question');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Answer = use('App/Models/Answer');
class SimuladoController {
  /**
   * Show a list of all simulados.
   * GET simulados
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async typeSimulate({ request, response }) {
    const data = request.only(['tipo', 'quantidade_questoes']);

    try {
      await TipoSimulado.create(data);
      return response.status(200).json({ msg: 'Tipo de Simulado Criado' });
    } catch (err) {
      return response.status(400).json({ msg: err });
    }
  }

  /**
   * Render a form to be used for creating a new simulado.
   * GET simulados/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response }) {
    const { nome, tipo, idQuestoes } = request.only([
      'nome',
      'tipo',
      'idQuestoes',
    ]);

    const NewSimulado = new Simulado();

    const simulado = await TipoSimulado.query().where('id', tipo).fetch();

    switch (simulado.toJSON()[0].tipo) {
      case 'Enem':
        await NewSimulado.enem(idQuestoes);
        break;
      case 'Generico':
        await NewSimulado.genereico(idQuestoes);
      default:
        break;
    }
  }

  /**
   * Create/save a new simulado.
   * POST simulados
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {}

  /**
   * Display a single simulado.
   * GET simulados/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {}

  /**
   * Render a form to update an existing simulado.
   * GET simulados/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {}

  /**
   * Update simulado details.
   * PUT or PATCH simulados/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {}

  /**
   * Delete a simulado with id.
   * DELETE simulados/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {}
}

module.exports = SimuladoController;
