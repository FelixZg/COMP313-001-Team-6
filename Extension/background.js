//let userSignedIn = false
//let session = false

/* function isUserSignedIn() {
  return new Promise(resolve => {
    chrome.storage.local.get(["userStatus", "username"], function(response) {
      if (chrome.runtime.lastError) resolve({ userStatus: false, username: {}})
      resolve(response.userStatus === undefined ? {userStatus: false, username: {}} : {userStatus: response.userStatus, username: response.username})
    })
  })
} */

function loginUser(userInfo) {
  return fetch('http://localhost:53741/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userInfo)
    })
    .then(res => {
      return new Promise(resolve => {
        if (res.status !== 200) {
          alert("this should fail")
          resolve('fail')
        }
        else 
        {
          var username = userInfo.username
          chrome.storage.local.set({ "username": username }, () => {
            if (chrome.runtime.lastError) {
              resolve('fail')
            }
            else {
              resolve('success')
            }       
          })
        }      
      })  
    })
    .catch(err => console.log(err))
}

function registerUser(userInfo) {
  return fetch('http://localhost:53741/api/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userInfo)
  })
  .then(res => {
    return new Promise(resolve => {
      alert(JSON.stringify(userInfo))
      if (res.status !== 200) {
        resolve('fail')
      }
      else 
      {
        resolve('success')
      }  
    })  
  })
  .catch(err => console.log(err))
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'login') {
    loginUser(request.payload)
      .then(res => sendResponse(res))
      .catch(err => console.log(err))
    return true
  } else if (request.message === 'register') {
    registerUser(request.payload)
  }
});

