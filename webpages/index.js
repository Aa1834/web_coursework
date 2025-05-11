'use strict';
let initialTime = null;
let position = 0; // originally the position is set to 0
let pos = 0;
let startTime = 0;
let elapsedTime = 0;
let isRunning = false;
let timerInterval;
let counter = 0;
let dataToServer=[]; // array to store the race time table data 

//let dataToServerIDs = [];

let serverName = 'http://localhost:8080';
const sName = document.getElementById('serverName');

sName.value = serverName;

function clickEvent() {
  if (sName.value !== 'http://localhost:8080') {
    serverName = sName.value;
  }
}

///// Event listeners are below for each button etc: 

const confirmButton = document.querySelector('#confirmBtn');
confirmButton.addEventListener('click', clickEvent);

const button = document.querySelector('#my-button'); // start timer button: "button"
// button.addEventListener('click', displayTime);
button.addEventListener('click', startTimer);

//const addRows = document.querySelector('#table-racerID'); // RACER ID TABLE ADD MORE ROW BUTTON (REMOVE THIS LATER)
//addRows.addEventListener('click',matchingRacerIDs);

const stopButton = document.querySelector('#stop-timer');
stopButton.addEventListener('click', stopTimer);

const clearButton = document.querySelector('#clear-results');
clearButton.addEventListener('click', resetTimer); // reset button

clearButton.addEventListener('click', clearStorage);

window.addEventListener('online', checkOnline);

window.addEventListener('offline', checkOffline);

const marshalButton = document.querySelector('#marshals-button'); /// CHANGE STARTED HERE: MARSHAL FEATURE BUTTON
marshalButton.addEventListener('click', marshalTimer);

const showButton = document.getElementById('showDialog');
const favDialog = document.getElementById('favDialog');
const confirmBtn = favDialog.querySelector('#confirmBtn');

//on page load/refresh, render the existing data
document.addEventListener("DOMContentLoaded", function() {
  renderTable();
});
// "Show the dialog" button opens the <dialog> modally
showButton.addEventListener('click', () => {
  favDialog.showModal();
});

// "Cancel" button closes the dialog without submitting because of [formmethod="dialog"], triggering a close event.
favDialog.addEventListener('close', (e) => {
});

// Prevent the "confirm" button from the default behavior of submitting the form, and close the dialog with the `close()` method, which triggers the "close" event.
confirmBtn.addEventListener('click', (event) => {
  event.preventDefault(); // We don't want to submit this fake form
  favDialog.close(); // Have to send the select box value here.
});

const postButton = document.querySelector('#post-results');
postButton.addEventListener('click',postResults);
//postButton.addEventListener('click',postRacerIds);

function renderTable(){
  let localData= JSON.parse(localStorage.getItem('dataToServer'));
  if(localData!=null) //localStorage exists
  {
    for(let i=0; i<localData.length;i++)
    {
      createTableGridTime(localData[i]);
    }
  }

}

function updateTime() {
  const onGoing = Date.now();
  elapsedTime = onGoing - startTime;

  const hours = Math.floor(elapsedTime / (1000 * 60 * 60));
  const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
  const seconds = Math.floor((elapsedTime / 1000) % 60);
  const milliseconds = Math.floor((elapsedTime % 1000) / 10);

  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${milliseconds
    .toString()
    .padStart(2, '0')}`;

  const display = document.querySelector('#timer-display');
  display.textContent = formattedTime; 
}

async function serverPost(endpoint, dataUpload) {
  const baseURL = serverName;
  const serverURL = baseURL + endpoint;
  try {
    const response = await fetch(serverURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(dataUpload),
    });
    const responseData = await response.json();
    console.log('Server response', responseData);
    return responseData;
  } catch (error) {
    console.error('Error during fetch:', error);
  }
}

function saveTimeToServer() {
  // saveStartTime = updateTime.onGoing
  console.log('Timer state requested');
  const saveStartTime = elapsedTime;
  serverPost('/marshals', saveStartTime);
}


async function getDifference() {
  if (!isRunning) {
    console.log('The timer has stopped');
    return;
  }
  const currentTime = new Date();
  if (initialTime !== null) {
    position += 1; // updating position for each click
    const timeDifference = (currentTime - initialTime);
    console.log(`Position ${position}: time ${timeDifference} milliseconds`);

    const onGoing = Date.now();
    elapsedTime = onGoing - startTime;
  
    const hours = Math.floor(elapsedTime / (1000 * 60 * 60));
    const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
    const seconds = Math.floor((elapsedTime / 1000) % 60);
    const milliseconds = Math.floor((elapsedTime % 1000) / 10);
  
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${milliseconds
      .toString()
      .padStart(2, '0')}`;

    let dateRightNow= new Date();
    let dateString = dateRightNow.toLocaleString('en-GB');

    let tableData=[]; // For the table containing the time of each racer and position
   
    tableData.push({ position: position, time: formattedTime, dateTime: dateString });
    createTableGridTime(tableData);

    dataToServer.push(tableData);
    localStorage.setItem('dataToServer',JSON.stringify(dataToServer));
    console.log(localStorage.getItem('dataToServer'));

    /*let tableDataIDs = []; // For the table containing the position and ID of each racer.
    tableDataIDs.push({ position: position, racerId: ''});
    createTableGridIDs(tableDataIDs);

    dataToServerIDs.push({position: position, racerId: ''});
    localStorage.setItem('dataToServerIDs', JSON.stringify(dataToServerIDs));
    console.log('dataToServerIDs',JSON.stringify(dataToServerIDs)); */


    console.log(JSON.stringify(dataToServer));
   

  } else {
    initialTime = currentTime;
    position = 0; // position is 0 when the timer is first started
    console.log('Timer started');
  }
}

