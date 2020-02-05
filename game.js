//load the game when html is ready
window.addEventListener("load", loadPage);

//used to keep the correct string
wordsCorrect = "";
//used to keep the wrong string
wordsWrong = "";

//what word is complete
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
const PROGRESS_INCREMENT = 0.1; //10% per emoji update
const PROGRESS_ONE_EMOJI = "💨";
const PROGRESS_TWO_EMOJI = "💥";
const FINISHED_ONE_EMOJI = "🏁";
const FINISHED_TWO_EMOJI = "🌑";
const PLAYER_ONE_EMOJI = "🚎";
const PLAYER_TWO_EMOJI = "🚀";


successfulCharsTypedSinceLastUpdate = 0;
textLength = 0;
var wpmInterval;
var accuracyInterval;


//mutliplayer
var peer = null;
var connOBJ = null;
var mapLoaded = 0;
var playerPos = 0;

//hackey shit
var nextKeyToPress = 'a';

function loadPage() {
  //load the file of URIs of each text to read later
  fetch(window.location.href + "/texts.txt").then(function(response) { 
    response.text().then(function(URIsOfTexts) {
      //split by newlines
      listOfURIsOfTexts = URIsOfTexts.split("\n");
      
      //pick a random text
      var randomTextURI = listOfURIsOfTexts[Math.floor(Math.random() * listOfURIsOfTexts.length)];

      //load the random text
      fetch(window.location.href +randomTextURI).then(function(response2) {
        response2.text().then(function(textToType) {
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
    console.log("Can not reopent to lan");
    return;
  }

  console.log("opening to lan");
  
  document.getElementById("inputPeerID").disabled = true;
  document.getElementById("inputText").disabled = true;
  
  peer = new Peer(Math.floor(Math.random() * 999999) + 1);
  peer.on("open", function(id) {
    console.log("My peer ID is: " + id);
    document.getElementById("gameID").innerText = id;
  });

  peer.on("connection", function(conn) {
    console.log("connected");

    connOBJ = conn;

    conn.on("data", function(data) {
      if (data == "map") {
        connOBJ.send(wordsCorrect);
        connOBJ.send(wordsWrong);

        document.getElementById("showable").classList = [];
        nextKeyToPress = wordsCorrect[0];

        setTimeout(function(){
          document.getElementById("inputText").value = "5";
          setTimeout(function(){ 
            document.getElementById("inputText").value = "4";
            setTimeout(function(){ 
              document.getElementById("inputText").value = "3";
              setTimeout(function(){ 
                document.getElementById("inputText").value = "2";
                setTimeout(function(){ 
                  document.getElementById("inputText").value = "1";
                  setTimeout(function(){ 
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

  peer = new Peer(Math.floor(Math.random() * 999999) + 1);
  peer.on("open", function(id) {
    console.log("My peer ID is: " + id);
    document.getElementById("gameID").innerText = id;
  });

  var conn = peer.connect(document.getElementById("inputPeerID").value);
  conn.on("open", function() {
    connOBJ = conn;

    // Receive messages
    conn.on("data", function(data) {
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

          document.getElementById("showable").classList = [];
          nextKeyToPress = wordsCorrect[0];

          setTimeout(function(){
            document.getElementById("inputText").value = "5";
            setTimeout(function(){ 
              document.getElementById("inputText").value = "4";
              setTimeout(function(){ 
                document.getElementById("inputText").value = "3";
                setTimeout(function(){ 
                  document.getElementById("inputText").value = "2";
                  setTimeout(function(){ 
                    document.getElementById("inputText").value = "1";
                    setTimeout(function(){ 
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
  }else{
    totalCharactersIncorrect++;
  }
}

function keyPressed() {
  getStartTime();

  //used to keep track of how meny letters are correct
  currentWordCharactersCorrect = 0;
  //used to keep track of how meny letters are wrong
  currentWordCharactersWrong = 0;
  //has a key been wrong so far
  hasMistype = false;

  //loop thought all input
  for (var i = 0; i < inputText.value.length; i++) {
    //When they press space after correctly typing the word
    if (
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
      if((numPreviousCharactersCorrect + currentWordCharactersCorrect) == textLength) {
        document.getElementById("playerOneCharacter").innerText += FINISHED_ONE_EMOJI; 
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
  if (numPreviousCharactersCorrect + currentWordCharactersCorrect == wordsCorrect.length) {
    //stop updating WPM & Accuracy
    clearInterval(wpmInterval);
    clearInterval(accuracyInterval);
    
    numPreviousCharactersCorrect = wordsCorrect.length;
  }

  //Send the current word that the player is on to the opponent
  if (connOBJ != null) {
    connOBJ.send(numPreviousCharactersCorrect);
  }
  else {
    //bot race man

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

function updateProgressBar() {
  var playerOne = document.getElementById("playerOne");

  //If there is enough progress, update the progress bar
  if(((numPreviousCharactersCorrect / textLength) * 10) >=1)
  playerOne.innerText = PROGRESS_ONE_EMOJI.repeat(
    Math.floor((numPreviousCharactersCorrect / textLength) * 10)
  );

  //Do the same for the other player
  if(((playerPos / textLength) * 10) >=1 )
  playerTwo.innerText = PROGRESS_TWO_EMOJI.repeat(
    Math.floor((playerPos / textLength) * 10)
  );
  
  if(playerPos == textLength) {
    document.getElementById("playerTwo").innerText += FINISHED_TWO_EMOJI;
    document.getElementById("inputText").disabled = true;
    document.getElementById("inputText").value = "Sorry you not a winner!";
    clearInterval(wpmInterval);
    clearInterval(accuracyInterval);
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
  CPM = Math.round(textLength / raceTimeInMinutes);  //characters per minute

  AVERAGE_WORD_LENGTH = 4.79; //According to a 'rocket engineer' on quora 
  WPM = Math.round(CPM/AVERAGE_WORD_LENGTH);

  var WPMText = document.getElementById("WPM");
  WPMText.innerText = "WPM: " + WPM.toString();
  return Math.floor((WPM + Number.EPSILON) * 100) / 100; //round excess decimal points
}