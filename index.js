let test

let basketItems = []
let total = 0


async function getProducts() {
    try {
        let productsJSON = await fetch("http://localhost:3003/products/")
        let productsList = await productsJSON.json()
        // productsList.shift()
        console.log(productsList)
        let brandList = getBrands(productsList)
        createSections(brandList)
        appendCards(productsList)

    } catch (e) {
        console.log(e)
        alert(e)
    }
}

window.onload = () => {
    getProducts()

}
function createSections(brands) {
    removeSpinner()
    let hero = document.querySelector('.jumbotron.hero')
    brands.forEach(brand => {
        let newSection = document.createElement('section')
        newSection.classList.add('container', 'brandSection', 'px-0')

        let sectionTitle = document.createElement('h2')
        sectionTitle.classList.add('row', 'mx-0')
        sectionTitle.innerText = brand
        newSection.appendChild(sectionTitle)

        let productDeck = document.createElement('div')
        productDeck.classList.add('row', 'productsDeck')
        productDeck.id = brand.toLowerCase()
        newSection.insertAdjacentElement('beforeend', productDeck)

        hero.insertAdjacentElement('afterend', newSection)
    });

}

function getBrands(data) {
    let brands = []
    data.filter(product => {
        if (brands.includes(product.brand) === false)
            brands.push(product.brand)
    })
    return brands
}

function generateCards(product) {
    return `
        <div class="card mb-4 py-4 col-4">
            <a href="productDetails.html?prod_Id=${product._id}">
                <img src="${product.imageUrl}" class="card-img-top img-fluid" alt="...">
                <span class="badge badge-warning">£ ${product.price}</span>
                <div class="card-body p-0 mt-3">
                    <h5 class="card-title text-truncate">${product.name}</h5>
                    <p class="card-text">${product.description}</p>
                </div>
            </a>
            <a onclick="addToCart(event)" value="${product._id}" class="btn btn-primary mt-4 buyNowBtn">Buy now</a>
            <a href="./back-office.html?prod_Id=${product._id}" class="mt-3"> Edit</a>
        </div>
    `
}

function appendCards(products) {
    products.forEach(product => {

        let sectionToInsert = document.querySelector(`#${product.brand.toLowerCase()}`)

        sectionToInsert.insertAdjacentHTML('beforeend', `${generateCards(product)}`)
    })
}

async function addToCart(e) {
    let prod_Id = e.target.getAttribute('value')
    let basketDeck = document.querySelector('.basketDeck')
    let product = await getProduct(prod_Id)
    total = total + product.price

    // Add to basket Array
    basketItems.push(product)

    // Update total Price
    updateTotalPrice(total)
    basketDeck.insertAdjacentHTML('beforeend', `${createCartItemHTML(product)}`)


    // Add to local storage
    localStorage.setItem('basketTotal', `${total}`)
    localStorage.setItem('basket', `${JSON.stringify([...basketItems])}`)
}

function createCartItemHTML(product) {
    return `
    <li class="d-flex my-3 justify-content-between productItem">
        <div class="d-flex justify-content-between align-items-center">
            <p class="basketProdName text-truncate d-inline-block m-0">${product.name}</p>
            </div>
            
            
        <div class="d-flex justify-content-end align-items-center">
            <span class="pl-2">£ ${product.price}</span>
            <button class="removeBtn d-flex justify-content-center align-items-center" value="${product._id}" onclick="removeFromCart(event)">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path
                d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 13h-12v-2h12v2z" />
                </svg> 
            </button>
       </div>
    </li>
    `
}

async function getProduct(prod_Id) {
    try {
        let productsJSON = await fetch("http://localhost:3003/products/" + prod_Id)
        let product = await productsJSON.json()
        return product
    } catch (e) {
        console.log(e)
        alert(e)
    }
}

function removeFromCart(e) {
    let itemId = e.target.closest('.removeBtn').getAttribute('value')
    basketItems.forEach((product, index) => {
        if (product._id === itemId) {
            basketItems.splice(index, 1)
            total = total - product.price
            updateTotalPrice(total)
        }
    })
    e.target.closest(".productItem").remove()
}

function updateTotalPrice(total) {
    document.querySelector('#totalPrice').innerText = `£ ${total}`

}

function removeSpinner() {
    document.querySelector('#spinnerPac-man').remove()
}


