// DOM variables and constants
const productsForm = document.getElementById('productsForm')
const deleteBtn = document.querySelectorAll('.delete-btn')
const tableBody = document.querySelector('#table-body')
const pageLinks = document.querySelectorAll('.page-link')
const availableSwitch = document.querySelector('#available-switch')

const categorySelect = document.querySelector('#category-select')
const priceSortSelect = document.querySelector('#sort-price-select')
const productsContainer = document.querySelector('.row')
const pageNavigation = document.querySelector('#page-navigation .pagination')

// Set event listeners
categorySelect.addEventListener('change', () => filterApplied(true))
priceSortSelect.addEventListener('change', filterApplied)
availableSwitch.addEventListener('change', filterApplied)

// Set page link events
setPageLinksEvents(pageLinks)

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

socket.on('SERVER_PRODUCTS', data => {
  renderCards(data.prods)
  document.querySelector('.spinner').style.display = 'none'
  renderPagination(data.paginationOptions)
})

function renderCards(products) {
  productsContainer.innerHTML = ''

  if (products.length === 0) {
    productsContainer.innerHTML =
      '<div class="col"><p class="text-center">No products found</p></div>'
    return
  }

  products.forEach(product => {
    const card = `<div class="col">
    <div class="card card-product d-flex flex-column h-100">
        <div class="card-image">
            <img src="${product.thumbnail}" class="card-img-top" alt="${product.title} icon">
        </div>
      
      <div class="card-body flex-fill">
        <h5 class="card-title">${product.title}</h5>
        <p class="card-text">$${product.price}</p>
        <div class="d-flex justify-content-between align-items-center">
          <div class="btn-group" data-code="${product.code}">
            <button type="button" class="btn btn-sm btn-outline-secondary detail-btn">View</button>
            <button type="button" class="btn btn-sm btn-outline-secondary">Add to cart</button>
          </div>
        </div>
      </div>
    </div>
  </div>`
    productsContainer.insertAdjacentHTML('beforeend', card)
    linkToDetails()
  })
}

function linkToDetails() {
  const detailBtn = document.querySelectorAll('.detail-btn')
  detailBtn.forEach(btn => {
    btn.addEventListener('click', event => {
      document.querySelector('.spinner').style.display = 'block'
      const code = event.target.parentNode.dataset.code
      const currentUrl = window.location.href
      const redirectUrl = `${currentUrl}/${code}`
      window.location.href = redirectUrl
    })
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

document.addEventListener('DOMContentLoaded', () => {
  linkToDetails()
})
