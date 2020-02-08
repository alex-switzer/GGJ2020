//Holds the normal and misspelled versions of the full text
wordsCorrect = "";
wordsWrong = "";

//The number of characters that have been correctly typed, not including the current word the user is typing
numPreviousCharactersCorrect = 0;

//time object to calculate wpm
var d = new Date();

//Time/word count variables for WPM calculation
startTimeInMs = 0;
endTimeInMs = 0;

//correct/incorrect character amount
totalCharactersCorrect = 0;
totalCharactersIncorrect = 0;

//progress bar stuff
const REMAINING_PROGRESS_EMOJI = "🟦"; //it has the same width as the player and opponent emojis so the flag doesn't move around
const PLAYER_ONE_PROGRESS_EMOJI = "💨";
const OPPONENT_PROGRESS_EMOJI = "💥";
const FINISHED_EMOJI = "🏁"; //both use a flag at the end to make it clear who wins and who loses
const PLAYER_ONE_EMOJI = "🐝";
const PLAYER_OPPONENT_EMOJI = "🚀";
const PROGRESS_INCREMENTS = 20;

successfulCharsTypedSinceLastUpdate = 0;
textLength = 0;
var wpmInterval;
var accuracyInterval;
AVERAGE_WORD_LENGTH = 4.79; //According to a 'rocket engineer' on quora

//mutliplayer
var peer = null;
var connOBJ = null;
var mapLoaded = 0;
var playerPos = 0;

//singleplayer bot variables
botRaceStarted = false;
var botStartTimeInMs = 0;
var botEndTimeInMs = 0;
var botProgressInterval;
botRaceFinished = false;

//hackey shit
var nextKeyToPress = 'a';

//load the game when html is ready
window.addEventListener("load", loadPage);
function loadPage() {
  //Hide the Peer ID
  document.getElementById("openToLan").style.visibility = 'hidden';

  //load the file of URIs of each text to read later
  fetch(window.location.href + "/texts.txt").then(function (response) {
    response.text().then(function (URIsOfTexts) {
      //split by newlines
      listOfURIsOfTexts = URIsOfTexts.split("\n");

      //pick a random text
      var randomTextURI = listOfURIsOfTexts[Math.floor(Math.random() * listOfURIsOfTexts.length)];

      //load the random text
      fetch(window.location.href + randomTextURI).then(function (response2) {
        response2.text().then(function (textToType) {
          //Get the text length
          textLength = textToType.length;

          nextKeyToPress = textToType[0];

          //make the text to type misspelled
          misspellString(textToType);

          //add game hook
          var inputText = document.getElementById("inputText");
          inputText.addEventListener("input", keyPressed);
          inputText.addEventListener("keypress", onPress);

          gameText.innerText = wordsWrong;

          var inputOpenToLan = document.getElementById("inputOpenToLan");
          inputOpenToLan.addEventListener("click", openToLan);
          var inputConnectToLan = document.getElementById("inputConnectToLan");
          inputConnectToLan.addEventListener("click", connectToLan);

          var reloadOBJ = document.getElementById("reload");
          reloadOBJ.addEventListener("click", reload);

        });
      });
    });
  });
}

function reload() {
  location.reload();
}

function openToLan() {
  if (peer != null) {
    console.log("Can not re-open to lan");
    return;
  }

  console.log("opening to lan");

  //Alter the html elements for the multiplayer game
  document.getElementById("inputPeerID").disabled = true;
  document.getElementById("inputText").disabled = true; //so the user can't type it and win before the race starts
  document.getElementById("botWPMSlider").disabled = true; 
  document.getElementById("opponentHeading").innerText = "\nHuman Opponent"; //make it clear who they are racing

  peer = new Peer(Math.floor(Math.random() * 999999) + 1);
  peer.on("open", function (id) {
    console.log("My peer ID is: " + id);

    //Display the info
    document.getElementById("openToLan").style.visibility = 'visible';
    document.getElementById("gameID").innerText = id.toString() + " (Share this with your opponent)";
  });

  peer.on("connection", function (conn) {
    console.log("connected");
    connOBJ = conn;

    numPreviousCharactersCorrect = 0; //Reset in case they started typing before they started the multiplayer game
    currentWordCharactersCorrect = 0;
    currentWordCharactersWrong = 0;

    conn.on("data", function (data) {
      if (data == "map") {
        connOBJ.send(wordsCorrect);
        connOBJ.send(wordsWrong);

        document.getElementById("opponentProgressBar").classList = [];
        nextKeyToPress = wordsCorrect[0];

        setTimeout(function () {
          document.getElementById("inputText").value = "5";
          setTimeout(function () {
            document.getElementById("inputText").value = "4";
            setTimeout(function () {
              document.getElementById("inputText").value = "3";
              setTimeout(function () {
                document.getElementById("inputText").value = "2";
                setTimeout(function () {
                  document.getElementById("inputText").value = "1";
                  setTimeout(function () {
                    document.getElementById("inputText").value = "";
                    document.getElementById("inputText").disabled = false;
                    document.getElementById("inputText").focus();
                  }, 1000);
                }, 1000);
              }, 1000);
            }, 1000);
          }, 1000);
        }, 1000);
      } else {
        playerPos = data;
        updateProgressBar();
      }
    });
  });
}

