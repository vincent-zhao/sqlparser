# 介绍

`sqlparser`是一个简单的sql解析器。将一句完整的sql语句解析为一个JavaScript对象

* 支持select，insert，delete，update语句
* 除select部分支持子sql以外，都不支持子sql嵌套
* select的from关键字和join关键字后，可以嵌套子sql
* 四种sql语句的解析结果对象可以查看test目录下的单元测试用例来了解

# 安装

```bash
$ npm install sqlparser
```

# 使用

sqlparser的使用非常方便

```javascript
var Parser = require('sqlparser');
var result = Parser.parse('select * from table');

```

# 测试

* 单元测试：根目录下运行 make test
* 代码覆盖率测试：根目录下运行 make cov，在根目录下获得coverage.html为结果

# 联系方式

如有任何意见或者建议，请和我联系 zzqvincent@gmail.com
