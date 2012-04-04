var parsers = [];

function init(){
  require('fs').readdirSync(__dirname).forEach(function(file) {
    var match   = file.match(/^(\w+)\.js$/);
      if (!match) {
        return;
      }
      parsers[match[1].trim().toLowerCase()] = require(__dirname + '/' + file);
  });
}
init();


exports.parse = function(sql) {
  sql = sql.trim();
  var who = sql.substr(0,sql.indexOf(' ')).toLowerCase();
  if(parsers[who] === undefined){
    throw new Error("Unsupport sentence");
  }
  return  parsers[who].createObj(sql);
}

exports.RELATE = parsers['sqlparsetool'].RELATE;
exports.JOIN = parsers['sqlparsetool'].JOIN;
exports.ORDER = parsers['sqlparsetool'].ORDER;
