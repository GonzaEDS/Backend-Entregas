const registerBtn = document.querySelector('#register-btn')
const emailInput = document.querySelector('#email')
const passwordInput = document.querySelector('#password')
const usernameInput = document.querySelector('#username')
const confirmPasswordInput = document.querySelector('#confirm-password')

registerBtn.addEventListener('click', event => {
  event.preventDefault()
  const username = usernameInput.value
  const email = emailInput.value
  const password = passwordInput.value
  const confirmPassword = confirmPasswordInput.value

  // Validate the form data
  if (
    username === '' ||
    email === '' ||
    password === '' ||
    confirmPassword === ''
  ) {
    showAlert('Please complete all fields')
    return
  }
  if (!isValidEmail(email)) {
    showAlert('Must provide valid email')
    return
  }
  if (password !== confirmPassword) {
    showAlert('Passwords do not match')
    return
  }
  if (!isValidPassword(password)) {
    showAlert(
      'Password must have at least 6 characters and one uppercase letter'
    )
    return
  }
  if (password.includes(username)) {
    showAlert('Password must not contain the username')
    return
  }

  fetch(`/api/users/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, email, password }),
    credentials: 'include' // Add this line
  })
    .then(response => {
      return response.json()
    })
    .then(response => {
      if (response.status === '203') {
        showAlert(response.message)
        return
      }
      const currentUrl = window.location.href
      const root = currentUrl.split('/')[2]
      window.location.href = `http://${root}/user`
    })
})

// HELPERS

function showAlert(message) {
  const messageDiv = `<div class="alert alert-danger alert-dismissible fade show ">
  ${message}
  <button type="button" data-bs-dismiss="alert" aria-label="Close" class="btn-close py-3 close-btn-adjust">
  </button>
  </div>`
  document.querySelector('.alert-message').innerHTML = messageDiv
}

function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailPattern.test(email)
}
function isValidPassword(password) {
  const passwordRegex = /^(?=.*[A-Z])[a-zA-Z0-9]{6,}$/
  return passwordRegex.test(password)
}
