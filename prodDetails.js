const END_POINT = "https://striveschool-api.herokuapp.com/api/product/"
const headers = new Headers({
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MGRjNWYwNmIzNTgxNzAwMTVjMjI3MDUiLCJpYXQiOjE2MjUwNTQ5ODIsImV4cCI6MTYyNjI2NDU4Mn0.JwwVnNEQqYHceQ2fscSxdyITJxc4U7GeQFaHsd0Vs0Y",
    "Content-Type": "application/json",
})

let windowStorage = window.localStorage


window.onload = () => {
    let prodId = new URLSearchParams(window.location.search).get('prod_Id')
    getProduct(prodId)
    getFromStorage()
}


async function getProduct(prod_Id) {
    try {
        removeSpinner()
        let productsJSON = await fetch(END_POINT + prod_Id, {headers})
        let product = await productsJSON.json()
        console.log(product)

        document.querySelector('.jumbotron.hero').insertAdjacentHTML('afterend', `<div class="row prodDetails justify-content-center flex-column align-items-center"> <h2>${product.name}</h2></div>`)
        document.querySelector('.prodDetails').insertAdjacentHTML('beforeend',`${generateCard(product)}`)
        return product
    } catch (e) {
        console.log(e)
        alert(e)
    }
}

function removeSpinner(){
    document.querySelector('#spinnerPac-man').remove()
}



function generateCard(product){
    return`
        <div class="card mb-4 col-4">
            <a href="productDetails.html?prod_Id=${product._id}">
                <img src="${product.imageUrl}" class="card-img-top img-fluid" alt="...">
                <span class="badge badge-warning">£ ${product.price}</span>
                <div class="card-body p-0 mt-3">
                    <h5 class="card-title text-truncate">${product.name}</h5>
                    <p class="card-text">${product.description}</p>
                </div>
            </a>
            <a onclick="addToCart(event)" value="${product._id}" class="btn btn-primary mt-4">Buy now</a>
            <a href="./back-office.html?prod_Id=${product._id}" class="mt-3"> Edit</a>
        </div>
    `
}

function getFromStorage(){
    let total = localStorage.getItem('basketTotal')
    let basket = JSON.parse(localStorage.getItem('basket'))

    updateCart(total, basket)

}



function updateCart(total, basket){
    document.querySelector('#totalPrice').innerText = `£ ${total}`
    let basketDeck = document.querySelector('.basketDeck')
  

    basket.forEach(item => basketDeck.insertAdjacentHTML('beforeend', `${createCartItemHTML(item)}`))
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