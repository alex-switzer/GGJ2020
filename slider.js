var WPMSlider;
var WPMLabel;

//Upper limit WPM score of each category
const NOOB = 10;
const BEGINNER = 25;
const AVERAGE = 40;
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
    //Update the wpm value
    selectedWPM = WPMSlider.value;
    WPMLabel.innerText = selectedWPM + " WPM" + "\xa0";

    //Show the user what level they are typing at
    if(selectedWPM <= NOOB) {
        WPMLabel.innerText += "(Noob)";
    }
    else if(selectedWPM <= BEGINNER) {
        WPMLabel.innerText += "(Beginner)";
    }
    else if(selectedWPM <= AVERAGE) {
        WPMLabel.innerText += "(Average)";
    }
    else if(selectedWPM <= GOOD) {
        WPMLabel.innerText += "(Good)";
    }
    else if(selectedWPM <= SKILLED) {
        WPMLabel.innerText += "(Skilled)";
    }
    else if(selectedWPM <= PRO) {
        WPMLabel.innerText += "(Pro)";
    }
    else if(selectedWPM <= GOD) {
        WPMLabel.innerText += "(God)";
    }
    else if(selectedWPM <= GOD2) {
        WPMLabel.innerText += "(God 2.0)";
    }
    else{ //either they are 'arenasnow' or they are memeing
        WPMLabel.innerText += "(Hahaha good luck!)";
    }
}