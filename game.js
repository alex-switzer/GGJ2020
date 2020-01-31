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
      //move to next word
      //add one for off by one
      currentWord += cursorCorrect + 1;
      //reset local cursor
      cursorCorrect = 0;
      //clear text box
      inputText.value = "";
      charactersCorrect++;

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
    //Get the WPM of the user and display it to them
    getEndTime();
    wpm = getWPM(startTimeInMs, endTimeInMs);

    accuracy = getAccuracy();
    
    //TODO: replace by placing it in UI instead
    alert("Finished. Your WPM (Words Per Minute) was " + wpm + ". Your accuracy was " + accuracy);



  }

  //print words
  gameTextTyped.innerText = wordsWrong.slice(0, currentWord + cursorCorrect);
  gameTextWrong.innerText = wordsWrong.slice(
    currentWord + cursorCorrect,
    currentWord + cursorCorrect + cursorWrong
  );
  gameText.innerText = wordsWrong.slice(currentWord + cursorCorrect + cursorWrong);
}

//misspell a word
function misspellString(input) {
  // 0 to 1
  percentWrong = 1;

  //split in to words
  tempList = input.split(" ");
  //make correct string
  wordsCorrect = tempList.join(" ");
  
  //pick words to misspell
  indexs = shuffle([...Array(tempList.length).keys()]);
  indexs = indexs.slice(0, indexs.length * percentWrong);
  indexs.forEach(index => {
    //TODO:get random number and call associated scrambling method
    tempList[index] = swapFrontAndBackLetters(tempList[index]);
  });

  //save misspell string
  wordsWrong = tempList.join(" ");
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

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

//do not call if it has 1 letter, as it cannot work
function swapFrontAndBackLetters(str) {
  if(str.length == 1) return; 
  //get index of start and end letter
  alteredString = str[str.length -1] + str.substring(1, str.length -1) + str[0]
  return alteredString;
}

function scrambleEntireWord(str) {
  //iterate through each letter of word, pick a random index to move the letter to a new string. update string 
  for(let letterIndex = 0; letterIndex < str.length -1; letterIndex++) {
    //generate random
      
  }

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