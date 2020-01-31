window.addEventListener("load", loadPage);

wordsCorrect = "";
words = "";
currentWord = 0;

function loadPage() {
  // load ID
  var gameTextTyped = document.getElementById("gameTextTyped");
  var gameTextWrong = document.getElementById("gameTextWrong");
  var gameText = document.getElementById("gameText");
  var inputText = document.getElementById("inputText");

  /*
  //load texts
  fetch("/texts.txt").then(function(response) {
    response.text().then(function(text) {
      //split by newlines
      list = text.split("\n");
      //pick random
      var rand = list[Math.floor(Math.random() * list.length)];

      //load picked file
      fetch(rand).then(function(response2) {
        response2.text().then(function(text2) {
          //save the words
          words = text2;
        });
      });
    });
  });
  //*/

  makeString()

  gameText.innerText = words;
  inputText.innerText = "";
  inputText.addEventListener("input", keyPressed);
}

function keyPressed(events) {

  cursor = 0;
  cursorWrong = 0;
  mistype = false;

  for (var i = 0; i < inputText.value.length; i++) {
    if (inputText.value[i] == wordsCorrect[currentWord + i] && inputText.value[i] == ' ' && !mistype) {
      currentWord += cursor + 1;
      cursor = 0;
      inputText.value = '';
    }else if(inputText.value[i] == wordsCorrect[currentWord + i] && !mistype){
      cursor++;
    }else{
      mistype = true;
      cursorWrong++;
    }
  }
  

  gameTextTyped.innerText = words.slice(0,currentWord + cursor);
  gameTextWrong.innerText = words.slice(currentWord + cursor, currentWord + cursor + cursorWrong);
  gameText.innerText = words.slice(currentWord + cursor + cursorWrong);
  
}

function makeString() {
  // 0 to 1
  percentWrong = .2;

  input = "You must take life the way it comes at you and make the best of it";
  tempList = input.split(" ");
  wordsCorrect = tempList.join(' ');
  
  indexs = shuffle([...Array(tempList.length).keys()])
  indexs = indexs.slice(0, indexs.length * percentWrong);
  indexs.forEach(index => {
    tempList[index] = swapLetters(tempList[index]);
  });
  words = tempList.join(' ');

}

function swapLetters(str) {
  swap = Math.floor(Math.random() * Math.floor(str.length - 1));
  return str.substring(0, swap) + str[swap + 1] + str[swap] + str.substring(swap+2)
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
