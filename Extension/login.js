document.querySelector('#logInForm').addEventListener('submit', e => {
  e.preventDefault();

  const username = document.querySelector('#logInUsername').value
  const password = document.querySelector('#logInPassword').value

  if (username && password) {
    chrome.runtime.sendMessage( {message: 'login', payload: {username, password}}, function (response) {
      if (response === 'success') console.log('message sent successfully')
    })
  }
})