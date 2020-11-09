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

    static addFlashCardToDb(flashcard){
      var url = 'http://localhost:3000/cards'

      fetch(url, {
        method: 'POST',
        body: JSON.stringify(flashcard),
        headers: {'Content-Type': 'application/json; charset=UTF-8'}
      })
      .then(response => response.json())
      .then(json => console.log(json))
      .catch(err => console.log(err))
    }

    static deleteFCFromStorage(id){
        window.localStorage.removeItem(id);
    }

    static deleteFCFromDb(id){
      var xhr = new XMLHttpRequest()
      var url = 'http://localhost:3000/cards'

      xhr.open('DELETE', url, true)
      xhr.setRequestHeader('Content-Type', 'application/json')
      xhr.send(JSON.stringify(flashcard))
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
          var json = JSON.parse(xhr.responseText)
          console.log(json)
        } else {
          console.log("LOG")
        }
      }
  }
}