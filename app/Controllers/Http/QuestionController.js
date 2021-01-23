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

  // Essa requisição é responsável por cadastro de questões.
  // Verificar quem tem atribuição de cadastro. Para isso Olhar na Tabela de Permissões.

  /*   async store({ request, auth, response }) {
    const Pm = await Permission.query().where('user_id', auth.user.id).fetch();
    const perm = Pm.toJSON();
    if (perm.cadastroQuestao === 0) {
      return response.status(401).json({ error: 'Not Authorization' });
    }

    let qtError = [];
    let qtSucess = [];

    const MyQuestions = request.all();
    let arraQuestion = [];

    const count = Object.keys(MyQuestions).length;

    for (let i = 0; i < count; i += 1) {
      arraQuestion = arraQuestion.concat(MyQuestions[i]);
    }

    const rulesQuestion = {
      user_id: 'required|integer',
      question: 'required|string',
      enemArea: 'required|string',
      subjects: 'required|string',
      year: 'required|integer',
      examId: 'required|integer',
      frente: 'required|string',
    };

    await Promise.all(
      arraQuestion.map(async (elem) => {
        const qt = {
          user_id: auth.user.id,
          question: elem.question,
          enemArea: elem.enemArea,
          subjects: elem.subjects,
          year: elem.year,
          examId: elem.examId,
          frente: elem.frente,
        };

        await Exam.findByOrFail('id', elem.examId);

        const validation = await validate(qt, rulesQuestion);

        if (
          validation.fails() ||
          elem.answerCorrect === '' ||
          elem.answerWrong.length !== 4
        ) {
          qtError = qtError.concat({
            error: 'validation fails',
            question: elem.question,
          });
        } else {
          try {
            const myQuest = await Question.create(qt);
            await Answer.create({
              question_id: myQuest.id,
              answer: elem.answerCorrect,
              correct: true,
            });
            await Promise.all(
              elem.answerWrong.map(async (wrong) => {
                await Answer.create({
                  question_id: myQuest.id,
                  answer: wrong,
                });
              })
            );
            qtSucess = qtSucess.concat(qt.question);
          } catch (error) {
            qtError = qtError.concat({
              error,
              question: qt.Question,
            });
          }
        }
      })
    );
    return response.status(200).json({ qtError, qtSucess });
  }

  async show({ auth, request, response }) {
    if (!this.PermissionVerification(auth, 'aprovarQuestoes')) {
      response.status(404);
      return { error: 'Not authorization' };
    }

    const { status } = request.only(['status']);

    const ArrayQuestion = [];

    const questreturn = await Question.query().where('status', status).fetch();
    const quest = questreturn.toJSON();
    await Promise.all(
      quest.map(async (elem) => {
        const answer = await Answer.query()
          .where('question_id', elem.id)
          .fetch();
        const myAnswer = answer.toJSON();
        const arrayAnswer = [
          { id: myAnswer[0].id, answer: myAnswer[0].answer },
          { id: myAnswer[1].id, answer: myAnswer[1].answer },
          { id: myAnswer[2].id, answer: myAnswer[2].answer },
          { id: myAnswer[3].id, answer: myAnswer[3].answer },
          { id: myAnswer[4].id, answer: myAnswer[4].answer },
        ];
        ArrayQuestion.push({
          question: elem.question,
          Area: elem.enemArea,
          subjects: elem.subjects,
          frente: elem.frente,
          answer: arrayAnswer,
        });
      })
    );
    return ArrayQuestion;
  } */

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
      'exameId',
      'correct',
    ]);

    const myExam = await Exam.findBy('id', examId);

    if (myExam === null) {
      return response
        .status(400)
        .json({ msg: 'O Exame selecionado não encontrado em nossa base' });
    }

    const exameId = myExam.toJSON().id;

    const question = request.file('question', {
      types: ['image'],
      size: '0.2mb',
    });

    const random = await promisify(randomBytes)(1);
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
      exameId,
      correct,
    };

    const validation = await validate(qt, rulesQuestion);

    if (validation.fails()) {
      const error = validation.messages();
      response.status(400);
      return { msg: error };
    }

    await question.move(Helpers.tmpPath('uploadsQuestion'), {
      name: `${name}.jpg`,
      overwrite: true,
    });

    if (!question.moved()) {
      response.status(404);
      return question.error();
    }

    await Question.create(qt);
  }

  async newExame({ request, auth, response }) {
    const CanI = await this.PermissionVerification(auth, 'cadastroexame');

    if (!CanI) {
      return response.status(404).json({ error: 'Not authorization' });
    }
    const data = request.only(['exam', 'location']);

    const existedExame = await Exam.findBy('exam', data.exam);

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
