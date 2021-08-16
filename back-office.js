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
        price: document.getElementById('prod_price').value,
        category: document.getElementById('prod_category').value
    }
    let productStringified = JSON.stringify(product)
    return productStringified
}
function getProductImage() {
    let productFile = new FormData()
    let imageUrlFile= document.getElementById('prod_img').files[0]
    productFile.append("imageUrl",imageUrlFile)
    return productFile
}

async function insertProduct(e) {
    formValidation()
    try {
        e.preventDefault()
        if (method === "POST") {

            let product = getProducts()
            let serverRes = await fetch("http://localhost:3003/products/", {
                method: method,
                body: product,
                headers: {
                    "Content-Type": "application/json",
                }
            })
            let serverData = await serverRes.json()

            console.log(serverData.id)
            let productImage = getProductImage()
            let uploadImage= await fetch("http://localhost:3003/products/"+serverData.id+"/upload", {
                method: method,
                body: productImage
            })
            let serverDataImage = await uploadImage.json()
            console.log(serverData)
            document.querySelector('form').reset()
            showAlert('success', `${serverData.id} added successfully`)
            return
        }

        if (method === "PUT") {
            let product = getProducts()
            let serverRes = await fetch("http://localhost:3003/products/" + prodId, {
                method: method,
                body: product,
                headers: {
                    "Content-Type": "application/json",
                }
            })
            let serverData = await serverRes.json()
            console.log(serverData)
            if(document.getElementById('prod_img').files[0]){
                let productImage = getProductImage()
                let uploadImage= await fetch("http://localhost:3003/products/"+serverData._id+"/upload", {
                    method: "POST",
                    body: productImage
                })
                let serverDataImage = await uploadImage.json()
                console.log(serverDataImage)
            }
            showAlert('success', `${serverData.name} edited successfully`)
            
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
    let serverRes = await fetch("http://localhost:3003/products/" + prodId, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })
    let serverData = await serverRes.json()
    console.log(serverData)
    document.getElementById('prod_name').value = serverData.name
    document.getElementById('prod_descr').value = serverData.description
    document.getElementById('prod_brand').value = serverData.brand
    document.getElementById('prod_price').value = serverData.price
    document.getElementById('prod_category').value = serverData.category
}

async function deleteProd(e){
    try{

        e.preventDefault()
        
        serverRes = await fetch("http://localhost:3003/products/" + prodId, {
            method: "DELETE"
        })
       // let serverData = await serverRes.json()
       // console.log(serverData)
        showAlert('success', `Product deleted successfully`)
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
