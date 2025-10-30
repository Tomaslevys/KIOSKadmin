//variables

let products = [];
let currentView = 'menu-view';
let nextId = 1;

//navegacion

function showView(viewId) {
    document.getElementById(currentView).classList.add('hidden');
    document.getElementById(viewId).classList.remove('hidden');
    currentView = viewId;
}

//botones

document.getElementById('btn-show-add').addEventListener('click', () => {
    showView('add-product-view');
});

document.getElementById('btn-show-stock').addEventListener('click', () => {
    renderStock();
    showView('stock-view');
});

document.getElementById('btn-back-from-add').addEventListener('click', () => {
    showView('menu-view');
});

document.getElementById('btn-back-from-stock').addEventListener('click', () => {
    showView('menu-view');
});

//agregar producto

document.getElementById('add-product-form').addEventListener('submit', addProduct);

function addProduct(event) {
    event.preventDefault();

    const name = document.getElementById('product-name').value.trim();
    const type = document.getElementById('product-type').value;
    const price = document.getElementById('product-price').value;
    const quantity = document.getElementById('product-quantity').value;

    //validacion campos
    if (!name || !type || !price || !quantity) {
        alert('Debes completar todos los campos');
        return;
    }

    const numericPrice = parseFloat(price);
    const numericQuantity = parseInt(quantity);

    //validacion numero precios
    if (isNaN(numericPrice) || numericPrice < 1 || isNaN(numericQuantity) || numericQuantity < 1) {
        alert('El Precio y la Cantidad inicial deben ser números válidos y mayores o iguales a 1');
        return;
    }

    //id
    const newProduct = {
        id: nextId++,
        name: name,
        type: type,
        price: numericPrice,
        quantity: numericQuantity
    };

    products.push(newProduct);

    //volver
    document.getElementById('add-product-form').reset();
    renderStock();
    showView('stock-view');
}

//mostrar y actualizar stock

function renderStock() {
    const stockList = document.getElementById('stock-list');
    stockList.innerHTML = '';

    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        
        const row = document.createElement('tr');
        row.dataset.productId = product.id;

        const quantityClass = product.quantity < 5 ? 'low-stock' : '';

        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.type}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>
                <input type="number" min="0" value="${product.quantity}" class="${quantityClass}" data-id="${product.id}">
            </td>
        `;
        stockList.appendChild(row);
    }
}

document.getElementById('btn-update-stock').addEventListener('click', updateStock);

function updateStock() {
    let hasChanges = false;
    const quantityInputs = document.querySelectorAll('#stock-table input[type="number"]');

    // Bucle para revisar cada campo de cantidad que el usuario puede haber modificado
    for (let j = 0; j < quantityInputs.length; j++) {
        const input = quantityInputs[j];
        const productId = parseInt(input.dataset.id);
        const newQuantity = parseInt(input.value);

        
        for (let k = 0; k < products.length; k++) {
            const productInArray = products[k];

            if (productInArray.id === productId) {
                
                if (productInArray.quantity !== newQuantity) {
                    productInArray.quantity = newQuantity;
                    hasChanges = true;
                }
                break; 
            }
        }
    }

    if (hasChanges) {
        alert('Stock actualizado correctamente.');
    } else {
        alert('No se detectaron cambios en el stock.');
    }

    // cambia color stock a rojo
    renderStock();
}

// inicializacion menu
showView('menu-view');