function connectToLan() {
  if (peer != null) {
    console.log("Can not reconnect to lan");
    return;
  }

  if (document.getElementById("inputPeerID").value == "") {
    return;
  }

  console.log("connecting To Lan");

  document.getElementById("inputPeerID").disabled = true;
  document.getElementById("inputText").disabled = true;
  document.getElementById("botWPMSlider").disabled = true; 
  document.getElementById("opponentHeading").innerText = "\nHuman Opponent"; //make it clear who they are racing
  
  peer = new Peer(Math.floor(Math.random() * 999999) + 1);
  peer.on("open", function (id) {
    console.log("My peer ID is: " + id);
  });

  var conn = peer.connect(document.getElementById("inputPeerID").value);
  conn.on("open", function () {
    connOBJ = conn;

    // Receive messages
    conn.on("data", function (data) {
      console.log("Received ", data);
      switch (mapLoaded) {
        case 0:
          console.log("load 0 ");

          wordsCorrect = data;
          mapLoaded++;
          break;
        case 1:
          console.log("load 1 ");

          wordsWrong = data;
          gameText.innerText = wordsWrong;
          mapLoaded++;

          textLength = wordsCorrect.length;

          document.getElementById("opponentProgressBar").classList = [];
          nextKeyToPress = wordsCorrect[0];

          setTimeout(function () {
            document.getElementById("inputText").value = "5";
            setTimeout(function () {
              document.getElementById("inputText").value = "4";
              setTimeout(function () {
                document.getElementById("inputText").value = "3";
                setTimeout(function () {
                  document.getElementById("inputText").value = "2";
                  setTimeout(function () {
                    document.getElementById("inputText").value = "1";
                    setTimeout(function () {
                      document.getElementById("inputText").value = "";
                      document.getElementById("inputText").disabled = false;
                      document.getElementById("inputText").focus();
                    }, 1000);
                  }, 1000);
                }, 1000);
              }, 1000);
            }, 1000);
          }, 1000);

          break;
        default:
          playerPos = data;
          updateProgressBar();
          break;
      }
    });

    connOBJ.send("map");
  });
}

function onPress(event) {
  if (event.key == nextKeyToPress) {
    totalCharactersCorrect++;
  } else {
    totalCharactersIncorrect++;
  }
}

