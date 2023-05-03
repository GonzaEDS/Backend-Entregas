const loginBtn = document.querySelector('#login-btn')
const emailInput = document.querySelector('#email')
const passwordInput = document.querySelector('#password')

// loginBtn.addEventListener('click', () => {
//   console.log('button clicked')
//   const email = emailInput.value
//   const password = passwordInput.value

//   fetch(`/api/users/login`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({ email, password })
//   }).then(() => {
//     const currentUrl = window.location.href
//     const root = currentUrl.split('/')[2]
//     // window.location.href = `http://${root}/user`
//   })
// })

// loginBtn.addEventListener('click', () => {
//   console.log('button clicked')
//   const email = emailInput.value
//   const password = passwordInput.value

//   fetch(`/api/users/login`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({ email, password })
//   })
//     .then(response => {
//       if (response.status === 200) {
//         const currentUrl = window.location.href
//         const root = currentUrl.split('/')[2]
//         window.location.href = `http://${root}/user`
//       } else {
//         // You can display a message to the user based on the error status
//         console.error(`Error: ${response.status}`)
//       }
//     })
//     .catch(error => {
//       console.error('Error:', error)
//     })
// })

loginBtn.addEventListener('click', () => {
  console.log('button clicked')
  const email = emailInput.value
  const password = passwordInput.value

  fetch(`/api/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password }),
    credentials: 'include' // Add this line to include the cookies in the response
  })
    .then(response => {
      if (response.status === 200) {
        const currentUrl = window.location.href
        const root = currentUrl.split('/')[2]
        window.location.href = `http://${root}/user`
      } else {
        // You can display a message to the user based on the error status
        console.error(`Error: ${response.status}`)
      }
    })
    .catch(error => {
      console.error('Error:', error)
    })
})

const testUser = document.querySelector('#test-user')

testUser.addEventListener('change', () => {
  if (testUser.checked == true) {
    emailInput.value = 'tester2@example.com'
    passwordInput.value = 'tester2'
  } else {
    emailInput.value = ''
    passwordInput.value = ''
  }
})
