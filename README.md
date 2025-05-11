# Race Time - by up2246823
## Key features

1) Stopwatch: Timekeepers will be able to record the time (start, stop and reset stopwatch)
2) Marshals counter
3) Spectators screeen 




### Key Feature Name/Description.
Tell us briefly how to find & use it.
Describe the thinking behind the design of this feature. 

1) Stopwatch timer for timekeepers:

The stopwatch uses the Date.now() which gets the current time. Manipulations to the Date.now() is done to format the time displayed in hours, minutes, seconds and milliseconds. 



--------------------------------------------------------------------------------------------------------------------------------------------

### Key Another Feature Name/Description.
Tell us briefly how to find & use it.
Describe the thinking behind the design of this feature.

2) Marshal counter:

Marshals will be able to keep track of racers via a counter button which displays the total number of racers passing by each marshal at each checkpoint. The marshals will be able to post to the server; stating the checkpoint they are stationed and the number of racers recorded by the marshal. In the event that the marshal misclicks/makes a mistake in counting the number of racers, they will be given the option to add/remove from the total count recorded before submitting results to the server. Marshals will be able to count the number of racers online or offline since there is no dependance on online connection and the web pages will be cached.



### Key Feature Name/Description.
Same for each feature… you get the idea :-)

3) Spectators URL

Spectators will be able to view the final race results once the race has ended and the admins/timekeepers have submitted their results to the server.


### Key feature Name/Description:

4) Exporting results to csv spreadsheet:




 


## AI

### Prompts to develop XYZ (example)
A sequence of prompts helped me develop this feature:

>  this is an example prompt given to a chatbot
The response was proved useless because the prompt wasn't specific enough about XYZ, so:

>  this is an example prompt given to a chatbot detailing XYZ
The response was better so I could specifically ask about QRST - this may evolve into a longer discussion highlighting some insight you gained… who knows where you might pick up marks!

>  how can I integrate QRST here?
The suggestion worked with minor modifications.

### Prompts to develop GHIJ (example)
For the GHIJ feature I ...

>  this is an example prompt given to a chatbot
words words words etc

1) 

How can I test offline and switch between online and offline in the chrome?

Response: 

How can I test offline and switch between online and offline in the chrome?

Testing Offline:
Open DevTools: In Chrome, open DevTools (right-click on the page and select "Inspect" or press Cmd+Option+I).
Go to the Application Tab: Navigate to the "Application" tab in DevTools.
Service Workers: In the left sidebar, under "Application," click on "Service Workers." You should see your service worker registered.
Cache Storage: Also in the left sidebar, under "Application," click on "Cache Storage." You should see your cache (cw-v1) and the cached files.
Go Offline: In DevTools, go to the "Network" tab and select "Offline" from the throttling dropdown.
Reload the Page: Reload your page. If everything is set up correctly, your app should load the offline.html page when offline.

This helped me with with noticing what happens to my web app if I were toggle the network to offline. It helps to get 2 ideas for offline use: Either have an offline fall back page or use the cache (assuming the user has accessed the web app while online).

2) 
(index):84 Uncaught TypeError: Cannot read properties of null (reading 'addEventListener') at (index):84:21 (anonymous) @ (index):84


Response::

The error indicates that the clearButton element is not being found, which means the querySelector is returning null. This could be due to the script running before the DOM is fully loaded. To ensure that the script runs after the DOM is fully loaded, you can wrap your script in a DOMContentLoaded event listener.

Resource/website used for post request:

https://jsoneditoronline.org/indepth/data-fetching/post-json/

This helped me understand post requests

3) 
Uncaught (in promise) TypeError: Failed to execute 'put' on 'Cache': Request scheme 'chrome-extension' is unsupported.

Response to prompt:

The error you're encountering is due to the service worker trying to cache requests with the chrome-extension scheme, which is not supported. To fix this, you can add a check to ensure that only requests with supported schemes (e.g., http and https) are cached.

self.addEventListener('fetch', event => {
    if (event.request.url.startsWith('http')) { // Only cache requests with http/https scheme
        event.respondWith(fetchEvent(event));
    }
});

4) Resource: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Tutorials/js13kGames/Offline_Service_workers

Resource: https://medium.com/samsung-internet-dev/pwa-series-service-workers-the-basics-about-offline-a6e8f1d92dfd

I used this website to look into how to make the service worker work offline. I wanted to make my web app accessible offline. 

sessionID => to identify the people submitting the race results (there can be  multiple people submitting race results)
=> Take average of the times. 



Get user's name and email and location (each location for the event has a locationID) where they are racing in e.g. Portsmouth or London etc

Store these details in database

Location => 

master timer 
local list of people's position which is changeable.

Register people and display a table/list of each person's name, location of the event and option to scan the QR code (which will be given to each racer to identify them). The marshals or whoever is in charge with the race will enter the position of the racer b

5) 
To synchronize the timer/stopwatch, you need to ensure that the timer starts from zero when reset and that the elapsed time is correctly calculated when the timer is stopped and restarted. Additionally, you should ensure that the timer updates at regular intervals.

To synchronize the timer/stopwatch so that it starts for all users at the same time, you need to implement a server-side solution that manages the timer state and broadcasts updates to all connected clients. This can be achieved using WebSockets for real-time communication between the server and clients.

6) Could I instead of having serverPost function use import express from 'express' and then do express().post(#whatever i want)??

Response:

No, you cannot use import express from 'express' in a browser environment or directly call express().post() in your client-side JavaScript. The express module is a server-side framework designed to run in a Node.js environment, not in the browser.

Why This Won't Work:
Express is Server-Side Only:

Express is a Node.js framework for building server-side applications. It cannot be used in the browser because the browser does not have access to Node.js modules like express.
Client-Side vs. Server-Side:

On the client side (browser), you use fetch or XMLHttpRequest to make HTTP requests to a server.
On the server side, you use express to define routes and handle incoming HTTP requests.
Correct Approach:
If you want to send data to a server from the client, you should use fetch or similar client-side APIs. The server (built with Express) will handle the incoming request.

7) https://medium.com/@anshmunjal/how-to-create-get-and-post-endpoints-in-nodejs-using-expressjs-77fd3953ec38

