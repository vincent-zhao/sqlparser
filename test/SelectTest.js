var should = require('should');
var sqlParser = require(__dirname + '/../lib/sqlParser');
var util = require('util');

describe('parse select sql',function(){

  /*{{{ test parse select works fine*/
  it('test parse select works fine',function(done){
		var sql = 'sElECt a, 1 b, 1+MD5("123") AS `select`, MAX(d), DistInct user.username';
    var expect = {
      column:{
        'a':{
          dist : null,
          expr : [{
            text : 'a',
            type : 1
          }]
        },
        'b':{
          dist : null,
          expr : [{
            text : 1,
            type : 2
          }]
        },
        'select' : {
          dist: null,
          expr: [{
            text: 1,
            type: 2
          },
          {
            text: '+',
            type: 7
          },
          {
            text: 'MD5',
            type: 4
          },
          {
            text: '(',
            type: 8
          },
          {
            text: '123',
            type: 3
          },
          {
            text: ')',
            type: 8
          }]
        },
        'MAX(d)' : {
          dist: null,
          expr: [{
            text: 'MAX',
            type: 4
          },
          {
            text: '(',
            type: 8
          },
          {
            text: 'd',
            type: 1
          },
          {
            text: ')',
            type: 8
          }]
        },
        'username' : {
          dist: {
            text: 'DISTINCT',
            type: 1
          },
          expr: [{
            text: 'user.username',
            type: 1
          }]
        }
      }
    }
    sqlParser.parse(sql)[0].should.eql(expect);
    done();
  });
  /*}}}*/

  /*{{{ test parse source works fine*/
  it('test parse source works fine',function(done){
		var sql = 'SELECT a FROM mysql.tableA As a, myfox.tableB b,  action.ActionA as c, sql.(select s FROM (select m from m)) d, (select * from t), (select * from d) as s, prom.tableC, tableD as f, tableG';
    var expect = {
      a:{
        type:"mysql",
        source:"tableA"
      },
      b:{
        type:"myfox",
        source:"tableB"
      },
      c:{
        type:"action",
        source:"ActionA"
      },
      d:{
        type:"sql",
        source:"select s FROM ( select m from m )"
      },
      "select * from t":{
        type:"",
        source:"select * from t"
      },
      s:{
        type:"",
        source:"select * from d"
      },
      tableC:{
        type:"prom",
        source:"tableC"
      },
      f:{
        type:"",
        source:"tableD"
      },
      tableG:{
        type:"",
        source:"tableG"
      }
    };
    sqlParser.parse(sql)[0].source.should.eql(expect);
		done();
  });
  /*}}}*/

  /*{{{ test parse join works fine*/
  it('test parse join works fine',function(done){
		var sql = 'SELECT a FROM b LEFT JOIN action.Action1 as m ON a.c3=m.c3 AND a.c4>b.c4 JOIN tab_c as c ON c.id in (1,5,9) RIGHT JOIN sql.(SELECT m FROM M) as s ON s.id=a.id';
    var expect = {
      m:{
        type:"action",
        source:"Action1",
        method: sqlParser.JOIN["LEFT JOIN"],
        where:[
          {
            column: {text:"a.c3",type:1},
            relate: sqlParser.RELATE["="],
            values: [[{text:"m.c3",type:1}]]
          },
          {
            column: {text:"a.c4",type:1},
            relate: sqlParser.RELATE[">"],
            values: [[{text:"b.c4",type:1}]]
          }
        ]
      },
      c:{
        type:"",
        source:"tab_c",
        method:sqlParser.JOIN["INNER JOIN"],
        where:[
          {
            column: {text:"c.id",type:1},
            relate: sqlParser.RELATE["in"],
            values: [[{text:1,type:2}],[{text:5,type:2}],[{text:9,type:2}]]
          }
        ]
      },
      s:{
        type:"sql",
        source:"SELECT m FROM M",
        method:sqlParser.JOIN["RIGHT JOIN"],
        where:[
          {
            column: {text:"s.id",type:1},
            relate: sqlParser.RELATE["="],
            values: [[{text:"a.id",type:1}]]
          }
        ]
      }
    }
    sqlParser.parse(sql)[0].joinmap.should.eql(expect);
		done();
  
  });
  /*}}}*/

  /*{{{ test parse where works fine*/
  it('test parse where works fine',function(done){
		var sql = 'SelEcT a FROM b WHERE a=b AND m=SUM(m+2) AND c >= "id" AND thedate BETWEEN (100 AND 200+n) AND t IN (SUM(num+3),n+5,"6") and m LIKE "%abc%" AND 1 <> 2 AND d is not null AND p NOT LIKE "8" AND db.table.x NOT IN (2) AND z is null';
    var expect = 
    [
      {
        relate: sqlParser.RELATE["="],
        values: [[{text: 'b',type: 1}]],
        column: {text: 'a',type: 1}
      },
      {
        relate: sqlParser.RELATE['='],
        values: [[{text:'SUM',type:4},{text:'(',type:8},{text:'m',type:1},{text:'+',type:7},{text:2,type:2},{text:')', type:8}]],
        column: {text: 'm',type: 1}
      },
      {
        relate: sqlParser.RELATE[">="],
        values: [[{text: 'id',type: 3}]],
        column: {text: 'c',type: 1}
      },
      {
        relate: sqlParser.RELATE["between"],
        values: [[{text: 100,type: 2}],[{text: 200,type: 2},{text:'+',type:7},{text:'n',type:1}]],
        column: {text: 'thedate',type: 1}
      },
      {
        relate: sqlParser.RELATE["in"],
        values: [
          [{text:'SUM',type:4},{text:'(',type:8},{text:'num',type:1},{text:'+',type:7},{text:3,type:2},{text:')', type:8}],
          [{text:'n',type:1},{text:'+',type:7},{text: 5,type: 2}],
          [{text: '6',type: 3}]],
        column: {text: 't',type: 1}
      },
      {
        relate: sqlParser.RELATE["like"],
        values: [[{text: '%abc%',type: 3}]],
        column: {text: 'm',type: 1}
      },
      {
        relate: sqlParser.RELATE["<>"],
        values: [[{text: 2,type: 2}]],
        column: {text: 1,type: 2}
      },
      {
        relate: sqlParser.RELATE["not null"],
        values: null,
        column: {text: 'd',type: 1}
      },
      {
        relate: sqlParser.RELATE["not like"],
        values: [[{text: '8',type: 3}]],
        column: {text: 'p',type: 1}
      },
      {
        relate: sqlParser.RELATE["not in"],
        values: [[{text: 2,type: 2}]],
        column: {text: 'db.table.x',type: 1}
      },
      {
        relate: sqlParser.RELATE["is null"],
        values: null,
        column: {text: 'z',type: 1}
      }
    ]
    sqlParser.parse(sql)[0].where.should.eql(expect);
		done();
  });
  /*}}}*/

  /*{{{ test parse groupby works fine*/
  it('test parse groupby works fine',function(done){
		var sql = 'SELECT a FROM b gRouP by c, CONCAT(`status`, "wo")';
		var expect = 
      [
        [{text: 'c',type: 1}], 
        [
          {text: 'CONCAT',type: 4},
          {text: '(',type: 8},
          {text: 'status',type: 5},
          {text: ',',type: 8},
          {text: 'wo',type: 3},
          {text: ')',type: 8}
        ]
      ]
    sqlParser.parse(sql)[0].groupby.should.eql(expect);
    done();
  });
  /*}}}*/

  /*{{{ test parse orderby works fine*/
  it('test parse orderby works fine',function(done){
		var sql = 'SELECT * FROM tab ORDER BY a DESC, MD5(b), c ASC';
    var expect = 
      [
        {
          type: 2,
          expr: [{text: 'a',type: 1}]
        },
        {
          type: 1,
          expr: [
            {text: 'MD5',type: 4},
            {text: '(',type: 8},
            {text: 'b',type: 1},
            {text: ')',type: 8}
          ]
        },
        {
          type: 1,
          expr: [{text: 'c',type: 1}]
        }
      ]
    sqlParser.parse(sql)[0].orderby.should.eql(expect);
		done();
  });
  /*}}}*/

  /*{{{ test parse limit works fine*/
  it('test parse limit works fine',function(done){
		var sql = 'Select a from b LIMIT 10';
    var expect =
      [
        {text:0,type:2},
        {text:10,type:2}
      ]
    sqlParser.parse(sql)[0].limit.should.eql(expect);
		done();
  });
  /*}}}*/

  /*{{{ test parse entire sql works fine*/
  it('test parse entire sql works fine',function(done){
    var sql = "sElect distInct a.m as Afrom from sql.(select * from M) as bjoin rIght JoIn action.joinTab as tab On tab.col>b.col where b.id in (1,4,6) grouP by b.id Order bY b.order LimIt 2,17";
    var expect = {
      column:{
        Afrom : {
          dist : {text:"DISTINCT",type:1},
          expr : [{text:"a.m",type:1}]
        }
      },
      source:{
        bjoin : {
          type:"sql",
          source:"select * from M"
        }
      },
      joinmap:{
        tab:{
          type:"action",
          source:"joinTab",
          method:sqlParser.JOIN["RIGHT JOIN"],
          where:[{
            column:{text:"tab.col",type:1},
            relate:sqlParser.RELATE[">"],
            values:[[{text:"b.col",type:1}]]
          }]
        }
      },
      where:[
        {
          column:{text:"b.id",type:1},
          relate:sqlParser.RELATE["in"],
          values:[[{text:1,type:2}],[{text:4,type:2}],[{text:6,type:2}]]
        },
      ],
      groupby:[
        [
          {text:"b.id",type:1}
        ]
      ],
      orderby:[
        {
          type:1,
          expr:[
            {text:"b.order",type:1}
          ]
        }
      ],
      limit:[
        {text:2,type:2},
        {text:17,type:2}
      ]
    }
    sqlParser.parse(sql)[0].should.eql(expect);
		done();
  });
  /*}}}*/

  /*{{{ test parse union right*/
  it('test parse union works fine',function(done){
    var sql = "select a from m UniOn select b from n union (select c from p)";
    var expect = [
      {
        column : {
          "a" : {
            dist : null,
            expr : [{text:"a",type:1}]
          }
        },
        source : {
          "m" : {
            type : "",
            source : "m"
          }
        }
      },
      {
        column : {
          "b" : {
            dist : null,
            expr : [{text:"b",type:1}]
          }
        },
        source : {
          "n" : {
            type : "",
            source : "n"
          }
        }
      },
      {
        column : {
          "c" : {
            dist : null,
            expr : [{text:"c",type:1}]
          }
        },
        source : {
          "p" : {
            type : "",
            source : "p"
          }
        }
      }
    ];
    sqlParser.parse(sql).should.eql(expect);
		done();
  });
  /*}}}*/

});
