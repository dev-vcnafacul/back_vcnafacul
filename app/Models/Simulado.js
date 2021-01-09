/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Question = use('App/Models/Question');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Answer = use('App/Models/Answer');

class Simulado extends Model {
  async enem(idQuestao, idioma) {
    let countIngles;
    let countEspanhol;

    if (idioma === 'Ing') {
      countIngles = 5;
      countEspanhol = 0;
    } else {
      countIngles = 0;
      countEspanhol = 5;
    }

    const MInhasFrentes = [
      ['Botânica e ecologia', 'BotEco', 5],
      ['Fisiologia animal e origem da vida', 'FisOri', 5],
      ['Metabolismo celular, Bioquímica e Genética', 'MetBioGen', 5],
      ['Eletromagnetismo', 'Electro', 5],
      ['Mecânica', 'Mec', 5],
      ['Óptica e Térmica', 'OptTer', 5],
      ['Aritmética e Algebra', 'AriAlg', 15],
      ['Financeira e Trigonometria', 'FinTri', 15],
      ['Geometria', 'Geo', 15],
      ['Físico-Química', 'FisQui', 5],
      ['Química Geral', 'QuiGeral', 5],
      ['Química Orgânica', 'QuiOrg', 5],
      ['Atualidade', 'Atual', 5],
      ['Filosofia', 'Filo', 5],
      ['Sociologia', 'Socio', 5],
      ['Geografia do Brasil', 'GeoBrasil', 7],
      ['Geografia Geral', 'GeoGeral', 8],
      ['História do Brasil', 'HistBrasil', 7],
      ['História Geral', 'HistGeral', 8],
      ['Artes', 'Artes', 3],
      ['Espanhol', 'Esp', countEspanhol],
      ['Gramática', 'Gram', 15],
      ['Inglês', 'Ingles', countIngles],
      ['Literatura', 'Literatura', 15],
      ['Leitura e Produção de Texto', 'LeiProd', 7],
    ];

    let myQuestion = {
      // 15
      BotEco: [],
      FisOri: [],
      MetBioGen: [],

      // 15
      Electro: [],
      Mec: [],
      OptTer: [],

      // 45
      AriAlg: [],
      FinTri: [],
      Geo: [],

      // 15
      FisQui: [],
      QuiGeral: [],
      QuiOrg: [],

      // 15
      Atual: [],
      Filo: [],
      Socio: [],

      // 15
      GeoBrasil: [],
      GeoGeral: [],

      // 15
      HistBrasil: [],
      HistGeral: [],

      // 45
      Artes: [],
      Esp: [],
      Gram: [],
      Ingles: [],
      Literatura: [],
      LeiProd: [],
    };

    const results = [];

    idQuestao.map((id) => {
      results.push(async () => {
        const myquest = await Question.findBy('id', id);
        myQuestion = await this.ordernarQuestoes(
          id,
          myQuestion,
          myquest.toJSON().frente
        );
      });
    });

    await Promise.all(results.map((elem) => elem()));

    const cadastraQuestoes = [];

    MInhasFrentes.map((frentes) => {
      cadastraQuestoes.push(async () => {
        const MinhasQuestoes = await Question.query()
          .where('frente', frentes[0])
          .whereNotIn('id', myQuestion[frentes[1]])
          .limit(frentes[2] - myQuestion[frentes[1]].length)
          .orderBy('quantity_test', 'difficulty', 'quantity')
          .fetch();

        MinhasQuestoes.toJSON().map(async (elem) => {
          myQuestion = await this.ordernarQuestoes(
            elem.id,
            myQuestion,
            elem.frente
          );
        });
      });
    });

    await Promise.all(cadastraQuestoes.map((elem) => elem()));

    return JSON.stringify(myQuestion);
  }

