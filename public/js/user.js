const logoutBtn = document.querySelector('#logout-btn')

logoutBtn.addEventListener('click', () => {
  logout()
})

//new logout

async function logout() {
  try {
    await fetch('/api/users/logout', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    console.error('Error logging out:', error)
  }
}
