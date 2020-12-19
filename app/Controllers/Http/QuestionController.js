/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Question = use('App/Models/Question');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Permission = use('App/Models/Permission');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Answer = use('App/Models/Answer');

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

  // Essa requisição é responsável por cadastro de questões.
  // Verificar quem tem atribuição de cadastro. Para isso Olhar na Tabela de Permissões.

  async store({ request, auth, response }) {
    const perm = await Permission.query()
      .where('user_id', auth.user.id)
      .fetch();

    const permission = perm.toJSON()[0];

    if (permission.cadastroQuestao) {
      const {
        question,
        enemArea,
        year,
        exam,
        frente,
        subjects,
        answerCorrect,
        answerWrong,
      } = request.only([
        'question',
        'enemArea',
        'year',
        'exam',
        'frente',
        'subjects',
        'answerCorrect',
        'answerWrong',
      ]);

      const newquest = {
        user_id: auth.user.id,
        question,
        enemArea,
        subjects,
        year,
        exam,
        frente,
      };

      try {
        const quest = await Question.create(newquest);

        await Answer.create({
          question_id: quest.id,
          answer: answerCorrect,
          correct: true,
        });
        await Promise.all(
          answerWrong.map(async (elem) => {
            await Answer.create({
              question_id: quest.id,
              answer: elem,
            });
          })
        );
        response.status(200);
        return quest;
      } catch (error) {
        response.status(400);
        return { error };
      }
    } else {
      response.status(401);
      return { message: 'Permission denied' };
    }
  }

  async show({ request }) {
    const { status } = request.only(['status']);

    const ArrayQuestion = [];

    const questreturn = await Question.query().where('status', status).fetch();
    const quest = questreturn.toJSON();
    await Promise.all(
      quest.map(async (element) => {
        const answer = await Answer.query()
          .where('question_id', element.id)
          .fetch();
        ArrayQuestion.push({
          question: element,
          answer: answer.toJSON(),
        });
      })
    );
    return ArrayQuestion;
  }

  async changestatusquestion({ params }) {
    const { id, status } = params;

    await Question.query().where('id', id).update({ status });
  }
}

module.exports = QuestionController;
