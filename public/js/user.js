const logoutBtn = document.querySelector('#logout-btn')

logoutBtn.addEventListener('click', async () => {
  await logout()
  const currentUrl = window.location.href
  const root = currentUrl.split('/')[2]
  window.location.href = `http://${root}`
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
    req.logger.error('Error logging out:', error)
  }
}
