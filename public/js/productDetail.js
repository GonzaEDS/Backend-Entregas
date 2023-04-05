const socket = io()

const addToCart = document.querySelector('#addToCartBtn')

addToCart.addEventListener('click', event => {
  const code = event.target.dataSet.code
  socket.emit('PROD_TO_CART_CLI', code)
})
