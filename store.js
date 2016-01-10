// 将爬虫得到的数据存储到文件中
var fs = require('fs');
var obj = {
  a: 1,
  b: 4
}

var arr = [obj, obj]
var file = fs.createWriteStream('array.txt');
file.on('error', function (err) {
  console.log('write  file  error ', err);
});
arr.forEach(function (v) {
  console.log('v is  ', JSON.stringify(v) );
  file.write(JSON.stringify(v)  +'\n');
});
file.end();