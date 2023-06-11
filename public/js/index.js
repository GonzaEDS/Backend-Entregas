// @ts-nocheck
const socket = io()
// DOM VARS
const productsForm = document.getElementById('productsForm')
const deleteBtn = document.querySelectorAll('.delete-btn')
const tableBody = document.querySelector('#table-body')
const pageLinks = document.querySelectorAll('.page-link')
const availableSwitch = document.querySelector('#available-switch')
const categorySelect = document.querySelector('#category-select')
const priceSortSelect = document.querySelector('#sort-price-select')
const pageNavigation = document.querySelector('#page-navigation .pagination')

// Set event listeners
categorySelect.addEventListener('change', () => filterApplied(true))
priceSortSelect.addEventListener('change', filterApplied)
availableSwitch.addEventListener('change', filterApplied)

// Set page link events
setPageLinksEvents(pageLinks)

deleteBtn.forEach(btn => {
  setDeleteEvent(btn)
})

// Functions
function setPageLinksEvents(links) {
  links.forEach(pageLink => {
    pageLink.addEventListener('click', event => {
      const currentPage = event.currentTarget.dataset.page
      document.querySelector('#page-navigation').dataset.currentPage =
        currentPage
      filterApplied()
    })
  })
}

function filterApplied(resetPage = false) {
  const params = getParamsObj()
  if (resetPage) {
    params.page = 1
  }
  socket.emit('FILTER_APLIED_CLI', params)
  document.querySelector('.spinner').style.display = 'block'
}

function getParamsObj() {
  const sort = priceSortSelect.value || ''
  const category = categorySelect.value || ''
  const page = document.querySelector('#page-navigation').dataset.currentPage
  const status = availableSwitch.checked || undefined

  const params = {
    category,
    page,
    sort,
    status,
    limit: 9
  }
  return params
}

// SERVER RESPONSE
socket.on('SERVER_PRODUCTS', data => {
  renderTable(data.prods)
  document.querySelector('.spinner').style.display = 'none'
  renderPagination(data.paginationOptions)
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
  </td>`
  const deleteTd = document.createElement('td')
  deleteTd.setAttribute('data-code', newProduct.code)
  deleteTd.classList.add('delete-btn')
  deleteTd.innerHTML = '<i class="fa-solid fa-trash-can"></i>'
  newTr.appendChild(deleteTd)
  setDeleteEvent(deleteTd)

  tableBody.appendChild(newTr)
})

function renderTable(products) {
  tableBody.innerHTML = ''

  if (products.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="5">No products found</td></tr>'
    return
  }

  products.forEach(product => {
    const row = `<tr> 
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
    const code = e.target.parentNode.getAttribute('data-code')
    e.currentTarget.parentNode.remove()
    socket.emit('DELET_CLI', code)
  })
}

function renderPagination(paginationOptions) {
  document.querySelector('#page-navigation').dataset.currentPage =
    paginationOptions.page

  if (paginationOptions.totalPages <= 1) {
    pageNavigation.style.display = 'none'
    return
  }

  pageNavigation.style.display = 'flex'
  pageNavigation.innerHTML = ''

  const createPaginationLi = (
    text,
    pageNumber,
    isActive = false,
    isDisabled = false
  ) => {
    const liClass = isActive
      ? 'page-item active'
      : isDisabled
      ? 'page-item disabled'
      : 'page-item'
    return `<li class='${liClass}'>
              <a class='page-link' data-page='${pageNumber}'>${text}</a>
            </li>`
  }

  const prevPageLi = paginationOptions.hasPrevPage
    ? createPaginationLi('Previous', paginationOptions.prevPage)
    : createPaginationLi('Previous', null, false, true)
  pageNavigation.innerHTML += prevPageLi

  for (let i = 0; i < paginationOptions.totalPages; i++) {
    const isActive = i + 1 === paginationOptions.page
    const paginationLi = createPaginationLi(i + 1, i + 1, isActive)
    pageNavigation.innerHTML += paginationLi
  }

  const nextPageLi = paginationOptions.hasNextPage
    ? createPaginationLi('Next', paginationOptions.nextPage)
    : createPaginationLi('Next', null, false, true)
  pageNavigation.innerHTML += nextPageLi

  const updatedPageLinks = document.querySelectorAll('.page-link')
  setPageLinksEvents(updatedPageLinks)
}

// Set the active page when first rendered
const currentPage = parseInt(
  document.querySelector('#page-navigation').dataset.currentPage
)

pageLinks.forEach(link => {
  const linkPage = parseInt(link.dataset.page)
  if (linkPage === currentPage) {
    link.parentNode.classList.add('active')
  } else {
    link.parentNode.classList.remove('active')
  }
})
