var button = document.getElementById("addNote");
var cards = {};
var numFlashcards = 0;
var Elementcontent, updatebutton;
var container, p, title;
var updateid;
var rating = "";
var oneStar = document.getElementById("1one");
oneStar.addEventListener("click", function () { starmark(oneStar); });
var twoStar = document.getElementById("2one");
twoStar.addEventListener("click", function () { starmark(twoStar); });
var threeStar = document.getElementById("3one");
threeStar.addEventListener("click", function () { starmark(threeStar); });
var fourStar = document.getElementById("4one");
fourStar.addEventListener("click", function () { starmark(fourStar); });
var fiveStar = document.getElementById("5one");
fiveStar.addEventListener("click", function () { starmark(fiveStar); });

let logInSwitch = document.getElementById('logInSwitch');
let signUpSwitch = document.getElementById('signUpSwitch');

// Add flashcard menu expand & collapse
button.addEventListener("click", expandCollapseAddFlashcard);
function expandCollapseAddFlashcard() {
  var content = document.getElementById("contentToExpand");
  var logInPage = document.getElementById('logIn');
  var signUpPage = document.getElementById('signUp');
  if (content.style.maxHeight) {
    content.style.maxHeight = null;
    // Reset UI
    document.getElementById("lblRules").style.display = "none";
    document.getElementById("title").value = "";
    document.getElementById("content").value = "";
    starmark(document.getElementById("5one"));
    document.getElementById("checkBox").checked = false;
    document.getElementById("time").value = "";
  } else {
    content.style.maxHeight = content.scrollHeight + "px";
    logInPage.style.maxHeight = null;
    signUpPage.style.maxHeight = null;
  }
}

// Hide rules
document.getElementById("lblRules").style.display = "none";

console.log("Flashcards currently in storage:");
for (var i = 0; i < localStorage.length; i++) {
  //Get flash card from storage
  cards = localStorage.getItem(localStorage.key(i));

  //Parses the flash card into an object
  Elementcontent = JSON.parse(cards);

  displayFlashcard(Elementcontent, i);
  numFlashcards++;

  var dateForShow = new Date(Elementcontent.date);
  var tagData = "";
  for (var i=0; i<Elementcontent.tag.length; i++) {
    tagData += Elementcontent.tag[i] + ", ";
  }
  console.log("[Title:" + Elementcontent.title + 
  " Content:" + Elementcontent.content + 
  " Priority:" + Elementcontent.priority + 
  " Date:" + dateForShow.toString() + 
  " NoCount:" + Elementcontent.noCount + 
  " Tags:" + tagData);
}

function displayFlashcard(flashcardData, i) {
  //create section element
  container = document.createElement("SECTION");
  container.setAttribute('class', 'flashCardItem flex-item');
  container.setAttribute('id', i);

  //create header element
  title = document.createElement("H4");

  //create paragraph element
  p = document.createElement("P");

  //create button elements
  updatebutton = document.createElement("BUTTON");
  deletebutton = document.createElement("BUTTON");

  //assign inner html values
  title.innerHTML = flashcardData.title;
  p.innerHTML = flashcardData.content;
  updatebutton.innerHTML = "Edit";
  deletebutton.innerHTML = "Delete";

  //set attributes to buttons based on flashcard id
  updatebutton.setAttribute("id", flashcardData.id);
  deletebutton.setAttribute("id", flashcardData.id + 'a');

  // elements for delete UI
  expandableDeleteContent = document.createElement("DIV");
  expandableDeleteContent.id = i + "expandable";
  expandableDeleteContent.classList.add("content");
  labelDelete = document.createElement("label");
  labelDelete.innerHTML = "Are you sure you want to delete?";
  expandableDeleteContent.appendChild(labelDelete);
  deleteYesBtn = document.createElement("BUTTON");
  deleteYesBtn.innerHTML = "Yes";
  deleteYesBtn.setAttribute("id", flashcardData.id + 'a');
  expandableDeleteContent.appendChild(deleteYesBtn);
  deleteNoBtn = document.createElement("BUTTON");
  deleteNoBtn.innerHTML = "No";
  deleteNoBtn.setAttribute("id", flashcardData.id + 'a');
  expandableDeleteContent.appendChild(deleteNoBtn);

  //append child elements
  document.getElementById("democontainer").appendChild(container);
  document.getElementById(i).appendChild(title);
  document.getElementById(i).appendChild(p);
  for (var t=0; t<flashcardData.tag.length; t++) {
      var newTag = createTag(flashcardData.tag[t]);
      newTag.setAttribute("style", "float:left;");
      document.getElementById(i).appendChild(newTag);
  }
  document.getElementById(i).appendChild(document.createElement("br"));
  document.getElementById(i).appendChild(document.createElement("br"));
  document.getElementById(i).appendChild(updatebutton);
  document.getElementById(i).appendChild(deletebutton);
  document.getElementById(i).appendChild(expandableDeleteContent);

  //create button event listeners
  deletebutton.addEventListener("click", expandCollapseDeleteFlashcard.bind(this, i), false);
  deleteYesBtn.addEventListener("click", deleteFC.bind(this, flashcardData.id), true);
  deleteNoBtn.addEventListener("click", expandCollapseDeleteFlashcard.bind(this, i), false);
  document.getElementById(updatebutton.id).addEventListener("click", updateFC.bind(this, flashcardData.id), true);

  checkForNoFlashcards();
}

