document.querySelectorAll('.prod-sub-total').forEach(div => {
  const price = div.dataset.price
  const quantity = div.dataset.quantity
  const subTotal = quantity * price
  div.childNodes[1].append(subTotal)
})

document.querySelectorAll('.remove-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const prodId = btn.dataset.prodId
    const cartId = document.querySelector('.cart-table').dataset.cartId
    console.log(prodId, cartId)
    fetch(`/api/carts/${cartId}/products/${prodId}`, {
      method: 'DELETE',
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer' // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    }).then(() => {
      btn.parentNode.parentNode.remove()
    })
  })
})
