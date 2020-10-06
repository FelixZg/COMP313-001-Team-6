// First get the flashcard id from landingPage.html
var flashcardId = getParameterByName("id");
// Load in flashcard data
var flashcardData = JSON.parse(window.localStorage.getItem(flashcardId));

// Put in title
var title = document.getElementById("title");
title.innerHTML = flashcardData.title;

// Put in content
var content = document.getElementById("content");
content.innerHTML = flashcardData.content;

// "Yes" button
var yesBtn = document.getElementById("yesBtn");
yesBtn.addEventListener("click", yesClicked, true);
function yesClicked() {
    deleteFC(flashcardId);
    closePopUp();
}

// "No" button
var noBtn = document.getElementById("noBtn");
noBtn.addEventListener("click", noClicked, false);
function noClicked() {
    flashcardData.noCount++;
    Flashcard.addFlashCardToStorage(flashcardData);
    closePopUp();
}

function closePopUp() {
    window.location.href = 'landingPage.html';
}

// Gets the value in the url
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

