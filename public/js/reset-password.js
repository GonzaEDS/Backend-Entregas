document.querySelector('.card-header').style = 'background-color:red'

document.addEventListener('DOMContentLoaded', function () {
  // Get the form and inputs
  const form = document.querySelector('.reset-password-form')
  const password = document.getElementById('password')
  const confirmPassword = document.getElementById('confirm-password')

  // Listen for form submission
  form.addEventListener('submit', function (event) {
    event.preventDefault()

    // Remove any existing alert
    const existingAlert = document.querySelector('.alert')
    if (existingAlert) existingAlert.remove()

    // Check if passwords match
    if (password.value !== confirmPassword.value) {
      // Create a bootstrap alert
      const alert = document.createElement('div')
      alert.className = 'alert alert-danger alert-dismissible fade show'
      alert.role = 'alert'
      alert.textContent = 'Passwords do not match.'

      // Create a close button for the alert
      const closeButton = document.createElement('button')
      closeButton.type = 'button'
      closeButton.className = 'btn-close'
      closeButton.dataset.bsDismiss = 'alert'
      closeButton.ariaLabel = 'Close'

      alert.appendChild(closeButton)

      // Insert the alert before the form
      form.parentNode.insertBefore(alert, form)
    } else {
      // Fetch to the API if the passwords match
      const token = document.querySelector('input[name="token"]').value
      const data = { newPassword: password.value, token: token }

      fetch('/api/users/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(data => {
          if (data.error) {
            // Handle error
            const errorDiv = document.createElement('div')
            errorDiv.className = 'alert alert-danger'
            errorDiv.role = 'alert'
            errorDiv.textContent = 'An error occurred: ' + data.error
            document.body.prepend(errorDiv)
          } else {
            // Redirect to login page
            window.location.href = '/'
          }
        })
        .catch(error => {
          console.error('Error:', error)
        })
    }
  })
})
