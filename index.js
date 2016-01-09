var EventProxy  = require('eventproxy');
var superagent = require('superagent');
var cheerio = require('cheerio');
var url = require('url');
var async = require('async');
var fs = require('fs');
var ep = new EventProxy();
var file = fs.createWriteStream('result.json');
var itjuziUrl = 'http://www.itjuzi.com/company/';
var companyUrls = [];
for (i = 1; i <= 1001; i++) {
  var href = url.resolve(itjuziUrl, i.toString());  //
  companyUrls.push(href);
}

var concurrencyCount = 0;
var fetchUrl = function (url, callback) {
  companyurl = url;
  concurrencyCount++;
  superagent.get(companyurl)
    .end(function (err, res) {
      if (err || res.status  != '200' ) {
        //callback(err, 'fetch url:' + companyurl + ' err: ');
        //console.log('fetch url:' + companyurl + ' err: ');
      }
      console.log('现在并发数目是******： ', concurrencyCount, ' **** fetch ' + companyurl + ' successful');
      //ep.emit('topic_html', [companyurl, res.text]);
      if(res.text){
        var $ = cheerio.load(res.text);
        concurrencyCount--;
        var cpobj = {
          productName: $('div>span.title').text().replace(/[\n\t\r\s]/g, ""),
          companyName: $('div.des-more>div> span').eq(0).text().replace(/[\n\t\r\s]/g, ""),
          address: $('span.loca.c-gray-aset').text().replace(/[\n\t\r\s]/g, ""),
          stage: $('td.mobile-none').text().replace(/[\n\t\r\s]/g, ""),
          mainpage: $('a.weblink').attr('href'),
          hirepage: ''
        };
        //console.log('cpobj***************',cpobj);
        fs.appendFile('result.txt',JSON.stringify(cpobj),function(err){});
        fs.appendFile('result.txt',',\n',function(err){});
        callback(null, cpobj);
      }

    });
}


async.mapLimit(companyUrls, 3, function (url, callback) {
  console.log('url  is  :::', url);
  fetchUrl(url, callback)
}, function (err, result) {
    if(err){
      file.end();
    }
    console.log('result.length  ', result);
    var arr = result;
    var file = fs.createWriteStream('result.json');
    file.on('error', function (err) {
      console.log('write  file  error ', err);
    });
    //arr.forEach(function (v) {
    //  //console.log('v is  ', JSON.stringify(v));
    //  file.appendFile(JSON.stringify(v) + ',\n');
    //});
    file.end();
})
