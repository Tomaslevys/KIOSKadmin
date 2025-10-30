//variables

let products = [];
let pantallaActual = 'vistaMenu';
let proximoId = 1;

//navegacion

function mostrarPantalla(viewId) {
    document.getElementById(pantallaActual).classList.add('hidden');
    document.getElementById(viewId).classList.remove('hidden');
    pantallaActual = viewId;
}

//botones

document.getElementById('btn-show-add').addEventListener('click', () => {
    mostrarPantalla('vistaAgregarProducto');
});

document.getElementById('btn-show-stock').addEventListener('click', () => {
    dibujarTabla();
    mostrarPantalla('vistaStockActual');
});

document.getElementById('btn-back-from-add').addEventListener('click', () => {
    mostrarPantalla('vistaMenu');
});

document.getElementById('btn-back-from-stock').addEventListener('click', () => {
    mostrarPantalla('vistaMenu');
});

//agregar producto

document.getElementById('add-product-form').addEventListener('submit', agregarProductoNuevo);

function agregarProductoNuevo(event) {
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
        id: proximoId++,
        name: name,
        type: type,
        price: numericPrice,
        quantity: numericQuantity
    };

    products.push(newProduct);

    //volver
    document.getElementById('add-product-form').reset();
    dibujarTabla();
    mostrarPantalla('vistaStockActual');
}

//mostrar y actualizar stock

function dibujarTabla() {
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

document.getElementById('btn-update-stock').addEventListener('click', guardarCambiosStock);

function guardarCambiosStock() {
    let hasChanges = false;
    const quantityInputs = document.querySelectorAll('#stock-table input[type="number"]');

    
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
    dibujarTabla();
}

// inicializacion menu
mostrarPantalla('vistaMenu');