const emailInput = document.querySelector('#email')
const sendResetBtn = document.querySelector('#forgot-password-btn')

sendResetBtn.addEventListener('click', () => {
  const email = emailInput.value

  fetch(`/api/users/password-recovery`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email }),
    credentials: 'include'
  })
    .then(response => {
      if (response.status === 200) {
        alert('Password reset email has been sent. Please check your inbox.')
      } else {
        console.error(`Error: ${response.status}`)
      }
    })
    .catch(error => {
      console.error('Error:', error)
    })
})
