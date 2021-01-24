const fs = require('fs');
const path = require('path');
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Question extends Model {
  user() {
    return this.belongsTo('App/Models/User');
  }

  answer() {
    return this.hasMany('App/Models/Answer');
  }

  responseFileStream(namefileQuestion) {
    const mypath = `${path.resolve('./')}/tmp/uploadsQuestion/`;
    const readStream = fs.createReadStream(`${mypath}${namefileQuestion}.jpg`);
    return readStream;
  }
}

module.exports = Question;