/*function matchingRacerIDs(){
  pos += 1;
  let tableDataIDs = [];
  tableDataIDs.push({pos: pos, racerId: ''});
  createTableGridIDs(tableDataIDs);
  localStorage.setItem('dataToServerIDs',JSON.stringify(dataToServerIDs));
  console.log('dataToServerIDs',JSON.stringify(dataToServerIDs));
} */

async function startTimer() {
  if (!isRunning) {
    let startbutton = document.querySelector('#my-button'); 
    startbutton.value = "Record Time";
    startTime = Date.now() - elapsedTime;
    // initialTime = null;
    // timerRunning = true;
    timerInterval = setInterval(updateTime, 10);
    isRunning = true;
    console.log('Timer is starting again');
  }
  // await serverPost('/startTimer',{startTime: Date.now()});
  getDifference();
  //matchingRacerIDs();
}

function checkOnline() {
  console.log('You are online');
  uploadData();
}

function checkOffline() {
  console.log('You are offline');
}


async function postResults(){ // FUNCTION TO POST THE TABLE DATA FOR THE RECORDED TIME OF EACH RACER AND THEIR POSITION
  const tableRaceData = JSON.parse(localStorage.getItem('dataToServer'));

  let resultJSON = {}
  resultJSON['values'] = tableRaceData;
  resultJSON['adminDetails'] = JSON.parse(localStorage.getItem('timekeeperDetails'));
  console.log(JSON.stringify(resultJSON));

  if (tableRaceData.length === 0) {
    console.log("The dataToServer array is empty. There is nothing to send to the server.");
    return;
  }

  try {
    const response = await fetch('/post-results', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resultJSON), 
    });

    if (response.ok) {
      console.log("The table data has successfully been posted to the server.");
      //localStorage.removeItem('dataToServer');
    }
    else {
      console.error("Failed to send the table data to the server"); 
    }
  } catch (error) {
    console.error("Error posting data to the server:", error);
  }
}

/*async function postRacerIds(){ // FUNCTION TO POST THE TABLE DATA: RACER IDS AND POSITIONS TO SERVER
  const tableRaceId = JSON.parse(localStorage.getItem('dataToServerIDs'));

  if (tableRaceId.length === 0){
    console.log("The dataToServerIDs array is empty. There is nothing to send to the server.")
    return;
  }

  try{
    const response = await fetch('/post-ids',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tableRaceId),
    });
    if (response.ok){
      console.log("The table data has successfully been posted to the server");
      localStorage.removeItem('dataToServer');
    }
    else{
      console.log('Failed to send the table data to the server:',error.statusText);
    }
  }
  catch(error){
    console.error("Error posting data to server",error);
  }
} */


function stopTimer() {
  position = 0;
  console.log('Stopped timer');
  if (isRunning) {
    clearInterval(timerInterval);
    elapsedTime = Date.now() - startTime;
    isRunning = false;
  }
}

