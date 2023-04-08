const socket = io({
  withCredentials: true
})

document.querySelectorAll('.prod-sub-total').forEach(div => {
  const price = div.dataset.price
  const quantity = div.dataset.quantity
  const subTotal = quantity * price
  div.childNodes[1].append(subTotal)
})

document.querySelectorAll('.remove-btn').forEach(btn => {
  btn.addEventListener('click', event => {
    const total = document.querySelector('#total-text')
    const totalNum = parseFloat(total.innerHTML.substring(1))
    const subTotal =
      event.target.parentNode.previousElementSibling.dataset.price
    console.log(total, totalNum, subTotal)
    const newTotal = totalNum - subTotal
    const prodId = btn.dataset.prodId
    const cartId = document.querySelector('.cart-table').dataset.cartId
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
      total.innerHTML = `$${newTotal}`
    })
  })
})

// Quantity buttons
// const qtyInput = document.querySelectorAll('.qty-input')
const minusBtn = document.querySelectorAll('.minus-btn').forEach(btn => {
  btn.addEventListener('click', event => {
    const qtyInput = event.target.nextElementSibling
    if (qtyInput.value > 1) {
      qtyInput.value = Number(qtyInput.value) - 1
      qtyInput.dispatchEvent(new Event('change')) // trigger change event
    }
  })
})

const plusBtn = document.querySelectorAll('.plus-btn').forEach(btn => {
  btn.addEventListener('click', event => {
    const qtyInput = event.target.previousElementSibling
    if (qtyInput.value > 0) {
      qtyInput.value = Number(qtyInput.value) + 1
      qtyInput.dispatchEvent(new Event('change')) // trigger change event
    }
  })
})

const qtyInput = document.querySelectorAll('.qty-input')

qtyInput.forEach(input => {
  input.addEventListener('change', event => {
    const quantityElem = event.target
    const prodId =
      quantityElem.parentNode.parentNode.parentNode.dataset.productId

    console.log(prodId)
    const quantity = quantityElem.value
    socket.emit('UPDATE_QUANTITY_SERVER', { prodId, quantity })

    const priceNum = parseFloat(
      quantityElem.parentNode.parentNode.previousElementSibling.innerHTML.substring(
        1
      )
    )
    const subTotalElem = quantityElem.parentNode.parentNode.nextElementSibling

    const subTotalNum = parseFloat(
      subTotalElem.firstChild.nextElementSibling.innerHTML
    )

    const total = document.querySelector('#total-text')
    const prevTotal =
      parseFloat(total.innerHTML.substring(1)) -
      parseFloat(subTotalElem.firstChild.nextElementSibling.innerHTML)
    console.log(
      `prevTotal = ${parseFloat(total.innerHTML.substring(1))} - ${parseFloat(
        subTotalElem.firstChild.nextElementSibling.innerHTML
      )}`
    )

    subTotalElem.firstChild.nextElementSibling.innerHTML = `${(
      quantityElem.value * priceNum
    ).toFixed(2)}`

    total.innerHTML = `$${(
      prevTotal +
      parseFloat(subTotalElem.firstChild.nextElementSibling.innerHTML)
    ).toFixed(2)}`
  })
})
