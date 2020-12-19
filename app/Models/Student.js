/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Student extends Model {
  student() {
    this.hasOne('App/Models/User', 'id', 'user_id');
  }
}

module.exports = Student;
