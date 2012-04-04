var should = require('should');
var sqlParser = require(__dirname + '/../lib/sqlParser');

describe('parse insert sql',function(){
  
  /*{{{ test parse source works fine*/
  it('test parse source works fine',function(done){
    var sql = "iNsert iNTo sql.(select * from M) as m ('col1','col2','col3')";
    var expect = {
      source : {
        name : "m",
        type: "sql",
        source: "select * from M",
        column: [{text:"col1",type:3},{text:"col2",type:3},{text:"col3",type:3}]
      }
    }
    sqlParser.parse(sql).should.eql(expect);
    done();
  });
  /*}}}*/

  /*{{{ test parse values works fine*/
  it('test parse values works fine',function(done){
    var sql = "insert INTO a VaLUes (1,2,4)";
    var expect = [[{text:1,type:2},{text:2,type:2},{text:4,type:2}]];
    sqlParser.parse(sql).values.should.eql(expect);
    done();
  });
  /*}}}*/

  /*{{{ test parse entire insert works fine*/
  it('test parse entire insert works fine',function(done){
    var sql = "InsErt intO db.testTableValueS ('col1','col2') VAlueS ('a',2,'6')";
    var expect = {
      source : {
        name: "testTableValueS",
        type: "db",
        source: "testTableValueS",
        column: [{text:'col1',type:3},{text:'col2',type:3}]
      },
      values:[
        [{text:'a',type:3},{text:2,type:2},{text:'6',type:3}],
      ]
    }
    sqlParser.parse(sql).should.eql(expect);
    done();
  });
  /*}}}*/

  /*{{{ test_parse_entire_insert_several_values_works_fine*/
  it('test_parse_entire_insert_several_values_works_fine',function(done){
    var sql = "InsErt intO db.testTableValueS ('col1','col2') VAlueS ('a',2,'6'),('m','n'),(1,'p')";
    var expect = {
      source : {
        name: "testTableValueS",
        type: "db",
        source: "testTableValueS",
        column: [{text:'col1',type:3},{text:'col2',type:3}]
      },
      values:[
        [{text:'a',type:3},{text:2,type:2},{text:'6',type:3}],
        [{text:'m',type:3},{text:'n',type:3}],
        [{text:1,type:2},{text:'p',type:3}],
      ]
    }
    sqlParser.parse(sql).should.eql(expect);
    done();
  });
  /*}}}*/

});
