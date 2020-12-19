/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Teacher extends Model {
  teacher() {
    this.belongsTo('App/Models/User');
  }
}

module.exports = Teacher;
