const{ updateFC } = require('./testfunction');

test('should update flashcard', () => {
    for (var i = 0; i < localStorage.length; i++) {
        //Get flash card from storage
        cards = localStorage.getItem(localStorage.key(i));
      
        //Parses the flash card into an object
        Elementcontent = JSON.parse(cards);
        const result = updateFC(Elementcontent.id);
        expect(result).tobe(  
            newflashcard.id = id,
            newflashcard.title = newtitle,
            newflashcard.content = newcontent);
      }

})

const{ dispdisplayFlashcardlay} = require('./testfunction');

test('should create html element', () =>{
    for (var i = 0; i < localStorage.length; i++) {
        //Get flash card from storage
        cards = localStorage.getItem(localStorage.key(i));
      
        //Parses the flash card into an object
        Elementcontent = JSON.parse(cards);
        const element = dispdisplayFlashcardlay(Elementcontent, i);
        expect(element).tobe(    
            //create section element
            container = document.createElement("SECTION"),
            container.setAttribute('class', 'flashCardItem flex-item'),
            container.setAttribute('id', i),
          
            //create header element
            title = document.createElement("H4"),
          
            //create paragraph element
            p = document.createElement("P"),
          
            //create button elements
            updatebutton = document.createElement("BUTTON"),
            deletebutton = document.createElement("BUTTON"));
        }
})

test('should assign inner html values', () =>{
    for (var i = 0; i < localStorage.length; i++) {
        //Get flash card from storage
        cards = localStorage.getItem(localStorage.key(i));
      
        //Parses the flash card into an object
        Elementcontent = JSON.parse(cards);
        const value = dispdisplayFlashcardlay(Elementcontent, i);
        expect(value).tobe(    
            title.innerHTML = flashcardData.title,
            p.innerHTML = flashcardData.content,
            updatebutton.innerHTML = "Edit",
            deletebutton.innerHTML = "Delete");
        }
})

test('should set attributes to buttons based on flashcard id', () =>{
    for (var i = 0; i < localStorage.length; i++) {
        //Get flash card from storage
        cards = localStorage.getItem(localStorage.key(i));
      
        //Parses the flash card into an object
        Elementcontent = JSON.parse(cards);
        const attributes = dispdisplayFlashcardlay(Elementcontent, i);
        expect(attributes).tobe(    
            updatebutton.setAttribute("id", flashcardData.id),
            deletebutton.setAttribute("id", flashcardData.id + 'a'));
        }
})

test('should create button event listeners', () =>{
    for (var i = 0; i < localStorage.length; i++) {
        //Get flash card from storage
        cards = localStorage.getItem(localStorage.key(i));
      
        //Parses the flash card into an object
        Elementcontent = JSON.parse(cards);
        const event = dispdisplayFlashcardlay(Elementcontent, i);
        expect(event).tobe(    
            deletebutton.addEventListener("click", expandCollapseDeleteFlashcard.bind(this, i), false),
            deleteYesBtn.addEventListener("click", deleteFC.bind(this, flashcardData.id), true),
            deleteNoBtn.addEventListener("click", expandCollapseDeleteFlashcard.bind(this, i), false),
            document.getElementById(updatebutton.id).addEventListener("click", updateFC.bind(this, flashcardData.id), true));
    }
})