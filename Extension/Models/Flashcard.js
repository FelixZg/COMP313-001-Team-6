class Flashcard {
    constructor(id, title, content, tag, date, priority){
        this.id = id;
        this.title = title;
        this.content = content;
        this.tag = tag;
        this.date = date;
        this.priority = priority;
        this.noCount = 0;
    }

    static addFlashCardToStorage(flashcard){
        window.localStorage.setItem(flashcard.id, JSON.stringify(flashcard));
    }

    static deleteFCFromStorage(id){
        window.localStorage.removeItem(id);
    }
}