What I learned:
Express is used for server side and we can't use it for the client side. I can not use express().post() the way I was thinking to send data from the client to the server. 

8) Synchronisation of the stopwatch timer:

prompt: 
When i do localhost:8080/timerState i get the html page which is basically the same i see when i try for index.html. i dont see JSON.

Response: 

If navigating to http://localhost:8080/timerState in your browser returns the HTML page (the same as index.html) instead of JSON, it means the server is not correctly routing the /timerState endpoint. Instead, it is falling back to the default route that serves the index.html file.

This issue occurs because your server.js file has a catch-all route (app.get('*', ...)) that serves index.html for all unhandled GET requests. The /timerState endpoint is being overridden by this catch-all route.

9) Uncaught (in promise) TypeError: Failed to execute 'put' on 'Cache': Request scheme 'chrome-extension' is unsupported at fetchEvent (sw.js:58:19)

response: 

The error Uncaught (in promise) TypeError: Failed to execute 'put' on 'Cache': Request scheme 'chrome-extension' is unsupported occurs because the service worker is attempting to cache a request with the chrome-extension:// scheme, which is not supported by the Cache API. This typically happens when a browser extension makes a request, and the service worker intercepts it

The service worker intercepts all fetch requests, including those made by browser extensions (e.g., chrome-extension:// requests). However, the Cache API only supports caching requests with the http:// or https:// schemes. When the service worker tries to cache a chrome-extension:// request, it throws this error.

What I learned/How it helped me:

Basically, I need to filter our requests with unsupported schemes like chrome-extension://

10) Is there a way to make a table grid in Javascript without using any third party libraries/services?

Response: 
rm -rf node_modules (temp note) ---- 

Yes, you can create a table grid in JavaScript without using any third-party libraries or services by dynamically generating an HTML <table> element and populating it with data.

Resource used:
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString

Resource used for dynamically generating rows in tables in javascript and HTML: https://www.youtube.com/watch?v=vkqZC_rEkVA

1) sync timer
2) provide marshal features: count the number of runners at checkpoints and simuntaneously record the time the number button was clicked
3) provide drawn by hand map which marshall locations e.g. marshal 1 or 4 etc
public user screen


stopwatch current time and racer's result stored in array not on server?


prompt: 

the functionality weighting for this coursework is 30% which maintainability and etc making up the rest. The functionality is described as: Functionality
How appropriate is the design (data, code, architecture)? Does it all work? How much (including advanced features) does it do?

so based on my code right now excluding camera accesss since i decided to remove that, how much does my code do?

Response:

Evaluation of Functionality
Strengths:
The server implements core functionality (timer management, data submission, file uploads) effectively.
The architecture is modular, with separate endpoints for different functionalities.
The use of streams for file uploads is efficient and scalable.
Weaknesses:
Lack of data persistence limits the usefulness of the application.
Minimal input validation could lead to errors or unexpected behavior.
The client-side code does not fully utilize the server's capabilities (e.g., querying /timerState).


Suggestions to Improve Functionality
Add Data Persistence:

Use SQLite to store count, checkpoint, and time data.
Add endpoints to retrieve stored data (e.g., /get-counts).
Improve Validation:

Validate inputs for all endpoints (e.g., ensure count is a number, time is in the correct format).
Validate uploaded files (e.g., check file type and size).
Enhance Client-Side Integration:

Use the /timerState endpoint to synchronize the timer state between the client and server.
Display server responses (e.g., success or error messages) on the client.
Add Advanced Features:

Implement user authentication to track data for individual users.
Use WebSockets for real-time updates (e.g., live timer synchronization).
Improve Error Handling:

Return detailed error messages to the client (e.g., why a file upload failed).
Log errors with timestamps for easier debugging.



PROMPT:

What would happen if i tried to store the tableBody in local storage and do json.stringify?

RESPONSE: 

If you try to use JSON.stringify(tableBody) to store the table body in localStorage, it will not work as expected because tableBody is a DOM element, and JSON.stringify cannot serialize DOM elements. Instead, it will throw an error like:

This happens because DOM elements have circular references (e.g., parent-child relationships), which JSON.stringify cannot handle.

Why This Happens:

The tableBody is a DOM element, not plain data. It contains references to other DOM nodes (like rows and cells), which cannot be converted into a JSON string.
JSON.stringify is designed to work with plain JavaScript objects, arrays, and primitives (e.g., strings, numbers, booleans), not DOM elements.



PROMPT:

when i submit something to server and it is in json, how do i insert that to the sqlite database? i am new to this

RESPONSE:

Steps to Insert JSON Data into SQLite
1. Parse the JSON Data
When you receive JSON data from the client, parse it into a JavaScript object.

2. Use INSERT INTO SQL Statement
Use an INSERT INTO statement to insert the data into the appropriate table. You can use placeholders (?) to safely insert values and prevent SQL injection.

3. Use database.run for Insertion
The sqlite3 library provides the run method to execute SQL statements with parameters.


RESOURCES TO HELP ME WITH DATABASE:

https://www.sqlitetutorial.net/sqlite-nodejs/query/

https://stackoverflow.com/questions/67822346/how-can-i-extract-data-from-sqlite-in-a-server-page-and-use-the-data-in-a-diffe

https://stackoverflow.com/questions/57429788/nodejs-sqlite3-query-returns-empty-trouble-understanding-async