function updateFC(id) {
  //prompts for editing new card properties
  newtitle = prompt("Please enter new title", "");
  newcontent = prompt("Please enter new content", "");

  //gets targeted flash card from storage
  newflashcard = JSON.parse(window.localStorage.getItem(id));

  //assigns new values
  newflashcard.id = id;
  newflashcard.title = newtitle;
  newflashcard.content = newcontent;

  //adds flash card back to storage
  Flashcard.addFlashCardToStorage(newflashcard);
  location.reload();
}

function deleteFC(id) {
  Flashcard.deleteFCFromStorage(id);
  numFlashcards--;
  location.reload();
}

function expandCollapseDeleteFlashcard(id) {
  var content = document.getElementById(id + "expandable");
  if (content.style.maxHeight) {
    // Closes
    content.style.maxHeight = null;
  } else {
    // Opens
    content.style.maxHeight = content.scrollHeight + "px";
  }
}

function checkBoxClicked() {
  var checkBox = document.getElementById("checkBox");
  if (checkBox.checked == true) {
    time.removeAttribute("disabled");
  }
  else {
    time.disabled = true;
  }
}

// On window load
window.addEventListener("load", function () {
  var now = new Date();
  var utcString = now.toISOString().substring(0, 19);
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var day = now.getDate() + 2;
  var hour = now.getHours();
  var minute = now.getMinutes();
  var second = now.getSeconds();
  var localDatetime = year + "-" +
    (month < 10 ? "0" + month.toString() : month) + "-" +
    (day < 10 ? "0" + day.toString() : day) + "T" +
    (hour < 10 ? "0" + hour.toString() : hour) + ":" +
    (minute < 10 ? "0" + minute.toString() : minute) +
    utcString.substring(16, 19);
  var datetimeField = document.getElementById("time");
  datetimeField.value = localDatetime;
});

//star system
var currentStarMark = 5;
function starmark(item) {
  var count = item.id[0];
  rating = count;
  var subid = item.id.substring(1);
  for (var i = 0; i < 5; i++) {
    if (i < count) {
      document.getElementById((i + 1) + subid).style.color = "orange";
    }
    else {
      document.getElementById((i + 1) + subid).style.color = "gray";
    }
  }
  currentStarMark = rating;
}

function checkForNoFlashcards() {
  var labelExists;
  if (document.getElementById("noFClabel")) {
    labelExists = true;
  } else {
    labelExists = false;
  }
  if (numFlashcards == 0 && !labelExists) {
    noFClabel = document.createElement("label");
    noFClabel.id = "noFClabel";
    noFClabel.innerHTML = "No flashcards in storage";
    document.getElementById("democontainer").appendChild(noFClabel);
  } else if (numFlashcards > 0 && labelExists) {
    document.getElementById("democontainer").removeChild(document.getElementById("noFClabel"));
  }
}

// Tag system
const tagContainer = document.querySelector('.tag-container');

const input = document.querySelector('.tag-container input');

var tags = [];

function createTag(lable){
  const div = document.createElement('div');
  div.setAttribute('class','tag');
  const span = document.createElement('span');
  span.classList.add("tag_content");
  span.innerHTML = lable;
  const closeBtn = document.createElement('i');
  closeBtn.setAttribute('data-item', lable);
  closeBtn.setAttribute('class','material-icons');
  closeBtn.innerHTML = 'close';
  closeBtn.addEventListener("click", deleteTag.bind(this, closeBtn), false);

  div.appendChild(span);
  div.appendChild(closeBtn);
  return div;
}

function reset(){
  document.querySelectorAll('.tag').forEach(function(tag){
    tag.parentElement.removeChild(tag);
  })
}

function addTags(){
  reset();
  tags.forEach(function(tag){
    const input = createTag(tag);
    tagContainer.prepend(input);
  })
}

input.addEventListener('keyup',function(e){
  if(e.key === 'Enter'){
    tags.push(input.value);
    addTags();
    input.value = '';
  }
});

function deleteTag(tagI) {
    const value = tagI.getAttribute('data-item');
    const index = tags.indexOf(value);
    tags = [...tags.slice(0,index),...tags.slice(index+1)];
    addTags();
}

logInSwitch.addEventListener("click", function() {
  var content = document.getElementById('logIn');
  var otherPage = document.getElementById('signUp');
  var cards = document.getElementById('contentToExpand');
  if (content.style.maxHeight) {
    content.style.maxHeight = null;
  } else {
    content.style.maxHeight = content.scrollHeight + "px";
    otherPage.style.maxHeight = null;
    cards.style.maxHeight = null;
  }
})

signUpSwitch.addEventListener("click", function() {
  var content = document.getElementById('signUp');
  var otherPage = document.getElementById('logIn');
  var cards = document.getElementById('contentToExpand');
  document.getElementById('contentToExpand');
  if (content.style.maxHeight) {
    content.style.maxHeight = null;
  } else {
    content.style.maxHeight = content.scrollHeight + "px";
    otherPage.style.maxHeight = null;
    cards.style.maxHeight = null;
  }
})