function resetTimer() {
  position = 0;
  // timerRunning = false;
  console.log('Timer has been reset.');
  clearInterval(timerInterval);
  startTime = 0;
  elapsedTime = 0;
  isRunning = false;
  const display = document.querySelector('#timer-display');
  display.textContent = '00:00:00:00';
}

function clearStorage() { // Clearing local storage
  console.log('clicked');
  localStorage.clear();
  console.log('CLEARED');
}

function marshalTimer() {
  if (!isRunning) {
    console.log('Timer is not running. Cannot record time.');
    return;
  }

  counter += 1; 
  
  const onGoing = Date.now();
  const elapsedTimeForRacer = onGoing - startTime;
  const longDate = new Date(onGoing).toLocaleString();


  const hours = Math.floor(elapsedTimeForRacer / (1000 * 60 * 60));
  const minutes = Math.floor((elapsedTimeForRacer / (1000 * 60)) % 60);
  const seconds = Math.floor((elapsedTimeForRacer / 1000) % 60);
  const milliseconds = Math.floor((elapsedTimeForRacer % 1000) / 10);

  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${milliseconds
      .toString()
      .padStart(2, '0')}`;

  // Save the formatted time to local storage
  localStorage.setItem(`Racer ${counter}`, JSON.stringify({ formattedTime, date: longDate }));

  console.log(`NO. OF RACERS PASSED: ${counter}`);
  console.log(`Time for Racer ${counter}: ${formattedTime}`);
  console.log(`Data for Racer ${counter}: ${longDate}`);

}


/// ////////////////////////////

/*function saveTimes(){ // save the position and race times recorded in table cells in local storage before
  const tableBody = document.querySelector('#results-body');
  const rows = tableBody.querySelectorAll('tr');

  let updatedTableData = [];

  for (let i = 0; i<rows.length; i++){
    row = rows[i];
    
    position = rows.children[0].values
    times = rows.children[1].values   


  }
} */


function createTableGridTime(data) { // TABLE 1
  const tableHead = document.querySelector('#results-head'); // Table head element
  const tableBody = document.querySelector('#results-body'); // Table body element

  
  const headerRow = document.createElement('tr');

    const row = data[0];
    const tr = document.createElement('tr');
  
    const positionCell = document.createElement('td');
    const timeBox = document.createElement('input');
    timeBox.type = 'text';
    timeBox.value= row.time;


    positionCell.textContent = row.position;
    tr.appendChild(positionCell);

   
    //const timeCell = document.createElement('td');
    //timeCell.textContent = row.time; 
    //tr.appendChild(timeCell);
    tr.appendChild(timeBox);

   
    const dateTimeCell = document.createElement('td');
    dateTimeCell.textContent = row.dateTime; 
    tr.appendChild(dateTimeCell);

    tableBody.appendChild(tr);

}

/*function createTableGridIDs(runnerData){ // TABLE 2
  const headerTable = document.querySelector('#id-head');
  const bodyTable = document.querySelector('#id-body');

  const row = runnerData[0]

  const tr = document.createElement('tr');

  const positionalCell = document.createElement('td');

  positionalCell.textContent = row.pos;
  tr.appendChild(positionalCell);

  const idCell = document.createElement('td');
  //dataTimeCell.textContent = row.IdCell;

  const inputField = document.createElement('input');
  inputField.type = 'int';
  inputField.placeholder = 'Enter Racer ID';

  //if (inputField.value == null ){
    //inputField.value = '';
  //}
  inputField.addEventListener('change', (event) => {
    if (event.target.value.trim() === '') {
      inputField.value = ''; 
    }
    row.racerId = inputField.value;
    console.log(`Updated Racer ID for Position ${row.pos}: ${row.racerId}`);

    console.log(localStorage.getItem('dataToServerIDs'));

    let dataToServerIDs = JSON.parse(localStorage.getItem('dataToServerIDs'));

    const index = dataToServerIDs.findIndex((entry) => entry.pos === row.pos);

    if (index !== -1){
      dataToServerIDs[index].racerId = row.racerId;
    }
    else{
      dataToServerIDs.push({pos: row.pos, racerId: row.racerId});
    }

    localStorage.setItem('dataToServerIDs',JSON.stringify(dataToServerIDs));
    console.log('dataToServerIDs updated:', dataToServerIDs);
  });



  idCell.appendChild(inputField);
  tr.appendChild(idCell);

  bodyTable.appendChild(tr);

} */