  async ordernarQuestoes(id, myQuestion, frente) {
    switch (frente) {
      case 'Botânica e ecologia':
        myQuestion.BotEco.push(id);
        break;
      case 'Fisiologia animal e origem da vida':
        myQuestion.FisOri.push(id);
        break;
      case 'Metabolismo celular, Bioquímica e Genética':
        myQuestion.MetBioGen.push(id);
        break;
      case 'Eletromagnetismo':
        myQuestion.Electro.push(id);
        break;
      case 'Mecânica':
        myQuestion.Mec.push(id);
        break;
      case 'Óptica e Térmica':
        myQuestion.OptTer.push(id);
        break;
      case 'Aritmética e Algebra':
        myQuestion.AriAlg.push(id);
        break;
      case 'Financeira e Trigonometria':
        myQuestion.FinTri.push(id);
        break;
      case 'Geometria':
        myQuestion.Geo.push(id);
        break;
      case 'Físico-Química':
        myQuestion.FisQui.push(id);
        break;
      case 'Química Geral':
        myQuestion.QuiGeral.push(id);
        break;
      case 'Química Orgânica':
        myQuestion.QuiOrg.push(id);
        break;
      case 'Atualidade':
        myQuestion.Atual.push(id);
        break;
      case 'Filosofia':
        myQuestion.Filo.push(id);
        break;
      case 'Sociologia':
        myQuestion.Socio.push(id);
        break;
      case 'Geografia do Brasil':
        myQuestion.GeoBrasil.push(id);
        break;
      case 'Geografia Geral':
        myQuestion.GeoGeral.push(id);
        break;
      case 'História do Brasil':
        myQuestion.HistBrasil.push(id);
        break;
      case 'História Geral':
        myQuestion.HistGeral.push(id);
        break;
      case 'Artes':
        myQuestion.Artes.push(id);
        break;
      case 'Espanhol':
        myQuestion.Esp.push(id);
        break;
      case 'Gramática':
        myQuestion.Gram.push(id);
        break;
      case 'Inglês':
        myQuestion.Ingles.push(id);
        break;
      case 'Literatura':
        myQuestion.Literatura.push(id);
        break;
      case 'Leitura e Produção de Texto':
        myQuestion.LeiProd.push(id);
        break;
      default:
        break;
    }
    return myQuestion;
  }

  async constroiQuestao(idQuestao) {
    const minhaQuestao = await Question.findBy('id', idQuestao);

    const answerQuestion = await Answer.query()
      .where('question_id', minhaQuestao.toJSON().id)
      .fetch();

    const arrayAnswer = [
      {
        id: answerQuestion.toJSON()[0].id,
        answer: answerQuestion.toJSON()[0].answer,
      },
      {
        id: answerQuestion.toJSON()[1].id,
        answer: answerQuestion.toJSON()[1].answer,
      },
      {
        id: answerQuestion.toJSON()[2].id,
        answer: answerQuestion.toJSON()[2].answer,
      },
      {
        id: answerQuestion.toJSON()[3].id,
        answer: answerQuestion.toJSON()[3].answer,
      },
      {
        id: answerQuestion.toJSON()[4].id,
        answer: answerQuestion.toJSON()[4].answer,
      },
    ];

    const MyQuestionReturn = {
      id_question: minhaQuestao.toJSON().id,
      question: minhaQuestao.toJSON().question,
      Area: minhaQuestao.toJSON().enemArea,
      subjects: minhaQuestao.toJSON().subjects,
      frente: minhaQuestao.toJSON().frente,
      answer: arrayAnswer,
    };

    return MyQuestionReturn;
  }

  async constroiSimulado(meuSimulado) {
    const results = [];

    const arrayQuestao = [];

    const IdsQuestion = JSON.parse(meuSimulado.questions_ids);

    for (const key in IdsQuestion) {
      IdsQuestion[key].map((elem) => {
        results.push(async () => {
          const Questao = await this.constroiQuestao(elem);
          arrayQuestao.push(Questao);
        });
      });
    }

    await Promise.all(results.map((func) => func()));

    return arrayQuestao;
  }
}

module.exports = Simulado;
