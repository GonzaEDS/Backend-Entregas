const logoutBtn = document.querySelector('#logout-btn')

logoutBtn.addEventListener('click', () => {
  fetch(`/api/users/logout`, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer' // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  }).then(() => {
    const currentUrl = window.location.href
    const root = currentUrl.split('/')[2]
    window.location.href = `http://${root}/products`
  })
})