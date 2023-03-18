const socket = io()

const productsForm = document.getElementById('productsForm')
const deleteBtn = document.querySelectorAll('.delete-btn')

function setDeleteEvent(btn) {
  btn.addEventListener('click', e => {
    console.log('node', e.target)
    const code = e.target.parentNode.getAttribute('data-code')
    e.currentTarget.parentNode.remove()
    socket.emit('DELET_CLI', code)
  })
}

deleteBtn.forEach(btn => {
  setDeleteEvent(btn)
})

productsForm.addEventListener('submit', e => {
  e.preventDefault()
  const priceValue = document.getElementById('price-input').value
  const nameValue = document.getElementById('name-input').value
  const descriptionValue = document.getElementById('description-input').value
  const thumbnailValue = document.getElementById('thumbnail-input').value
  const stockValue = document.getElementById('stock-input').value

  const product = {
    title: nameValue,
    description: descriptionValue,
    thumbnail: thumbnailValue,
    price: priceValue,
    stock: stockValue
  }
  socket.emit('NEW_PRODUCT_CLI', product)
  e.target.reset()
})

socket.on('NEW_PRODUCT_SERVER', newProduct => {
  console.log(newProduct)
  const tableBody = document.querySelector('#table-body')
  const newTr = document.createElement('tr')

  newTr.innerHTML = `<td>${newProduct.title}</td>
  <td id="description" class="d-none d-md-table-cell">${newProduct.description}</td>
  <td>$ ${newProduct.price}</td>
  <td>
    <img
      src="${newProduct.thumbnail}"
      alt="${newProduct.title} icon"
      width="100"
      height="100"
    />
  </td>
 
  `
  const deleteTd = document.createElement('td')
  deleteTd.setAttribute('data-code', newProduct.code)
  deleteTd.classList.add('delete-btn')
  deleteTd.innerHTML = '<i class="fa-solid fa-trash-can"></i>'
  newTr.appendChild(deleteTd)
  setDeleteEvent(deleteTd)

  tableBody.appendChild(newTr)
})

socket.on('TEST', test => {
  console.log(JSON.stringify(test))
})
