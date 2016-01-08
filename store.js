// 将爬虫得到的数据存储到文件中
var fs = require('fs');
var obj ={
	a :1,
	b:4
}
fs.writeFile('aa.txt' , JSON.stringify(obj),function(err,result){
	  if (err)  throw err;
	  console.log(" it saved ");

})