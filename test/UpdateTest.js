var should = require('should');
var sqlParser = require(__dirname + '/../lib/sqlParser');

describe('parse update sql',function(){

  /*{{{ test parse source works fine*/
  it('test parse source works fine',function(done){
    var sql = "uPdAte sql.(select * from M) as m SeT n=1 WHerE p=2";
    var expect = {
      name : "m",
      type: "sql",
      source: "select * from M",
    }
    sqlParser.parse(sql).source.should.eql(expect);
    done();
  });
  /*}}}*/

  /*{{{ test parse column works fine*/
  it('test parse column works fine',function(done){
    var sql = "uPdAte a SeT a.m = 1+m,n='a' WHerE b=2"; 
    var expect = 
    [
      {
        column : {text:"a.m",type:1},
        relate : sqlParser.RELATE["="],
        values : [[{text:1,type:2},{text:'+',type:7},{text:'m',type:1}]]
      },
      {
        column : {text:"n",type:1},
        relate : sqlParser.RELATE["="],
        values : [[{text:'a',type:3}]]
      },
    ];
    sqlParser.parse(sql).column.should.eql(expect);
    done();
  });
  /*}}}*/

  /*{{{ test parse where works fine*/
  it('test parse where works fine',function(done){
    var sql = "uPdAte tab SeT m=1 WHerE id between (100 and 200) and id2 in (2,5,'8')";
    var expect = 
    [
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

  /*{{{ test parse entire update works fine*/
  it("test parse entire update works fine",function(done){
    var sql = "UPdAte db.table as tab sEt tab.name = 'ban' ,tab.sex = 'male' where tab.id > 3 and tab.year in (1990,'1991')";
    var expect = {
      source : {
        name : "tab",
        type : "db",
        source : "table",
      },
      column : [
        {
          column : {text:"tab.name",type:1},
          relate : sqlParser.RELATE["="],
          values : [[{text:'ban',type:3}]]
        },
        {
          column : {text:"tab.sex",type:1},
          relate : sqlParser.RELATE["="],
          values : [[{text:'male',type:3}]]
        },
      ],
      where : [
        {
          column : {text:"tab.id",type:1},
          relate : sqlParser.RELATE[">"],
          values : [[{text:3,type:2}]]
        },
        {
          column : {text:"tab.year",type:1},
          relate : sqlParser.RELATE["in"],
          values : [[{text:1990,type:2}],[{text:'1991',type:3}]]
        }   
      ]
    };
    sqlParser.parse(sql).should.eql(expect);
    done();
  });
  /*}}}*/

});



