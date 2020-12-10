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
      var url = 'http://usersignup-test.us-west-2.elasticbeanstalk.com/api/' + username + '/card'
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(flashcard)
      })
      .then(res => {
        return new Promise(resolve => {
          if (res.status !== 200) 
          {
            alert("The operation could not be completed due to an error")
            resolve('fail')
          }
          else 
          {
            resolve('success')
          }
        })
      })  
    })
  }

  static editCardInDb(flashcard) {
    chrome.storage.local.get("username", function(item) {
      var username = item.username
      var url = 'http://usersignup-test.us-west-2.elasticbeanstalk.com/api/' + username + '/card/edit/' + flashcard.id
      fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(flashcard)
      })
      .then(res => {
        return new Promise(resolve => {
          if (res.status !== 200) {
            alert("The operation could not be completed due to an error")
            resolve('fail')
          } else {
            alert("Edit complete")
            resolve('success')
          }            
        })
      })  
    })
  }

  static deleteFCFromStorage(id){
      window.localStorage.removeItem(id);
  }

  static deleteCardInDb(id) {
    chrome.storage.local.get("username", function(item) {
      var username = item.username
      var url = 'http://usersignup-test.us-west-2.elasticbeanstalk.com/api/' + username + '/card/delete/' + id
      fetch(url, {
        method: 'DELETE'
      })
      .then(res => {
        return new Promise(resolve => {
          if (res.status !== 200) {
            alert("The operation could not be completed due to an error")
            resolve('fail')
          } else {
          alert("Card successfully deleted")
          resolve('success')
          location.reload()
          }          
        })
      })  
    })
  }
}
