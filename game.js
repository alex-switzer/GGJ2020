//load the game when html is ready
window.addEventListener("load", loadPage);

//used to keep the correct string
wordsCorrect = "";
//used to keep the wrong string
wordsWrong = "";

//what word is complete
currentWord = 0;

//time object to calculate wpm
var d = new Date();

//Time/word count variables for WPM calculation
startTimeInMs = 0;
endTimeInMs = 0;
textWordCount = 0;

//correct/incorrect character account 
charactersCorrect = 0;
charactersIncorrect = 0;

//progress bar stuff
const PROGRESS_INCREMENT = 0.10; //10% per emoji update
const PROGRESS_EMOJI = "💦";
const FINISHED_EMOJI = "🏁";
successfulCharsTypedSinceLastUpdate = 0;
textLength = 0;
addedCompletionEmoji = false;

function loadPage() {
  //*
  //load texts
  fetch(window.location.href + "/texts.txt").then(function(response) {
    response.text().then(function(text) {
      //split by newlines
      list = text.split("\n");
      //pick random
      var rand = list[Math.floor(Math.random() * list.length)];

      //load picked file
      fetch(window.location.href + rand).then(function(response2) {
        response2.text().then(function(text2) {
          //Get the text length
          textLength = text2.length;

          //Get the number of words in the text for WPM calculation
          textWordCount = text2.split(' ').length;

          //make the string misspelled
          misspellString(text2);

          //add game hook
          var inputText = document.getElementById("inputText");
          inputText.addEventListener("input", keyPressed);
          
          gameText.innerText = wordsWrong;

        });
      });
    });
  });
  //*/

  /*
  //make the string misspelled
  input = "You must take life the way it comes at you and make the best of it";
  misspellString(input);

  //add game hook
  var inputText = document.getElementById("inputText");
  inputText.addEventListener("input", keyPressed);
  //fix looks
  keyPressed();

  //*/
}

function keyPressed() {
  getStartTime();
  //used to keep track of how meny letters are correct
  cursorCorrect = 0;
  //used to keep track of how meny letters are wrong
  cursorWrong = 0;
  //has a key been wrong so far
  hasMistype = false;

  //loop thought all input
  for (var i = 0; i < inputText.value.length; i++) {
    //When they press space after correctly typing the word
    if (
      inputText.value[i] == wordsCorrect[currentWord + i] &&
      inputText.value[i] == " " &&
      !hasMistype
    ) {
      successfulCharsTypedSinceLastUpdate += inputText.value.length;
      
      //move to next word
      //add one for off by one
      currentWord += cursorCorrect + 1;
      //reset local cursor
      cursorCorrect = 0;
      //clear text box
      inputText.value = "";
      charactersCorrect++;

      updateProgressBar(successfulCharsTypedSinceLastUpdate, textLength);

      //correct letter
    } else if ( //If it is a correct letter, but not a complete word
      inputText.value[i] == wordsCorrect[currentWord + i] &&
      !hasMistype
    ) {
      //move local cursor
      cursorCorrect++;
      charactersCorrect++;
      //wrong leater
    } else { //when user puts in a wrong letter
      //set had wrong leater
      hasMistype = true;
      //move red cursor
      cursorWrong++;
      charactersIncorrect++;
    }
  }

  //When the user has completed the text
  if (currentWord + cursorCorrect == wordsCorrect.length) {
    updateProgressBar();
    addedCompletionEmoji = true;

    //Get the WPM & Accuracy of the user and display it to them
    getEndTime();
    wpm = getWPM(startTimeInMs, endTimeInMs);
    accuracy = getAccuracy();
  
    //Update the UI elements in the web page
    var WPMText = document.getElementById("WPM");
    WPMText.innerText = "WPM: " + wpm.toString();

    var AccuracyText = document.getElementById("Accuracy");
    AccuracyText.innerText = "Accuracy: " + accuracy + "%";
  }

  //print words
  gameTextTyped.innerText = wordsWrong.slice(0, currentWord + cursorCorrect);
  gameTextWrong.innerText = wordsWrong.slice(
    currentWord + cursorCorrect,
    currentWord + cursorCorrect + cursorWrong
  );
  gameText.innerText = wordsWrong.slice(currentWord + cursorCorrect + cursorWrong);
}

