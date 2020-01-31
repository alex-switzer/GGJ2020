
window.addEventListener("load", loadPage); 

words = "You must take life the way it comes at you and make the best of it";
cursor = 0;

function loadPage() {

    var gameText = document.getElementById("gameText");
    var inputText = document.getElementById("inputText")

    //console.log(readTextFile("file:///C:\\Users\\GameJam\\Desktop\\GGJ\\texts.txt"));
    

    gameText.innerText = words;
    inputText.addEventListener("keypress", keyPressed); 

}

function keyPressed(events) {    

    if(events.key == words.substring(cursor,cursor+1)){
        cursor++;
        if(events.keyCode == 32){
            events.target.value = '';
        }
    }
    
    gameText.innerText = words.slice(0, cursor) + "|" + words.slice(cursor);

}

function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                alert(allText);
            }
        }
    }
    rawFile.send(null);
}
