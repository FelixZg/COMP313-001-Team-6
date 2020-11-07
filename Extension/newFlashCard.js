function main() {
    createEventListeners();
}
function createFlashcard(location) {
    //Element getters
    var title = document.getElementById("title");
    var content = document.getElementById("content");
    var tags = document.getElementsByClassName("tag_content");
    var checkBox = document.getElementById("checkBox");
    var dateTimeMs = document.getElementById("time").valueAsNumber;

    //Tests for empty title or content
    if (title.value == "" || content.value == "") {
        var lblRules = document.getElementById("lblRules");
        lblRules.style.display = "block";
        lblRules.innerHTML = "Must enter both a Title and Content";
        return;
    }

    //Tests for content that's too long
    var contentText = content.value;
    if (contentText.length > 25) {
        var lblRules = document.getElementById("lblRules");
        lblRules.style.display = "block";
        lblRules.innerHTML = "Character limit is 25";
        return;
    }

    //Date constructor
    var alarm = new Date(dateTimeMs);
    var alarmTime = new Date(alarm.getUTCFullYear(), alarm.getUTCMonth(), alarm.getUTCDate(), alarm.getUTCHours(), alarm.getUTCMinutes(), alarm.getUTCSeconds());

    //Tests for time in the past
    var now = new Date();
    now.setHours(0,0,0,0);
    if (alarmTime < now) {
        var lblRules = document.getElementById("lblRules");
        lblRules.style.display = "block";
        lblRules.innerHTML = "Time is the past";
        return;
    }

    //Tests for flashcards with same time
    for (var t = 0; t < arrayOfFCtimes.length; t++) {
        if (alarmTime.getTime() == arrayOfFCtimes[t]) {
            var lblRules = document.getElementById("lblRules");
            lblRules.style.display = "block";
            lblRules.innerHTML = "Time is already used";
            return;
        }
    }

    //Organize tags
    var organizedTags = [tags.length];
    for (var t = 0; t < tags.length; t++) {
        organizedTags[t] = tags[t].innerHTML;
    }

    //adds new flash card object to storage and assigns random id
    if (location === "local") {
      Flashcard.addFlashCardToStorage(flashcard = new Flashcard('_' + Math.random().toString(36).substr(2, 9).toString(), title.value, content.value, organizedTags, alarmTime.getTime(), currentStarMark));
    }
    
    if (location === "db") {
      Flashcard.addFlashCardToDb(flashcard = new Flashcard(title.value, content.value, organizedTags, alarmTime.getTime(), currentStarMark));
    }
    //gets newly added flash card from storage and parses the flash card
    parsedFlashcard = JSON.parse(window.localStorage.getItem(flashcard.id));

    //set alarm for flashcard
    setTimeout(function() { initAlarm(parsedFlashcard.id); }, parsedFlashcard.date - (new Date()).getTime());
    
    numFlashcards++;
    displayFlashcard(flashcard, numFlashcards);

    arrayOfFCtimes.push(flashcard.date);

    expandCollapseAddFlashcard();
}

// Event listeners for buttons
function createEventListeners() {
    var submitBtn = document.getElementById("submitBtn");
    var dbSaveBtn = document.getElementById("dbSaveBtn")

    if (submitBtn.addEventListener) {
        submitBtn.addEventListener("click", () => {
          createFlashcard("local")
        });
    } else if (submitBtn.attachEvent) {
        submitBtn.attachEvent("onclick", createFlashcard, false);
    }

    if (dbSaveBtn.addEventListener) {
      dbSaveBtn.addEventListener("click", () => {
        createFlashcard("db")
      });
    } else if (dbSaveBtn.attachEvent) {
      dbSaveBtn.attachEvent("onclick", createFlashcard, false);
    }

    var cancelBtn = document.getElementById("cancelBtn");
    if (cancelBtn.addEventListener) {
        cancelBtn.addEventListener("click", expandCollapseAddFlashcard, false);
    } else if (cancelBtn.attachEvent) {
        cancelBtn.attachEvent("onclick", expandCollapseAddFlashcard, false);
    }
}

// Initialization
if (window.addEventListener) {
    window.addEventListener("load", main, false)
} else if (window.attachEvent) {
    window.attachEvent("onload", main)
}