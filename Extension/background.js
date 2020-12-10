function loginUser(userInfo) {
  return fetch('http://usersignup-test.us-west-2.elasticbeanstalk.com/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userInfo)
    })
    .then(res => {
      return new Promise(resolve => {
        if (res.status == 200) {
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
        else if (res.status == 404)
        {
          alert("User does not exist")
          resolve('fail')
        } 
        else if (res.status == 400) 
        {
          alert("The password entered was not correct")
          resolve(fail)
        }
        else 
        {
          alert("The operation could not be completed due to an error")
          resolve('fail')
        }
      })  
    })
    .catch(err => console.log(err))
}

function registerUser(userInfo) {
  return fetch('http://usersignup-test.us-west-2.elasticbeanstalk.com/api/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userInfo)
  })
  .then(res => {
    return new Promise(resolve => {
      if (res.status === 200)
      {
        resolve('success')
      } 
      else if (res.status === 400) {
        alert("A user with this username already exists!")
        resolve('fail')
      }
      else
      {
        alert("The operation could not be completed due to an error")
        resolve('fail')
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
  } else if (request.message === 'logout') {
    chrome.storage.local.clear(function() {    
      var error = chrome.runtime.lastError;
      if (error) {
          console.error(error);
      }
   });
   sendResponse({status: "success"})
  }
});
