let userSignedIn = false
let session = false

/* chrome.browserAction.onClicked.addListener(() => {
  chrome.windows.create({
    url: "landingPage.html",
    type: 'popup',
    focused: true,
    width: 310,
    height: 500
  });
}); */

function isUserSignedIn() {
  return new Promise(resolve => {
    chrome.storage.local.get(["userStatus", "username"], function(response) {
      if (chrome.runtime.lastError) resolve({ userStatus: false, username: {}})
      resolve(response.userStatus === undefined ? {userStatus: false, username: {}} : {userStatus: response.userStatus, username: response.username})
    })
  })
}

function flip_user_status(signIn, userInfo) {
  if (signIn) {
    return fetch('http://localhost:53741/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userInfo)
    })
    .then(res => {
      return new Promise(resolve => {
        if (res.status !== 200) resolve('fail')
        /* chrome.storage.local.clear(function() {
          var error = chrome.runtime.lastError;
          if (error) {
              console.error(error);
          }
        }); */
        var username = userInfo.username
        chrome.storage.local.set({ userStatus: signIn,  username }, function(response) {
          if (chrome.runtime.lastError) resolve('fail')
          userSignedIn = signIn
          resolve('success')
        })
      })  
    })
    .catch(err => console.log(err))
  } else if (!signIn) {
    return new Promise(resolve => {
      chrome.storage.local.get(['userStatus', 'username'], function(response) {
        if (chrome.runtime.lastError) resolve('fail')
        if (response.userStatus === undefined) resolve('fail')
        return fetch('http://localhost:53741/api/logout', {
          method: 'GET',
        })
        .then(res => {
          if (res.status !== 200) resolve('fail')
          chrome.storage.local.set({ userStatus: signIn, username: {}}, function(response) {
            if (chrome.runtime.lastError) resolve('fail')
            userSignedIn = signIn
            resolve('success')
          })
        })
      .catch(err => console.log(err))
      })
    }) 
  }
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
      if (res.status !== 200) resolve('fail')
      resolve('success')
    })  
  })
  .catch(err => console.log(err))
}

isUserSignedIn()
.then(res => {
  if (res.userStatus) session = true
  userSignedIn = res.userStatus
  var username
  chrome.storage.local.get("username", function(item) {
    username = item.username
  })
})
.catch(err => console.log(err))

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'login') {
    flip_user_status(true, request.payload)
      .then(res => sendResponse(res))
      .catch(err => console.log(err))
    return true
  } else if (request.message === 'logout') {
    flip_user_status(false, null)
      .then(res => sendResponse(res))
      .catch(err => console.log(err))
  } else if (request.message === 'userStatus') {

  } else if (request.message === 'register') {
    registerUser(request.payload)
  }
});