function keyPressed() {
  //Disable the bot WPM slider because they are in a race (with a bot or a human, doesn't matter) and have basically selected it
  document.getElementById("botWPMSlider").disabled=true;
  
  getStartTime();
  startRaceBot();

  //used to keep track of how many letters are correct
  currentWordCharactersCorrect = 0;
  //used to keep track of how many letters are wrong
  currentWordCharactersWrong = 0;
  //has a key been wrong so far
  hasMistype = false;

  //loop thought all input
  for (var i = 0; i < inputText.value.length; i++) {
    if (//When they press space after correctly typing the word
      inputText.value[i] == wordsCorrect[numPreviousCharactersCorrect + i] &&
      inputText.value[i] == " " &&
      !hasMistype
    ) {
      successfulCharsTypedSinceLastUpdate += inputText.value.length;

      //move to next word
      //add one for off by one
      numPreviousCharactersCorrect += currentWordCharactersCorrect + 1;

      nextKeyToPress = wordsCorrect[successfulCharsTypedSinceLastUpdate + 1]
      //reset local cursor
      currentWordCharactersCorrect = 0;
      //clear text box
      inputText.value = "";
      //correct letter
    } else if (
      //If it is a correct letter, but not a complete word
      inputText.value[i] == wordsCorrect[numPreviousCharactersCorrect + i] &&
      !hasMistype
    ) {
      //move local cursor
      currentWordCharactersCorrect++;

      nextKeyToPress = wordsCorrect[successfulCharsTypedSinceLastUpdate + currentWordCharactersCorrect]

      //if they entered the last input character
      if ((numPreviousCharactersCorrect + currentWordCharactersCorrect) == textLength) {
        document.getElementById("playerOneProgressBar").innerText += FINISHED_EMOJI;
        document.getElementById("inputText").disabled = true;
        document.getElementById("inputText").value = "You win!";
      }
    }
    //wrong letter
    else {
      //when user puts in a wrong letter
      //set had wrong leater
      hasMistype = true;
      //move red cursor
      currentWordCharactersWrong++;
    }
  }

  //When the user has completed the text
  if (numPreviousCharactersCorrect + currentWordCharactersCorrect == textLength) {
    //stop updating WPM & Accuracy  & the bot
    clearInterval(wpmInterval);
    clearInterval(accuracyInterval);
    clearInterval(botProgressInterval);

    numPreviousCharactersCorrect = wordsCorrect.length;
  }

  //Send the current word that the player is on to the opponent
  if (connOBJ != null) {
    connOBJ.send(numPreviousCharactersCorrect);
  }

  updateProgressBar(numPreviousCharactersCorrect, currentWordCharactersCorrect);

  //print words
  gameTextTyped.innerText = wordsWrong.slice(0, numPreviousCharactersCorrect + currentWordCharactersCorrect);
  gameTextWrong.innerText = wordsWrong.slice(
    numPreviousCharactersCorrect + currentWordCharactersCorrect,
    numPreviousCharactersCorrect + currentWordCharactersCorrect + currentWordCharactersWrong
  );
  gameText.innerText = wordsWrong.slice(
    numPreviousCharactersCorrect + currentWordCharactersCorrect + currentWordCharactersWrong
  );
}

//Starts the AI bot that 'races' the user to finish the text
function startRaceBot() {
  //Dont start a race bot if the  user is doing multiplayer or one is already started
  if(peer != null || botRaceStarted == true){ return;} 

  //Disable the ability to start or join a multiplayer match, because they are now racing a bot
  document.getElementById("inputOpenToLan").disabled=true;
  document.getElementById("inputConnectToLan").disabled=true;
  document.getElementById("inputPeerID").disabled=true;

  var selectedBotWPM = document.getElementById("botWPMSlider").value;

  //get the start time of the bot
  var botDateTime = new Date();
  botStartTimeInMs = botDateTime.getTime();

  //Calculate when the bot will finish, given the WPM it 'types' at
  var botCPS = (selectedBotWPM/60)*AVERAGE_WORD_LENGTH;
  var botTimeToFinishInMs = (textLength / botCPS)*1000;
  botEndTimeInMs = botStartTimeInMs + botTimeToFinishInMs;

  //start the interval to check to update the progress bar each 20 ms
  botProgressInterval = setInterval(updateProgressBar, 20);
  botRaceStarted = true;
}

