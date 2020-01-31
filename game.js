//load the game when html is ready
window.addEventListener("load", loadPage);

//used to keep the correct string
wordsCorrect = "";
//used to keep the wrong string
words = "";
//ehat word is compleat
currentWord = 0;

function loadPage() {
  //TODO: load text to show

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
          //save the words

          //make the string misspelled
          misspellString(text2);

          //add game hook
          var inputText = document.getElementById("inputText");
          inputText.addEventListener("input", keyPressed);
          //fix looks
          keyPressed();
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
  //used to keep track of how meny letters are correct
  cursor = 0;
  //used to keep track of how meny letters are wrong
  cursorWrong = 0;
  //has a key been wrong so far
  hasMistype = false;

  //loop thought all input
  for (var i = 0; i < inputText.value.length; i++) {
    //is it a space
    if (
      inputText.value[i] == wordsCorrect[currentWord + i] &&
      inputText.value[i] == " " &&
      !hasMistype
    ) {
      //move to next word
      //add one for off by one
      currentWord += cursor + 1;
      //reset local cursor
      cursor = 0;
      //clear text box
      inputText.value = "";
      //correct leater
    } else if (
      inputText.value[i] == wordsCorrect[currentWord + i] &&
      !hasMistype
    ) {
      //move local cursor
      cursor++;
      //wrong leater
    } else {
      //set had wrong leater
      hasMistype = true;
      //move red cursor
      cursorWrong++;
    }
  }

  if (currentWord + cursor == wordsCorrect.length) {
    alert("done");
  }

  //print words
  gameTextTyped.innerText = words.slice(0, currentWord + cursor);
  gameTextWrong.innerText = words.slice(
    currentWord + cursor,
    currentWord + cursor + cursorWrong
  );
  gameText.innerText = words.slice(currentWord + cursor + cursorWrong);
}

//misspell a word
function misspellString(input) {
  // 0 to 1
  percentWrong = 0.2;

  //split in to words
  tempList = input.split(" ");
  //make correct string
  wordsCorrect = tempList.join(" ");

  //pick words to misspell
  indexs = shuffle([...Array(tempList.length).keys()]);
  indexs = indexs.slice(0, indexs.length * percentWrong);
  indexs.forEach(index => {
    tempList[index] = swapLetters(tempList[index]);
  });

  //save misspell string
  words = tempList.join(" ");

  function swapLetters(str) {
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
}
