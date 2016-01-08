//  get itjuzi   http://www.itjuzi.com/company/31592
/*
productName = $('div>span.title').text().trim();
companyName = $('div>span.title').text().trim();
 address = ;
 stage = ''
 hirepage = ''

*/

//company  rule 1..1000  for each
//

var eventproxy = require('eventproxy');
var superagent = require('superagent');
var cheerio = require('cheerio');
var url = require('url');

var itjuziUrl = 'http://www.itjuzi.com/company/';

superagent.get(itjuziUrl)
	.end(function (err, res) {
		if (err){
			return console.err("   err is :", err);
		}
		console.log(" now get url  ",itjuziUrl);
		var companyUrls = [];
		var $ = cheerio.load(res.text);
    for(i=1;i <=1000;i++){
	    var href = url.resolve(itjuziUrl, i.toString());  //
	    companyUrls.push(href);
    }


		console.log("companyUrls:\n", companyUrls);
		var ep = new eventproxy();
		ep.after('topic_html', companyUrls.length, function (topics) {
			topics = topics.map(function (topicPair) {
				var topicUrl = topicPair[0];
				var topicHtml = topicPair[1];
				var $ = cheerio.load(topicHtml);
				return ({
					titile: $('.topic_full_title').text().trim(),
					href: topicUrl,
					comment1: $('.reply_content').eq(0).text().trim()
				});
			});
		
			console.log("final topics :\n", topics);
		
		});
		
		companyUrls.forEach(function (topicUrl) {
			superagent.get(topicUrl)
				.end(function (err, res) {
					console.log("   fetch url :", topicUrl);
					ep.emit('topic_html', [topicUrl, res.text]);
				})
		});

	});

//comment
//如何存储到数据库或者写入文件