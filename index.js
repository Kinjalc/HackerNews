'use strict';

$(document).ready(function() {
	// call hacker news api and get a list of articles
	//for each item in the list make a another call to get more info and details
	//create an object which stores this info with [id] as the key
	//get the user details by making another api call and store the info in the object

//TO store the required data received from api calls
	const displayData = [];
	const authorData = {}

	//General Function - requires a url as a parameter and returns the data
	function request(url) {
		const req = new Request(url);
	   	return new Promise((resolve, reject) => {
			fetch(req, {
		}).then(res => {
         return res.json();
       	})
       .then(data => resolve(data))
       .catch(error => reject(error));
    });

	}

//To get a list of ids from hacker-news api
	function getList(){
		return new Promise ((resolve, reject) => {
			request('https://hacker-news.firebaseio.com/v0/topstories.json').then(function(response) {
				const list = response.splice(0, 10)
				resolve(list);
			})
		});
	}

//After getting ids from api, make other calls and save the required data in an object.
	getList().then(result => {
		return result.map(id => {
			return new Promise ((resolve, reject) => {
				request('https://hacker-news.firebaseio.com/v0/item/'+ id + '.json').then(function(response) {
					resolve(response);
				})
			});
		})
	}).then(stories => {
		return Promise.all(stories).then(stories => {
			return stories.map(storyInfo => {
				displayData.push({ by: storyInfo.by, title: storyInfo.title, url: storyInfo.url, timestamp: storyInfo.time, score: storyInfo.score });
				if (!authorData[storyInfo.by]){
					return new Promise ((resolve, reject) => {
						request('https://hacker-news.firebaseio.com/v0/user/'+ storyInfo.by + '.json').then(function(response) {
							resolve(response);
						})
					});
				}
			})
		})
	}).then(users => {
		Promise.all(users)
		.then(users => {
			users.forEach(user => {
				authorData[user.id] = { karma: user.karma, };
			})
		})
		.then(() => {
			let display = '<div class="container">';
			displayData.forEach(object =>{
				display += template(object);
			});
			$('#articles').html(`${display}</div>`);
		})
	});

//Put data in html format to display
	function template(object) {
		const pubDate = new Date(object.timestamp* 1000);
		const weekday=new Array("Sun","Mon","Tue","Wed","Thu","Fri","Sat");
		const monthname=new Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec");
		const hours = pubDate.getHours();
		const minutes = "0" + pubDate.getMinutes();
		const seconds = "0" + pubDate.getSeconds();
		const formattedDate = weekday[pubDate.getDay()] + ' '
                    + monthname[pubDate.getMonth()] + ' '
                    + pubDate.getDate() + ', ' + pubDate.getFullYear() + ' '
                    + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2) + ' ET';
   	return (
			"<div class='article' ><a href='" + object.url+ "'><h3>"+ object.title + "</h3></a><div><span class='time'>"
			+ formattedDate + "</span><span> Score: " + object.score + "</span></div><div><span>"
			+ authorData[object.by].karma + "</span> by <span>" + object.by + "</span></div></div>"
		)
	}
});
