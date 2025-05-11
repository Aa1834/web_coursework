
import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import sqlite3 from "sqlite3";


const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname, 'webpages'))); // serving files in webpages directory
app.use(express.json());
///////////////////////////////////////////////////////////////////////////////////////////////

const database = new sqlite3.Database("webpages/raceTimer.db",sqlite3.OPEN_READWRITE, (error) => {
    if (error){
        return console.error(error.message);
    }
    console.log("Connected to racerTimer database")
});
////////////////////////////////////////////////////////////////////////////////////////////
app.get('*', (req, res) => {
  //console.log(req.sessionID);
  console.log('SERVER DEBUG:' + __dirname);
  if (req.url === '/manifest.json') { // Making sure that the content type for the manifest.json is not text/html. Last time it was text/html.
    res.setHeader('Content-Type', 'application/json');
    res.sendFile(path.join(__dirname, '/', 'manifest.json'));
  } else if (req.url === '/webpages/marshals.html') {
    res.sendFile(path.join(__dirname, '/', 'marshals.html'));
  }
  if (req.url === '/timerState') {
    res.setHeader('Content-Type', 'application/json');
    res.json(timerState);
  } 
  else if(req.url==='/display-final-results'){
      //res.setHeader('Content-Type', 'application/json');
      console.log('GET DISPLAY RESULT');
      const selectQuery = 'SELECT RaceTime.positions, RaceNumbers.racer_id, RaceTime.race_time FROM RaceNumbers JOIN RaceTime ON RaceNumbers.position = RaceTime.positions;'
      database.all(selectQuery, (error, rows) => {
        res.json(rows);
      });
  }
  else {
    console.log('NAVIGATING TO START');
    res.sendFile(path.join(__dirname, 'webpages', 'index.html'));
  }
});



/*app.post('/', (req, res) => {
  console.log(req.sessionID); // outputting the sessionID for each user.
  console.log('SERVER POST ** :' + JSON.stringify(req.body));

}); */

function marshalPost(req, res) {
  const saveStartTime = req.body;
  console.log('Data received from client:', saveStartTime);

  res.json({ message: 'Data received successfully', receivedData: saveStartTime });
}

app.post('/marshals', marshalPost);

function syncStartTimer(req,res){ // for: /timerState
  if(!timerState.isRunning){
    timerState.startTime = Date.now();
    timerState.isRunning = true;
    console.log('Timer started at:', timerState.startTime);
    res.json({message: 'timer started', timerState});
  }
  else{
    res.json({message:'Timer is already running',timerState});
  }
}

const timerState = {
  startTime: null,
  isRunning: false,
};

app.get('/timerState', (req, res) => {
  res.json({
    startTime: timerState.startTime,
    isRunning: timerState.isRunning,
  });
});

/*function starting (req, res) {
  const { startTime } = req.body;
  console.log(`Timer started at:${startTime}`);
  res.json({ message: 'Timer started successfully', startTime });
} */

app.post('/startTimer', (req, res) => {
  const { startTime } = req.body;
  console.log(`12 Timer started: ${startTime}`);
  const rightNow = startTime - Date.now();
  res.json({ message: 'Timer  successfully', rightNow });
});

/*app.post('/post-results', (req, res) => {
  console.log(req.body);
  const dataReceived = req.body;
  console.log(`Data received at Server: ${JSON.stringify(dataReceived)}`);
  res.json({message:"Data Received"});
}); */

app.post('/post-results',(req,res) =>{
  console.log('****** POST IDS');
  console.log(req.body);
  const dataReceived = JSON.parse(JSON.stringify(req.body));
  console.log(`Data received at server: ${(dataReceived)}`);

  console.log(`VALUES: ${JSON.stringify((dataReceived.values))}`);

  console.log(`Admin DATA: ${(dataReceived.adminDetails.id)}`);
  res.json({message:"Results data received"});
  insertRacerTimes(dataReceived);
});

app.post('/post-ids',(req,res) =>{
  const receivedData = JSON.parse(JSON.stringify(req.body));
  res.json({message:"Racer IDs data received"});
  insertRacerNumbers(receivedData);
});

//app.get('/display-final-results',getFinalRaceResults);
/*
function getFinalRaceResults(req,res){
  const selectQuery = `SELECT RaceNumbers.racer_id, RaceTime.race_time FROM RaceNumbers JOIN RaceTime ON RaceNumbers.position = RaceTime.positions;`
  const results = database.all(selectQuery);
  console.log(results);
  res.json(results);
}*/



export async function insertRacerNumbers(racerDataID){
   let values = racerDataID.values 
   let adminValues = racerDataID.adminDetails
   let insertQuery='INSERT INTO RaceNumbers (admin_id, admin_name,admin_role,position,racer_id) values ';
   for (let i = 0; i<values.length; i++){

    insertQuery+='('+adminValues.id + ',';
    insertQuery+='"'+adminValues.name +'",';
    insertQuery+='"' + adminValues.role+'",';
    insertQuery+=values[i].pos+',';
    insertQuery+=values[i].racerId+')';
    if(i<(values.length-1))
      insertQuery+=',';

   }
  console.log(insertQuery);
  await executeQuery(database, insertQuery);
} 

async function insertRacerTimes(racerDataTimes){
 // console.log("HERE TEST:")
 //  console.log(JSON.stringify(racerDataTimes.values[0][0]));
 // console.log(racerDataTimes.values[0][0].position);
 //  console.log(racerDataTimes.values[0][0].time);
  let values = racerDataTimes.values;
  let adminValues = racerDataTimes.adminDetails;
  let insertQuery = 'INSERT INTO RaceTime (admin_id, admin_name, admin_role, positions,race_time) values ';

  for (let j = 0; j<values.length; j++){
    console.log("HERE TEST: " + j)
     console.log(racerDataTimes.values[j][0].position);
    insertQuery+='('+adminValues.id + ',';
    insertQuery+='"'+adminValues.name +'",';
    insertQuery+='"' + adminValues.job+'",';
    insertQuery+= '"' + racerDataTimes.values[j][0].position+'",';
    insertQuery+= '"' + racerDataTimes.values[j][0].time+'")'; 

    if (j<(values.length-1)){
      insertQuery += ',';
    }
  }
  console.log(insertQuery);
  await executeQuery(database,insertQuery);
}

app.post('/post-count',(req,res) => {
  const { count, checkpoint, time } = req.body;
  console.log(`Received couunt: ${count} Checkppooint: ${checkpoint}, time ${time}`);

  res.status(200).send('Count received successfullly');
});

async function executeQuery(database,sql){
    return new Promise((resolve,reject)=>{
        database.run(sql,(error) => {
            if (error){
                reject (error);
            }
            resolve("successfully executed query");
        });
    });
}




app.listen(8080);
