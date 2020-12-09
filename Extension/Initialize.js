var arrayOfFCtimes = [];

function main() {
    arrayOfFCtimes = [];
    for (var i = 0; i < localStorage.length; i++){
        //Get flash card from storage
        cards = localStorage.getItem(localStorage.key(i)); 

        //Parses the flash card into an object
        Elementcontent = JSON.parse(cards);

        if(Elementcontent.date - (new Date()).getTime() > 0){
            setTimeout(function() { initAlarm(Elementcontent.id); }, Elementcontent.date - (new Date()).getTime());
        }

        // Update the arrayOfFCtimes
        arrayOfFCtimes.push(Elementcontent.date);
    }
    numFlashcards = localStorage.length;

    checkForNoFlashcards();
}

function initAlarm(id) {
    // Load popup
    window.location.href = "popup.html?id=" + id;
}

// Initialization
if (window.addEventListener) {
    window.addEventListener("load", main, false)
} else if (window.attachEvent) {
    window.attachEvent("onload", main)
}