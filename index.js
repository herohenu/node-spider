var eventproxy = require('eventproxy');
var superagent = require('superagent');
var cheerio = require('cheerio');
var url = require('url');
var async = require('async');
var fs = require('fs');

var itjuziUrl = 'http://www.itjuzi.com/company/';
var companyUrls = [];
for (i = 1; i <= 3; i++) {
  var href = url.resolve(itjuziUrl, i.toString());  //
  companyUrls.push(href);
}

var concurrencyCount = 0;
var fetchUrl = function (url, callback) {
  companyurl = url;
  concurrencyCount++;
  superagent.get(companyurl)
    .end(function (err, res) {
      if (err) {
        callback(err, 'fetch url:' + companyurl + ' err: ');
        return console.log('fetch url:' + companyurl + ' err: ', err);
      }
      console.log('现在并发数目是******： ', concurrencyCount, ' **** fetch ' + companyurl + ' successful');
      //ep.emit('topic_html', [companyurl, res.text]);
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
      callback(null, cpobj);
    });
}

async.mapLimit(companyUrls, 2, function (url, callback) {
  console.log('url  is  :::', url);
  fetchUrl(url, callback)
}, function (err, result) {
  console.log('now  err , result  is ', result);
  if (!err) {
    console.log('result.length  ', result);
    arr = result;
    var file = fs.createWriteStream('result.json');
    file.on('error', function (err) {
      console.log('write  file  error ', err);
    });
    console.log('print result  **********', '');
    arr.forEach(function (v) {
      //console.log('v is  ', JSON.stringify(v));
      file.write(JSON.stringify(v) + ',\n');
    });
    file.end();
  }
})