function updateProgressBar(inputSuccessfulCharsTypedSinceLastUpdate, charactersTotal) {
  console.log("testing for progress")
  console.log("charactersTypedSinceUpdate = " + inputSuccessfulCharsTypedSinceLastUpdate);
  console.log("charactersTotal = " + charactersTotal); //is the length of the text?
  console.log("charactersCorrect" + charactersCorrect);

  //When they make 10% closer to the goal and have not finished
  percentCompletedSinceLastUpdate = (inputSuccessfulCharsTypedSinceLastUpdate  / charactersTotal);
  if (percentCompletedSinceLastUpdate >= PROGRESS_INCREMENT && charactersCorrect != charactersTotal) {
    var playerProgressBar = document.getElementById("playerProgressBar");
    playerProgressBar.innerText += PROGRESS_EMOJI;
    console.log("Updated progress bar!");

    //rollover the excess progress to next time
    rolloverPercentageComplete = percentCompletedSinceLastUpdate - 0.100;
    successfulCharsTypedSinceLastUpdate = rolloverPercentageComplete*textLength;

    console.log("rollover percentage is" + rolloverPercentageComplete);
    console.log("rollover successfulCharsTypedSinceLastUpdate is " + successfulCharsTypedSinceLastUpdate);
  }

  //when they finish, add an emooji if it isn't already there
  else if (currentWord + cursorCorrect == wordsCorrect.length & addedCompletionEmoji == false) {
    var playerProgressBar = document.getElementById("playerProgressBar");
    playerProgressBar.innerText += FINISHED_EMOJI; 
    
  }
}

//misspell a word
function misspellString(input) {
  //0.1 = 10%, etc
  percentWrong = 0.5;

  //split in to words
  tempList = input.split(" ");
  //make correct string
  wordsCorrect = tempList.join(" ");
  
  //pick words to misspell
  indexs = shuffleArray([...Array(tempList.length).keys()]);
  indexs = indexs.slice(0, indexs.length * percentWrong);
  indexs.forEach(index => {
    if(tempList[index].length != 0) //Only attempt to alter words that are more than 1 letter 
    switch(Math.floor(Math.random() * 3)) {
      case 0: //Scramble the entire word
        tempList[index] = scrambleEntireWord(tempList[index]);
        break;
      case 1: //Swap a few random letters
        tempList[index] = swapRandomLetters(tempList[index]);
        break;
      case 2: //swap front and back letters
        tempList[index] = swapFrontAndBackLetters(tempList[index]);
        break;
    }    
  });

  //save misspell string
  wordsWrong = tempList.join(" ");
}

function shuffleArray(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function swapRandomLetters(str) {
  swap = Math.floor(Math.random() * Math.floor(str.length - 1));
  return (
    str.substring(0, swap) +
    str[swap + 1] +
    str[swap] +
    str.substring(swap + 2)
  );
}

//It will return strings with one letter
function swapFrontAndBackLetters(str) {
  if(str.length == 1) return str;
  //get index of start and end letter
  alteredString = str[str.length -1] + str.substring(1, str.length -1) + str[0]
  return alteredString;
}

function scrambleEntireWord(str) {
  originalStrLength = str.length;
  scrambledWord = "";

  //iterate through each letter of word, pick a random index to move the letter to a new string. update string 
  for(let letterIndex = 0; letterIndex < originalStrLength; letterIndex++) {
    randomIndex = Math.floor(Math.random() * str.length); //generate random
    scrambledWord += str[randomIndex]; 

    //remove the letter from the original word
    str = str.substring(0, randomIndex) + str.substring(randomIndex + 1, str.length);    
  }

  return scrambledWord;
}

//Get accuracy
function getAccuracy() {
  //get accuracy as a percentage
  accuracy = (charactersCorrect / (charactersCorrect + charactersIncorrect))*100;
  
  //return a rounded number
  return Math.floor((accuracy + Number.EPSILON) * 100) / 100
}

  //start the timer if it wasn't already
  function getStartTime() {
    if(startTimeInMs == 0) {
      startTimeInMs = d.getTime(); //Get time in Ms from 1970 
    }
  }

  function getEndTime() {
    d = new Date();
    endTimeInMs = d.getTime();
  }

  //Calculate and return the WPM that the user typed at
  function getWPM(startTime, endTime) {
    raceTimeInMinutes = ((endTimeInMs- startTimeInMs)/1000)/60;
    WPM = textWordCount/raceTimeInMinutes;

    return Math.floor((WPM + Number.EPSILON) * 100) / 100 //round excess decimal points
  } 