const socket = io()

const addToCart = document.querySelector('#addToCartBtn')

addToCart.addEventListener('click', event => {
  console.log(event.target)
  const code = event.target.dataset.code
  console.log('addToCart Socket')
  socket.emit('PROD_TO_CART_CLI', code)
})

socket.on('PROD_TO_CART_SERVER', prod => {
  console.log(prod)
  const currentUrl = window.location.href
  const root = currentUrl.split('/')[2]
  console.log(root)
  // const redirectUrl = `${currentUrl}/${code}`
  // window.location.href = `http:${root}/cart/${prod}`
  const url = `http:${root}/cart/${prod}`

  fetch(`/cart/${prod}`, {
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
    window.location.href = `http://${root}/cart`
  })
})

socket.on('PROD_TO_CART_UNAUTHORIZED_SERVER', res => {
  console.log(res)
})
