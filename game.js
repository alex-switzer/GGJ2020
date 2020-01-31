window.addEventListener("load", loadPage);

wordsCorrect = ";"
words = "";
cursor = 0;

function loadPage() {
  // load ID
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
  inputText.addEventListener("keypress", keyPressed);
}

function keyPressed(events) {
  if (events.key == wordsCorrect.substring(cursor, cursor + 1)) {
    cursor++;
    if (events.keyCode == 32) {
      events.target.value = "";
    }
  }

  gameText.innerText = words.slice(0, cursor) + "|" + words.slice(cursor);
}

function makeString() {
  // 0 to 1
  percentWrong = .2;

  input = "You must take life the way it comes at you and make the best of it";
  tempList = input.split(" ");
  wordsCorrect = tempList.join(" ");
  
  indexs = shuffle([...Array(tempList.length).keys()])
  indexs = indexs.slice(0, indexs.length * percentWrong);
  indexs.forEach(index => {
    tempList[index] = swapLetters(tempList[index]);
  });


  

  words = tempList.join(" ");

  

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
