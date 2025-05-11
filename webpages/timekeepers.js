const adminForTimes = document.querySelector('#timekeep-times'); // admin who is to record time button
adminForTimes.addEventListener('click', showDialog);


const okButton = document.querySelector('#ok'); // TIMEKEEPER OK BUTTON
okButton.addEventListener('click',saveTimekeeperDetails);

const closing = document.querySelector('#close'); // TIMEKEEPER CLOSE BUTTON
closing.addEventListener('click',closeDialog);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const adminForIds = document.querySelector('#timekeep-ids'); // admin who is to record the racer ids of each racer at finish line
adminForIds.addEventListener('click',displayDialog);

const submitButton = document.querySelector('#submit-details');
submitButton.addEventListener('click',saveIDkeeperDetails);

const closeButton = document.querySelector('#close-dialog');
closeButton.addEventListener('click',dialogClose);

//const raceIdsButton = document.querySelector('#timekeep-ids');
//const timeButton = document.querySelector('#timekeep-time');
const timekeeperForm = document.querySelector('#timekeeper-form');
const timekeeperIDs = document.querySelector('#ids');
const timekeeperName = document.querySelector('#name');



function saveTimekeeperDetails(){
    const name = document.querySelector('#nameTxt').value.trim();
    const id = document.querySelector('#idTxt').value.trim();
    const job = document.querySelector('#jobTxt').value.trim();

    if (!name || !id || !job){
        alert('Please fill in all the details. Required!!!');
        return;
    }

    const timekeeperDetails = { name, id, job};
    localStorage.setItem('timekeeperDetails',JSON.stringify(timekeeperDetails))
    console.log(localStorage.getItem('timekeeperDetails'));
    window.location.href = 'main.html';
}

function saveIDkeeperDetails(){
    const name = document.querySelector('#txtName').value.trim();
    const id = document.querySelector('#txtID').value.trim();
    const role = document.querySelector('#txtRole').value.trim();

    if (!name || !id || !role){
        alert('Please fill in all of the details. Required!!!');
        return;
    }

    const racerIdkeeperDetails = {name,id,role};
    localStorage.setItem('racerIdkeeperDetails',JSON.stringify(racerIdkeeperDetails));
    console.log(localStorage.getItem(racerIdkeeperDetails));
    window.location.href = 'racerIDNoters.html';
}


function showDialog(){
    const timekeeperForm = document.querySelector('#dialog');
    timekeeperForm.showModal();
}

function displayDialog(){
    const idkeeperForm = document.querySelector('#dialog-2');
    idkeeperForm.showModal();
}


function closeDialog(){
    const timekeeperForm = document.querySelector('#dialog');
    timekeeperForm.close()
}

function dialogClose(){
    const idkeeperForm = document.querySelector('#dialog-2');
    idkeeperForm.close();
}

