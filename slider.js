var WPMSlider;
var WPMLabel;

//Upper limit WPM score of each category
const NOOB = 10;
const BEGINNER = 25;
const AVERAGE = 45;
const GOOD = 60;
const SKILLED = 80;
const PRO = 105;
const GOD = 130;
const GOD2 = 155;

//on page load, display the default WPM speed in the label
window.addEventListener("load", loadPage);
function loadPage() { 
    //Get a handle on the html UI elements
    WPMSlider = document.getElementById("botWPMSlider");
    WPMLabel = document.getElementById("botTypingSpeed");

    ///Update the wpm value
    onSliderChange();
}

//Update the text as the user moves the slider thumb
window.addEventListener("input",onSliderChange);
function onSliderChange() {
    //Update the wpm value in the single player options area
    selectedBotWPM = WPMSlider.value;
    WPMLabel.innerText = selectedBotWPM + " WPM" + "\xa0";

    //Show the user what level they are typing at
    if(selectedBotWPM <= NOOB) {
        WPMLabel.innerText += "(Noob)";
    }
    else if(selectedBotWPM <= BEGINNER) {
        WPMLabel.innerText += "(Beginner)";
    }
    else if(selectedBotWPM <= AVERAGE) {
        WPMLabel.innerText += "(Average)";
    }
    else if(selectedBotWPM <= GOOD) {
        WPMLabel.innerText += "(Good)";
    }
    else if(selectedBotWPM <= SKILLED) {
        WPMLabel.innerText += "(Skilled)";
    }
    else if(selectedBotWPM <= PRO) {
        WPMLabel.innerText += "(Pro)";
    }
    else if(selectedBotWPM <= GOD) {
        WPMLabel.innerText += "(God)";
    }
    else if(selectedBotWPM <= GOD2) {
        WPMLabel.innerText += "(God 2.0)";
    }
    else{ //either they are 'arenasnow' or they are memeing
        WPMLabel.innerText += "(Hahaha good luck!)";
    }

    //Update the opponent header in "racer's progress" area if they are not in a multiplayer race
    var opponentHeading = document.getElementById("opponentHeading");
    if(opponentHeading.innerText != "\nHuman Opponent") {
        opponentHeading.innerText = "\nBOT" + "\xa0(" + selectedBotWPM + "\xa0WPM)";
    }
}