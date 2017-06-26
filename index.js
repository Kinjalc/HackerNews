'use strict'; 

$(document).ready(function() {
	console.log('Hello world!');
	// call hacker news api and get a list of articles
	//for each item in the list make a another call to get more info and details
	//create an object which stores this info with [id] as the key
	//get the user details by making another api call and store the info in the object

	const displayData = {};

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

	function getList(){
		return new Promise ((resolve, reject) => {
			console.log('request');
			request('https://hacker-news.firebaseio.com/v0/topstories.json').then(function(response) {
				const list = response.splice(0, 10)
				resolve(list);
			}) 
		});
	}

	getList().then(result => {
		return result.map(id => {
			return new Promise ((resolve, reject) => {
				console.log('request');
				request('https://hacker-news.firebaseio.com/v0/item/'+ id + '.json').then(function(response) {
					console.log(response);
					resolve(response);
				}) 
			});
		})
	}).then(stories => {
		return Promise.all(stories).then(stories => {
			return stories.map(storyInfo => {
				displayData[storyInfo.by] = {title: storyInfo.title, url: storyInfo.url, timestamp: storyInfo.time}
				return new Promise ((resolve, reject) => {
					request('https://hacker-news.firebaseio.com/v0/user/'+ storyInfo.by + '.json').then(function(response) {
						console.log(response);
						resolve(response);
					}) 
				});
			})
		})
	}).then(users => {
		Promise.all(users).then(users => {
			 users.forEach(user => {
			 	displayData[user.id].karma = user.karma;
			 	displayData[user.id].id = user.id;
			 })
		})
	})
});
