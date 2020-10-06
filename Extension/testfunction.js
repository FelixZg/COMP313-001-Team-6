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