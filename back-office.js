/**
 *   a) Add a button and the functionality to EDIT a single product ( PUT  endpoint/{id})
                b) Add a button and the functionality to DELETE a single product ( DELETE endpoint/{id})
                c) Add validation to the product creation/edit form
                d) Display an error message if something goes wrong
 */
let method
let prodId

let test


function getProducts() {
    let product = {
        name: document.getElementById('prod_name').value,
        description: document.getElementById('prod_descr').value,
        brand: document.getElementById('prod_brand').value,
        imageUrl: document.getElementById('prod_img').value,
        price: document.getElementById('prod_price').value
    }
    let productStringified = JSON.stringify(product)
    return productStringified

}





async function insertProduct(e) {
    formValidation()
    try {
        e.preventDefault()
        if (method === "POST") {

            let product = getProducts()
            let serverRes = await fetch("https://striveschool-api.herokuapp.com/api/product/", {
                method: method,
                body: product,
                headers: {
                    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MGRjNWYwNmIzNTgxNzAwMTVjMjI3MDUiLCJpYXQiOjE2MjUwNTQ5ODIsImV4cCI6MTYyNjI2NDU4Mn0.JwwVnNEQqYHceQ2fscSxdyITJxc4U7GeQFaHsd0Vs0Y",
                    "Content-Type": "application/json",
                }
            })
            let serverData = await serverRes.json()
            console.log(serverData)
            document.querySelector('form').reset()
            showAlert('success', `${product.name} added successfully`)
            return
        }

        if (method === "PUT") {
            let product = getProducts()
            let serverRes = await fetch("https://striveschool-api.herokuapp.com/api/product/" + prodId, {
                method: method,
                body: product,
                headers: {
                    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MGRjNWYwNmIzNTgxNzAwMTVjMjI3MDUiLCJpYXQiOjE2MjUwNTQ5ODIsImV4cCI6MTYyNjI2NDU4Mn0.JwwVnNEQqYHceQ2fscSxdyITJxc4U7GeQFaHsd0Vs0Y",
                    "Content-Type": "application/json",
                }
            })
            let serverData = await serverRes.json()
            console.log(serverData)
            showAlert('success', `${product.name} edited successfully`)
            
        }
    } catch (e) {
        showAlert('danger', `${e}`)
    }

}

window.onload = () => {
    prodId = new URLSearchParams(window.location.search).get('prod_Id')
    method = prodId ? "PUT" : "POST"

    if (prodId) {
        document.querySelector('#send_btn').value = 'Edit Product'
        document.querySelector('h3').innerText = 'Edit Product'
        console.log(prodId)
        generatePlaceholder(prodId)
    }

}

async function generatePlaceholder(prodId) {
    let serverRes = await fetch("https://striveschool-api.herokuapp.com/api/product/" + prodId, {
        method: "GET",
        headers: {
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MGRjNWYwNmIzNTgxNzAwMTVjMjI3MDUiLCJpYXQiOjE2MjUwNTQ5ODIsImV4cCI6MTYyNjI2NDU4Mn0.JwwVnNEQqYHceQ2fscSxdyITJxc4U7GeQFaHsd0Vs0Y",
            "Content-Type": "application/json",
        }
    })
    let serverData = await serverRes.json()

    document.getElementById('prod_name').value = serverData.name
    document.getElementById('prod_descr').value = serverData.description
    document.getElementById('prod_brand').value = serverData.brand
    document.getElementById('prod_img').value = serverData.imageUrl
    document.getElementById('prod_price').value = serverData.price
}

async function deleteProd(e){
    try{

        e.preventDefault()
        
        serverRes = await fetch("https://striveschool-api.herokuapp.com/api/product/" + prodId, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MGRjNWYwNmIzNTgxNzAwMTVjMjI3MDUiLCJpYXQiOjE2MjUwNTQ5ODIsImV4cCI6MTYyNjI2NDU4Mn0.JwwVnNEQqYHceQ2fscSxdyITJxc4U7GeQFaHsd0Vs0Y",
                "Content-Type": "application/json",
            }
        })
        let serverData = await serverRes.json()
        console.log(serverData)
        showAlert('success', `Product deleted successfully`)
        // window.location.replace(`index.html`)
        return
    } catch (err) {
        showAlert('danger', `${err} not deleted.`)
    }
}

function formValidation(){
    
    let prod_name = document.getElementById('prod_name')
    let prod_descr = document.getElementById('prod_descr')
    let prod_brand = document.getElementById('prod_brand')
    let prod_img = document.getElementById('prod_img')
    let prod_price = document.getElementById('prod_price')
    
    if(prod_name.value === ''){
        prod_name.classList.add('border-danger')
    } else {
        prod_name.classList.remove('border-danger')
    }
   

    if(prod_descr.value === ''){
        prod_descr.classList.add('border-danger')
    } else {
        prod_descr.classList.remove('border-danger')
    }
   

    if(prod_brand.value === ''){
        prod_brand.classList.add('border-danger')
    } else {
        prod_brand.classList.remove('border-danger')
    }

    if(prod_img.value === ''){
        prod_img.classList.add('border-danger')
    } else {
        prod_img.classList.remove('border-danger')
    }

    if(prod_price.value === ''){
        prod_price.classList.add('border-danger')

    } else {
        prod_price.classList.remove('border-danger')
    }
   
    
}

function showAlert(type, msn){

    let body = document.querySelector('body')
    body.insertAdjacentHTML('afterbegin',`
        <div class="alert alert-${type}" role="alert">
             ${msn}
        </div>
    
    `)

    setTimeout( () => document.querySelector('div.alert').remove(), 3000    )
}
