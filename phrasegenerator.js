dic = null;

function makePhrase(Phrase) {

  // tree done
  if (!Phrase.includes("#")) {
    return Phrase;
  }
  let words = Phrase.split("#");
  let output = words;

  for (let i = 1; i < words.length; i += 2) {

    listOfThisWord = dic[words[i].toLowerCase()];

    let wordToUse =
      listOfThisWord[Math.floor(Math.random() * listOfThisWord.length)];

    let test = makePhrase(wordToUse);

    output[i] = test;
  }

  return output.join("");
}

function loadPhrase() {
  if (dic == null) {
    fetch(window.location.href + "/Texts/COMPUTERS.json").then(function(response) {
      response.json().then(function(json) {
        dic = json;
        console.log("yes");
      });
    });
  } else {
    console.log("no");
  }
}
