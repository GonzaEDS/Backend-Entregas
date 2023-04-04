const socket = io()

// DOM VARS
const productsForm = document.getElementById('productsForm')
const deleteBtn = document.querySelectorAll('.delete-btn')
const tableBody = document.querySelector('#table-body')
const pageLinks = document.querySelectorAll('.page-link')
const availableSwitch = document.querySelector('#available-switch')

const categorySelect = document.querySelector('#category-select')
const priceSortSelect = document.querySelector('#sort-price-select')

// DOM VARS
const productsContainer = document.querySelector('.row')

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
  renderCards(products)
})

// RENDERING ON SOCKET

// socket.on('NEW_PRODUCT_SERVER', newProduct => {
//   console.log('NEW_PRODUCT_SERVER')
//   const card = `
//     <div class="col">
//       <div class="card d-flex flex-column h-100">
//         <img src="${newProduct.thumbnail}" class="card-img-top" alt="${newProduct.title} icon">
//         <div class="card-body">
//           <h5 class="card-title">${newProduct.title}</h5>
//           <p class="card-text">${newProduct.description}</p>
//           <p class="card-text">$${newProduct.price}</p>
//         </div>
//         <div class="card-footer">
//           <button type="button" class="btn btn-danger delete-btn" data-code="${newProduct.code}">
//             <i class="fa-solid fa-trash-can"></i>
//           </button>
//         </div>
//       </div>
//     </div>
//   `
//   productsContainer.insertAdjacentHTML('beforeend', card)
// })

// LINK TO DETAILS
linkToDetails()
function linkToDetails() {
  const detailBtn = document.querySelectorAll('.detail-btn')

  detailBtn.forEach(btn => {
    btn.addEventListener('click', event => {
      const code = event.target.parentNode.dataset.code
      const currentUrl = window.location.href
      const redirectUrl = `${currentUrl}/${code}`
      window.location.href = redirectUrl
    })
  })
}

socket.on('TEST', test => {
  console.log(JSON.stringify(test))
})

// AUX
function activePageLink(event) {
  document.querySelectorAll('.page-item').forEach(item => {
    item.classList.remove('active')
  })
  event.target.parentNode.classList.add('active')
}
// Not needed for the card view

function renderCards(products) {
  productsContainer.innerHTML = ''

  if (products.length === 0) {
    productsContainer.innerHTML =
      '<div class="col"><p class="text-center">No products found</p></div>'
    return
  }

  products.forEach(product => {
    const card = `<div class="col">
    <div class="card d-flex flex-column h-100">
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
    limit: 9
  }
  return params
}
