const socket = io({ withCredentials: true })

document.querySelectorAll('.prod-sub-total').forEach(div => {
  const price = div.dataset.price
  const quantity = div.dataset.quantity
  const subTotal = (quantity * price).toFixed(2)
  div.childNodes[1].append(subTotal)
})

const updateProductSubtotal = (quantityElem, priceNum, subTotalElem) => {
  const quantity = parseInt(quantityElem.value, 10)
  const newSubTotal = (quantity * priceNum).toFixed(2)
  subTotalElem.firstChild.nextElementSibling.innerHTML = newSubTotal
}

const updateTotal = (oldSubTotal, newSubTotal) => {
  const total = document.querySelector('#total-text')
  const prevTotal = parseFloat(total.innerHTML.substring(1))
  total.innerHTML = `$${(prevTotal - oldSubTotal + newSubTotal).toFixed(2)}`
}

// Quantity buttons
const updateQtyInput = (event, operation) => {
  const qtyInput =
    operation === 'add'
      ? event.target.previousElementSibling
      : event.target.nextElementSibling

  const newQty =
    operation === 'add'
      ? Number(qtyInput.value) + 1
      : Number(qtyInput.value) - 1
  if (newQty >= 1) {
    qtyInput.value = newQty
    qtyInput.dispatchEvent(new Event('change'))
  }
}

const setupListeners = () => {
  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', event => {
      const total = document.querySelector('#total-text')
      const totalNum = parseFloat(total.innerHTML.substring(1))
      const subTotal = parseFloat(
        event.currentTarget.parentNode.previousElementSibling.dataset.price
      )
      const newTotal = totalNum - subTotal
      const prodId = btn.dataset.prodId
      const cartId = document.querySelector('.cart-table').dataset.cartId

      fetch(`/api/carts/${cartId}/products/${prodId}`, {
        method: 'DELETE',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
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

  document.querySelectorAll('.minus-btn').forEach(btn => {
    btn.addEventListener('click', event => updateQtyInput(event, 'subtract'))
  })

  document.querySelectorAll('.plus-btn').forEach(btn => {
    btn.addEventListener('click', event => updateQtyInput(event, 'add'))
  })

  document.querySelectorAll('.qty-input').forEach(input => {
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
      const oldSubTotal = parseFloat(
        subTotalElem.firstChild.nextElementSibling.innerHTML
      )

      updateProductSubtotal(quantityElem, priceNum, subTotalElem)
      const newSubTotal = parseFloat(
        subTotalElem.firstChild.nextElementSibling.innerHTML
      )
      updateTotal(oldSubTotal, newSubTotal)
    })
  })
}

setupListeners()
