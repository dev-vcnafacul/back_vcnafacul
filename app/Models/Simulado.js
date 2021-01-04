/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Question = use('App/Models/Question');

class Simulado extends Model {
  async enem(idQuestao) {
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

    // Biologia

    const myquest = await Question.query()
      .where('frente', 'Botânica e ecologia')
      .limit(5 - myQuestion.BotEco.length)
      .orderBy('quantity_test', 'difficulty', 'quantity')
      .fetch();

    myquest.toJSON().map(async (elem) => {
      myQuestion = await this.ordernarQuestoes(
        elem.id,
        myQuestion,
        elem.frente
      );
      console.log(elem.quantity_test);
      await Question.query()
        .where('id', elem.id)
        .update('quantity_test', elem.quantity_test + 1);
    });

    console.log(myQuestion);
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
        myQuestion.LeiProd.concat(id);
        break;
      default:
        break;
    }
    return myQuestion;
  }
}

module.exports = Simulado;
