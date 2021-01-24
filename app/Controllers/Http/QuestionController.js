const { randomBytes } = require('crypto');
const { promisify } = require('util');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Question = use('App/Models/Question');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Permission = use('App/Models/Permission');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
// const Answer = use('App/Models/Answer');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Exam = use('App/Models/Exam');

const { validate } = use('Validator');
const Helpers = use('Helpers');

/**
  @typedef {import('@adonisjs/framework/src/Request')} Request
  @typedef {import('@adonisjs/framework/src/View')} View
  @typedef {import('@adonisjs/auth/src/Schemes/Session')} AuthSession
   */

class QuestionController {
  /**
   * @param {object} ctx
   * @param {AuthSession} ctx.auth
   * @param {Request} ctx.request
   * @param {View} ctx.view
   */

  async PermissionVerification(auth, myPerm) {
    const perm = await Permission.query()
      .where('user_id', auth.user.id)
      .fetch();

    const permission = perm.toJSON()[0];

    return permission[myPerm];
  }

  async changestatusquestion({ auth, params, response }) {
    if (await !this.PermissionVerification(auth, 'aprovarQuestoes')) {
      response.status(404);
      return { error: 'Not authorization' };
    }

    const { id, status } = params;

    await Question.query().where('id', id).update({ status });
    response.status(200);
    return { message: 'Sucess' };
  }

  async newStore({ request, auth, response }) {
    if (await !this.PermissionVerification(auth, 'cadastroQuestao')) {
      response.status(404);
      return { error: 'Not authorization' };
    }

    const { enemArea, subjects, frente, year, examId, correct } = request.only([
      'enemArea',
      'subjects',
      'frente',
      'year',
      'examId',
      'correct',
    ]);

    const myExam = await Exam.findBy('id', examId);

    if (myExam === null) {
      return response
        .status(400)
        .json({ msg: 'O Exame selecionado não encontrado em nossa base' });
    }

    const myImage = request.file('question', {
      types: ['image'],
      size: '0.1mb',
    });

    const random = await promisify(randomBytes)(16);
    const name = random.toString('hex');

    const rulesQuestion = {
      user_id: 'required|number',
      enemArea: 'required|string',
      question: 'required|string',
      subjects: 'required|string',
      year: 'required|integer',
      frente: 'required|string',
      examId: 'required|number',
      correct: 'required|string',
    };

    const qt = {
      user_id: auth.user.id,
      question: name,
      enemArea,
      subjects,
      frente,
      year,
      examId,
      correct,
    };

    const validation = await validate(qt, rulesQuestion);

    if (validation.fails()) {
      const error = validation.messages();
      return response.status(400).json({ msg: error });
    }

    await myImage.move('uploads', {
      name: `${name}.jpg`,
      overwrite: false,
    });

    if (!myImage.moved()) {
      response.status(404);
      return myImage.error();
    }

    await Question.create(qt);
    return response.status(200).json({ msg: 'Questão Cadastrada' });
  }

  async getAllQuestion({ response }) {
    const allQuestion = await Question.all();
    return response.status(200).json(allQuestion.toJSON());
  }

  async newExame({ request, auth, response }) {
    const CanI = await this.PermissionVerification(auth, 'cadastroexame');

    if (!CanI) {
      return response.status(404).json({ error: 'Not authorization' });
    }
    const data = request.only(['exam', 'location']);

    const existedExame = await Exam.findBy('exam', data.exam.toUpperCase());

    if (existedExame !== null) {
      return response.status(400).json({ msg: 'Exame já existe' });
    }

    const myExam = {
      user_id: auth.user.id,
      exam: data.exam,
      location: data.location,
    };

    await Exam.create(myExam);

    return response
      .status(200)
      .json({ msg: `Exame ${data.exam} cadastrado com sucesso` });
  }

  async getAllExame({ response }) {
    const allExame = await Exam.all();

    return response.status(200).json(allExame.toJSON());
  }
}

module.exports = QuestionController;
