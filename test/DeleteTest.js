var should = require('should');
var sqlParser = require(__dirname + '/../lib/sqlParser.js');

describe('parse delete sql',function(){

  /*{{{ test parse source works fine*/
  it('test parse source works fine',function(done){
    var sql = "deLEtE fRom sql.(select * from M) as m";
    var expect = {
      source:{
        name : "m",
        type : "sql",
        source : "select * from M",
      }
    }
    sqlParser.parse(sql).should.eql(expect)
    done();
  });
  /*}}}*/

  /*{{{ test parse where works fine*/
  it('test parse where works fine',function(done){
    var sql = "dElete FrOm a wHeRe id between (100 and 200) and id2 in (2,5,'8')";
    var expect = [   
      { 
        column:{text:"id",type:1},
        relate:sqlParser.RELATE["between"],
        values:[[{text:100,type:2}],[{text:200,type:2}]]
      },
      {
        column:{text:"id2",type:1},
        relate:sqlParser.RELATE["in"],
        values:[[{text:2,type:2}],[{text:5,type:2}],[{text:"8",type:3}]]
      }
    ];
    sqlParser.parse(sql).where.should.eql(expect);
    done();
  });
  /*}}}*/

  /*{{{ test parse entire delete works fine*/
  it('test parse entire delete works fine',function(done){
    var sql = "dElete fRom db.table wheRe cid=1";
    var expect = {
      source : {
        name : "table",
        type : "db",
        source : "table",
      },
      where : [
        {
          column: {text:"cid",type:1},
          relate: sqlParser.RELATE["="],
          values: [[{text:1,type:2}]]
        }
      ]
    };
    sqlParser.parse(sql).should.eql(expect);
    done();
  });
  /*}}}*/

});
