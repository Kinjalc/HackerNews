# HackerNews
Calls hacker news api- topstories, story, user and displays data in the frontend

Uses Promises to make 3 sequential hacker news api calls. 
First call to https://hacker-news.firebaseio.com/v0/topstories to get topstory ids.
Once we have all the ids, save the first 10 results and make another call to /item/id to get story details.
The data received from each story is saved in an object with id as a key. 
Another call is made to /user/id and the additional data is saved in corresponding id object.
Since this is all done through Promises and .then the next step is executed only after the previous step is completed.
