let countDown;
const timerDisplay = document.querySelector('.display__time-left');
const endTimeDisplay = document.querySelector('.display__end-time');
const buttons = document.querySelectorAll('[data-time]');

function timer(seconds) {
    //clear any existing timer
    clearInterval(countDown);

    const now = Date.now();
    const then = now + (seconds * 1000); //convert to milliseconds
    displayTimeLeft(seconds);
    displayEndTime(then);

    countDown = setInterval(() => {
        const secondsLeft = Math.round((then - Date.now()) / 1000);

        if (secondsLeft < 0) {
            clearInterval(countDown); //if we dont clear will continue running!
            return;
        }

        displayTimeLeft(secondsLeft);

    }, 1000);
}


function displayTwoDigits(input) {
    return input > 10 ? input : "0" + input;
}

function displayTimeLeft(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    const display = `${displayTwoDigits(min)}:${displayTwoDigits(sec)}`;

    document.title = display;
    timerDisplay.textContent = display;
}

function displayEndTime(timestamp) {
    const end = new Date(timestamp);
    const hours = end.getHours();
    const minutes = end.getMinutes();
    const seconds = end.getSeconds();

    const hoursDisplay = hours > 12 ? hours-12 : hours;
    const amPmDisplay = hours > 12 ? "P.M." : "A.M.";

    endTimeDisplay.textContent = `Be back at ${hoursDisplay}:${displayTwoDigits(minutes)}:${displayTwoDigits(seconds)} ${amPmDisplay}`;
}

function startTimer() {
    const seconds = parseInt(this.dataset.time, 10);
    timer(seconds);
}

buttons.forEach(button=>button.addEventListener('click', startTimer));
document.customForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const mins = this.minutes.value; //value is in seconds
    timer(mins * 60);
    this.reset();
})