var express = require('express');

var app = new express();
var request = require('request');
var Promise = require('bluebird');


app.get('/search', function(req, res) {
	console.log("Requested route search, for search query: "+ req.query.user);


	if(req.query.user == "")
		return res.badRequest();

	var results = [];

	getHtmlFromYoutubeUser(req.query.user).then(async function(html) {

		var regex = /<img.*src="(.*vi\/(.*)\/.*)">/gm;

		while (matches = regex.exec(html)) {
			console.log("matches: "+ JSON.stringify(matches));
			var data = {
				thumb: matches[1],
				id: matches[2]
			}
			// try {
			// 	var title = await getTitleFromYoutubeVideo(data.id) || "";
			// } catch(e) {
			// 	console.error(e);
			// }

			// data.title = title;
		
			results.push(data);
		}

		res.json(results);
	}).catch(function(e) {
		res.json(e);
	})



})

app.listen(80);
console.log('server running in port 80');

function getTitleFromYoutubeVideo(id) {
	return new Promise((resolve, reject) => {

		request('https://www.youtube.com/watch?v='+id, function(err, res, body) {
			if(err)
				return reject(err);

			var regex = /document.title.*=.*"(.*)"/;

			var matches = regex.exec(body);

			if(!matches) 
				return resolve("");

			resolve(matches[1])
		})
	})
}


function getHtmlFromYoutubeUser(user) {

	return new Promise((resolve, reject) => {

		request('https://www.youtube.com/user/' + user + '/videos', function (error, response, body) {
			if(error)
				return reject(error);

			resolve(body);
		});
	});
}