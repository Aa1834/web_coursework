let count = 0;
let timerInterval;
let elapsedTime = 0;
let currentTime = new Date().toLocaleString();
let isRunning = false;

function init(){
    const savedCount = localStorage.getItem('marshalCount');
    if (savedCount){
        count = parseInt(savedCount,10);
    }
    updateCounter();
}

function addCount() {
    count += 1;
    localStorage.setItem('marshalCount',count);
    updateCounter();
}

function deductCount(){
    if (count >0){
        count -=1;
        localStorage.setItem('marshalCount',count);
        updateCounter();
    }
}

function updateCounter(){
    const countDisplay = document.querySelector('#count-display');
    countDisplay.textContent = `Count: ${count}`;
}

async function startTimer() {
    if (!isRunning) {
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(updateTimerDisplay, 10);
        isRunning = true;
        console.log('Timer is starting again');
    }
}

function resetTimer() {
    isRunning = false;
    clearInterval(timerInterval);
    elapsedTime = 0;
    updateTimerDisplay();
    console.log('Timer reset');
} 

function stopTimer() {
    if (!isRunning) return;
    isRunning = false;
    clearInterval(timerInterval);
    elapsedTime = Date.now() - startTime; // Save elapsed time
    console.log('Timer stopped');
}

function updateTime() {
    const onGoing = Date.now();
    elapsedTime = onGoing - startTime;
  
    const hours = Math.floor(elapsedTime / (1000 * 60 * 60));
    const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
    const seconds = Math.floor((elapsedTime / 1000) % 60);
    const milliseconds = Math.floor((elapsedTime % 1000) / 10);
  
    const display = document.querySelector('#timer-display');
}  

function updateTimerDisplay() {
    const timerDisplay = document.querySelector('#display-timer');
    const currentTime = isRunning ? Date.now() : startTime + elapsedTime;
    const timeElapsed = currentTime - startTime;

    const hours = Math.floor(timeElapsed / (1000 * 60 * 60));
    const minutes = Math.floor((timeElapsed / (1000 * 60)) % 60);
    const seconds = Math.floor((timeElapsed / 1000) % 60);
    const milliseconds = Math.floor((timeElapsed % 1000) / 10);

    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${milliseconds
        .toString()
        .padStart(2, '0')}`;

    timerDisplay.textContent = formattedTime;
}

/*function handleCheckpointSubmit(event) {
    event.preventDefault(); // Prevent form from refreshing the page
    const checkpointInput = document.querySelector('#checkpointName');
    const checkpoint = checkpointInput.value.trim();

    if (checkpoint) {
        localStorage.setItem('checkpointName', checkpoint); // Save checkpoint to localStorage
        updateCheckpointDisplay(checkpoint); // Update the display
        checkpointInput.value = ''; // Clear the input field
    } else {
        alert('Please enter a valid checkpoint.');
    }
} */

async function postCount() {
    const checkpointInput = document.querySelector('#checkpointName');
    const checkpoint = checkpointInput.value.trim();
    //const checkpoint = localStorage.getItem('checkpointName');


    const timerDisplay = document.querySelector('#display-timer');
    const formattedTime = timerDisplay.textContent;

    if (!checkpoint){
        alert('Please enter a checkpoint before submitting');
        return;
    }
    try {
        const response = await fetch('/post-count', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ count, checkpoint, time: formattedTime }),
        });
        if (response.ok) {
            console.log('Count and checkpoint successfully posted to the server.');
        } else {
            console.error('Failed to post count to the server:', response.statusText);
        }
    } catch (error) {
        console.error('Error posting count:', error);
    }
}

init();

const counterButton = document.querySelector('#counter');
counterButton.addEventListener('click', addCount);

const decreaseButton = document.querySelector('#decreaseCount');
decreaseButton.addEventListener('click', deductCount);

const postButton = document.querySelector('#postResults');
postButton.addEventListener('click',postCount);

//const checkpointForm = document.querySelector('#checkpoint-form');
//checkpointForm.addEventListener('submit',handleCheckpointSubmit);

const startTimerButton = document.querySelector('#start-timer');
startTimerButton.addEventListener('click',startTimer);

const pauseTimerButton = document.querySelector('#end-timer');
pauseTimerButton.addEventListener('click',stopTimer);

const resetTimerButton = document.querySelector('#reset-timer');
resetTimerButton.addEventListener('click',resetTimer);
