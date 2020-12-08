document.querySelector('#signUpForm').addEventListener('submit', e => {
  e.preventDefault();

  const username = document.querySelector('#username').value
  const password = document.querySelector('#password').value
  const confirmPassword = document.querySelector('#confirmPassword').value

  if (username && password && confirmPassword && password === confirmPassword) {
    chrome.runtime.sendMessage( {message: 'register', payload: {username, password}}, function (response) {
      if (response === 'success') console.log('message sent successfully')
    })
  }
})