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
    const { nome, tipo, idQuestoes, idioma } = request.only([
      'nome',
      'tipo',
      'idQuestoes',
      'idioma',
    ]);

    const NewSimulado = new Simulado();

    const simulado = await TipoSimulado.findByOrFail('id', tipo);

    const meutipo = simulado.toJSON().tipo;

    let minhasQuestoes;

    switch (meutipo) {
      case 'Enem':
        minhasQuestoes = await NewSimulado.enem(JSON.parse(idQuestoes), idioma);
        break;
      default:
        break;
    }

    try {
      const data = {
        name: nome,
        tipo_simulados_id: tipo,
        questions_ids: minhasQuestoes,
      };

      await Simulado.create(data);
      return response.status(200).json({ msg: 'Simulado Criado' });
    } catch (err) {
      return response.status(404).json({ msg: err });
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
  async store({ request, response }) {
    const { id } = request.only(['id']);

    const NewSimulado = new Simulado();

    const meuSimulado = await NewSimulado.constroiSimulado(
      await Simulado.findByOrFail('id', id)
    );

    return response.status(200).json({ meuSimulado });
  }

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
