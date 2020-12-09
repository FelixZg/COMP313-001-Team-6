class Flashcard {
  constructor(id, title, content, tag, date, priority){
      this.id = id;
      this.title = title;
      this.content = content;
      this.tag = tag;
      this.date = date;
      this.priority = priority;
  }

  static addFlashCardToStorage(flashcard){
      window.localStorage.setItem(flashcard.id, JSON.stringify(flashcard));
  }

  static addFlashCardToDb(flashcard){
    chrome.storage.local.get("username", function(item) {
      var username = item.username
      var url = 'http://localhost:53741/api/' + username + '/card'
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(flashcard)
      })
      .then(res => {
        return new Promise(resolve => {
          if (res.status !== 200) resolve('fail')
            resolve('success')
        })
      })  
    })
  }

  static deleteFCFromStorage(id){
      window.localStorage.removeItem(id);
  } 
}