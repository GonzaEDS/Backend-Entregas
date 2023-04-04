const socket = io()
// DOM VARS
const productsForm = document.getElementById('productsForm')
const deleteBtn = document.querySelectorAll('.delete-btn')
const tableBody = document.querySelector('#table-body')
const pageLinks = document.querySelectorAll('.page-link')
const availableSwitch = document.querySelector('#available-switch')

const categorySelect = document.querySelector('#category-select')
const priceSortSelect = document.querySelector('#sort-price-select')

deleteBtn.forEach(btn => {
  setDeleteEvent(btn)
})
// PAGE
pageLinks.forEach(pageLink => {
  pageLink.addEventListener('click', event => {
    activePageLink(event)
    filterAplied()
  })
})
// FILTERS
categorySelect.addEventListener('change', filterAplied)
priceSortSelect.addEventListener('change', filterAplied)
availableSwitch.addEventListener('change', filterAplied)

// SERVER RESPONSE
socket.on('SERVER_PRODUCTS', products => {
  renderTable(products)
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
  console.log(product)
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

// AUX
function filterAplied() {
  const params = getParamsObj()
  socket.emit('FILTER_APLIED_CLI', params)
}

function getParamsObj() {
  const sort = priceSortSelect.value || ''
  const category = categorySelect.value || ''
  const page = document.querySelector('.active > .page-link').dataset.page
  let status = availableSwitch.checked || undefined

  const params = {
    category,
    page,
    sort,
    status,
    limit: 10
  }
  return params
}

function renderTable(products) {
  tableBody.innerHTML = ''

  if (products.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="5">No products found</td></tr>'
    return
  }

  products.forEach(product => {
    const row = `
      <tr>
        <td>${product.title}</td>
        <td id="description" class="d-none d-md-table-cell">${product.description}</td>
        <td>$${product.price}</td>
        <td><img src="${product.thumbnail}" alt="${product.title} icon" /></td>
        <td data-code="${product.code}" class="delete-btn"><i class="fa-solid fa-trash-can"></i></td>
      </tr>
    `
    tableBody.insertAdjacentHTML('beforeend', row)
  })
  document.querySelectorAll('.delete-btn').forEach(btn => {
    setDeleteEvent(btn)
  })
}

function activePageLink(event) {
  document.querySelectorAll('.page-item').forEach(item => {
    item.classList.remove('active')
  })
  event.target.parentNode.classList.add('active')
}

function setDeleteEvent(btn) {
  btn.addEventListener('click', e => {
    console.log('node', e.target)
    const code = e.target.parentNode.getAttribute('data-code')
    e.currentTarget.parentNode.remove()
    socket.emit('DELET_CLI', code)
  })
}
