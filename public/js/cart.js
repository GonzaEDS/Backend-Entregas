const socket = io({
  withCredentials: true
})

document.querySelectorAll('.prod-sub-total').forEach(div => {
  const price = div.dataset.price
  const quantity = div.dataset.quantity
  const subTotal = (quantity * price).toFixed(2)
  div.childNodes[1].append(subTotal)
})

// Remove buttons
document.querySelectorAll('.remove-btn').forEach(btn => {
  btn.addEventListener('click', event => {
    const total = document.querySelector('#total-text')
    const totalNum = parseFloat(total.innerHTML.substring(1))
    const subTotal =
      event.currentTarget.parentNode.previousElementSibling.dataset.price
    const newTotal = totalNum - subTotal
    const prodId = btn.dataset.prodId
    const cartId = document.querySelector('.cart-table').dataset.cartId
    fetch(`/api/carts/${cartId}/products/${prodId}`, {
      method: 'DELETE',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer'
    }).then(() => {
      btn.parentNode.parentNode.remove()
      if (newTotal > 0) {
        total.innerHTML = `$${newTotal}`
      } else {
        document.querySelector('.cart-total').remove()
        document.querySelector('tbody').innerHTML = `<tr>
        <td colspan='5'>
          <div class='alert alert-danger' role='alert'>
            Your cart is empty
          </div>
        </td>
      </tr>`
      }
    })
  })
})

// Quantity buttons
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
    // console.log(
    //   `prevTotal = ${parseFloat(total.innerHTML.substring(1))} - ${parseFloat(
    //     subTotalElem.firstChild.nextElementSibling.innerHTML
    //   )}`
    // )

    subTotalElem.firstChild.nextElementSibling.innerHTML = `${(
      quantityElem.value * priceNum
    ).toFixed(2)}`

    total.innerHTML = `$${(
      prevTotal +
      parseFloat(subTotalElem.firstChild.nextElementSibling.innerHTML)
    ).toFixed(2)}`
  })
})
