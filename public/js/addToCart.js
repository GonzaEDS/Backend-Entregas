const socket = io()

window.addEventListener('pageshow', () => {
  const spinner = document.querySelector('.spinner')
  spinner.style.display = 'none'
})

const addToCart = document.querySelectorAll('.addToCartBtn')

addToCart.forEach(btn => {
  btn.addEventListener('click', event => {
    document.querySelector('.spinner').style.display = 'block'
    const code = event.target.dataset.code
    socket.emit('PROD_TO_CART_CLI', code)
  })
})

socket.on('PROD_TO_CART_SERVER', prod => {
  try {
    fetch(`/cart/${prod}`, {
      method: 'POST',
      mode: 'same-origin',
      cache: 'no-cache',
      credentials: 'same-origin', // This will include the cookies with the request
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer'
    }).then(() => {
      const currentUrl = window.location.href
      const root = currentUrl.split('/')[2]
      window.location.href = `http://${root}/cart`
    })
  } catch (error) {
    console.error('addToCart.js', error.message)
  }
})
