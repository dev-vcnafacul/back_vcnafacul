/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Answer extends Model {
  question() {
    return this.belongsTo('App/Models/Question');
  }
}

module.exports = Answer;
