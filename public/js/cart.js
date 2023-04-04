document.querySelectorAll('.prod-sub-total').forEach(div => {
  const price = div.dataset.price
  const quantity = div.dataset.quantity
  const subTotal = quantity * price
  div.childNodes[1].append(subTotal)
})
