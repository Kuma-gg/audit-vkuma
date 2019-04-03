var moment = require('moment');
module.exports = {
  ifeq: function (a, b, options) {
console.log(a,"-", b);
    if (a == b) {
      return options.fn(this);
    }
    return options.inverse(this);
  },
  ifeq3: function (userRol, sessionRolId, sessionId,idUser,options) {
    if(userRol == sessionRolId && sessionId+"+" == idUser+"+") {
      return options.fn(this);
    }
    return options.inverse(this);
  },
  dateFormat: function (dateValue) {
    var value = moment(dateValue).format("DD/MM/YYYY");
    return value;
  },
  selected: function (option, value) {
    if (option === value) {
      return ' selected';
    } else {
      return ''
    }
  }
}

const helpers = {};