function updateProgressBar() {
  //Update Player One (User) progress bar
  if(((numPreviousCharactersCorrect / textLength) * PROGRESS_INCREMENTS) >=1) {
    var playerOneProgressBar = document.getElementById("playerOneProgressBar");
    playerOneProgressEmojis = PLAYER_ONE_PROGRESS_EMOJI.repeat(Math.floor((numPreviousCharactersCorrect / textLength) * PROGRESS_INCREMENTS));
    playerOneProgressBar.innerText = playerOneProgressEmojis + PLAYER_ONE_EMOJI + REMAINING_PROGRESS_EMOJI.repeat(PROGRESS_INCREMENTS- (playerOneProgressEmojis.length/2)) + FINISHED_EMOJI;
  }

  //Update Player Two (Human opponent) progress bar
  if(((playerPos / textLength)*PROGRESS_INCREMENTS)>=1) {
    opponentProgressEmojis = OPPONENT_PROGRESS_EMOJI.repeat(Math.floor((playerPos / textLength) * PROGRESS_INCREMENTS));
    opponentProgressBar.innerText = opponentProgressEmojis + PLAYER_OPPONENT_EMOJI + REMAINING_PROGRESS_EMOJI.repeat(PROGRESS_INCREMENTS- (opponentProgressEmojis.length/2)) + FINISHED_EMOJI;
  
    //if they finished
    if (playerPos == textLength) {
      document.getElementById("inputText").disabled = true;
      document.getElementById("inputText").value = "Sorry you lost!";
      clearInterval(wpmInterval);
      clearInterval(accuracyInterval);
    }
  }

  //Update BOT progress bar if its racing
  if(botRaceStarted == true && botRaceFinished == false) {
    var currentTimeInMs = d.getTime() + 1; //current time in ms is 1 ms behind bot time for some reason. Account for this to stop negative time from happening

    //Get the percentage of completion of the bot 
    var elapsedBotTime = currentTimeInMs - botStartTimeInMs;
    var botPortionCompleted = elapsedBotTime / (botEndTimeInMs - botStartTimeInMs); 
    console.log("bot completion is at: " + botPortionCompleted);
    
    //Get the progress emoji
    botProgressEmojis = OPPONENT_PROGRESS_EMOJI.repeat(Math.floor(botPortionCompleted*PROGRESS_INCREMENTS)); 

    //update the progress bar
    opponentProgressBar.innerText = botProgressEmojis + PLAYER_OPPONENT_EMOJI + REMAINING_PROGRESS_EMOJI.repeat(PROGRESS_INCREMENTS- (botProgressEmojis.length/2)) + FINISHED_EMOJI;

    //When the bot finishes
    if(botPortionCompleted >= 1) {
      clearInterval(botProgressInterval); //stop the timer
      botRaceFinished = true;

      //The user lost, so lock the input bar and tell them they lost
      document.getElementById("inputText").disabled = true;
      document.getElementById("inputText").value = "Sorry you lost!";
      clearInterval(wpmInterval);
      clearInterval(accuracyInterval);
    }
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
    if (tempList[index].length >= 2)
      //Only attempt to alter words that are more than 1 letter
      switch (Math.floor(Math.random() * 3)) {
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
    str.substring(0, swap) + str[swap + 1] + str[swap] + str.substring(swap + 2)
  );
}

//It will return strings with one letter
function swapFrontAndBackLetters(str) {
  if (str.length == 1) return str;
  //get index of start and end letter
  alteredString =
    str[str.length - 1] + str.substring(1, str.length - 1) + str[0];
  return alteredString;
}

function scrambleEntireWord(str) {
  originalStrLength = str.length;
  scrambledWord = "";

  //iterate through each letter of word, pick a random index to move the letter to a new string. update string
  for (let letterIndex = 0; letterIndex < originalStrLength; letterIndex++) {
    randomIndex = Math.floor(Math.random() * str.length); //generate random
    scrambledWord += str[randomIndex];

    //remove the letter from the original word
    str =
      str.substring(0, randomIndex) +
      str.substring(randomIndex + 1, str.length);
  }

  return scrambledWord;
}

//Get accuracy
function getAccuracy() {
  //get accuracy as a percentage
  accuracy =
    Math.round((totalCharactersCorrect / (totalCharactersCorrect + totalCharactersIncorrect)) * 100);

  var AccuracyText = document.getElementById("Accuracy");
  AccuracyText.innerText = "Accuracy: " + accuracy + "%";

  //return a rounded number
  return Math.floor((accuracy + Number.EPSILON) * 100) / 100;
}

//start the timer if it wasn't already
function getStartTime() {
  if (startTimeInMs == 0) {
    d = new Date();
    startTimeInMs = d.getTime(); //Get time in Ms from 1970
    wpmInterval = setInterval(getWPM, 100);
    accuracyInterval = setInterval(getAccuracy, 100);
  }
}

function getEndTime() {
  d = new Date();
  endTimeInMs = d.getTime();
}

//Calculate and return the WPM that the user typed at
function getWPM(startTime) {
  d = new Date();
  raceTimeInMinutes = (d.getTime() - startTimeInMs) / 1000 / 60;
  CPM = Math.round((numPreviousCharactersCorrect + currentWordCharactersCorrect) / raceTimeInMinutes);  //characters per minute
 
  WPM = Math.round(CPM / AVERAGE_WORD_LENGTH);

  var WPMText = document.getElementById("WPM");
  WPMText.innerText = "WPM: " + WPM.toString();
  return Math.floor((WPM + Number.EPSILON) * 100) / 100; //round excess decimal points
}