'use strict';
let initialTime = null;
let position = 0; // originally the position is set to 0
let pos = 0;
let startTime = 0;
let elapsedTime = 0;
let isRunning = false;
let timerInterval;
let counter = 0;
let dataToServerIDs = [];

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

const addRows = document.querySelector('#table-racerID');
addRows.addEventListener('click',matchingRacerIDs);

window.addEventListener('online', checkOnline);

window.addEventListener('offline', checkOffline);

const showButton = document.getElementById('showDialog');
const favDialog = document.getElementById('favDialog');
const confirmBtn = favDialog.querySelector('#confirmBtn');

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


document.addEventListener("DOMContentLoaded", function() {
  renderTableIds();
});

const postButton = document.querySelector('#post-results');
postButton.addEventListener('click',postRacerIds);


function renderTableIds(){
  let tableLocalData = JSON.parse(localStorage.getItem('dataToServerIDs'));
  if (tableLocalData != null){
    dataToServerIDs = tableLocalData;
    for (let i=0; i<localStorage.length;i++){
      createTableGridIDs([tableLocalData[i]]);
    }
  }
}

/*async function getDifference() {
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

  } else {
    initialTime = currentTime;
    position = 0; // position is 0 when the timer is first started
    console.log('Timer started');
  }
} */

function matchingRacerIDs(){
  pos += 1;
  let tableDataIDs = [];
  tableDataIDs.push({pos: pos, racerId: ''});
  createTableGridIDs(tableDataIDs);
  localStorage.setItem('dataToServerIDs',JSON.stringify(dataToServerIDs));
  console.log('dataToServerIDs',JSON.stringify(dataToServerIDs));
}

function checkOnline() {
  console.log('You are online');
  uploadData();
}

function checkOffline() {
  console.log('You are offline');
}


async function postRacerIds(){ // FUNCTION TO POST THE TABLE DATA: RACER IDS AND POSITIONS TO SERVER
  const tableRaceId = JSON.parse(localStorage.getItem('dataToServerIDs'));
 // tableRaceId['idkeeperdetails'] =  JSON.parse(localStorage.getItem('racerIdkeeperDetails'));
  let newJSON={};
  newJSON['values'] = tableRaceId;
  newJSON['adminDetails']= JSON.parse(localStorage.getItem('racerIdkeeperDetails'));
  console.log(JSON.stringify(newJSON));

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
      body: JSON.stringify(newJSON),
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
}


function clearStorage() { // Clearing local storage
  console.log('clicked');
  localStorage.clear();
  console.log('CLEARED');
}


function createTableGridIDs(runnerData){ // TABLE 2
  if (!runnerData || runnerData.length === 0){
    console.log("Empty runnerData");
    return;
  }

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
  inputField.value = row.racerId;
  
  inputField.addEventListener('input',(event)=> {
    row.racerId = event.target.value;
    const index = dataToServerIDs.findIndex((entry) => entry.pos === row.pos);
    
    if (index !== -1){
      dataToServerIDs[index].racerId = row.racerId;
    }
    else{
      dataToServerIDs.push({ pos: row.pos, racerId: row.racerId});
    }
    localStorage.setItem('dataToServerIDs',JSON.stringify(dataToServerIDs));
    console.log('dataToServerIDs updated',dataToServerIDs);
  });
  

  idCell.appendChild(inputField);
  tr.appendChild(idCell);

  bodyTable.appendChild(tr);

}


