// --- VARIABLES GLOBALES ---

let products = [];
let currentView = 'menu-view';
let nextId = 1;

// --- UTILERÍA DE NAVEGACIÓN ---

function showView(viewId) {
    document.getElementById(currentView).classList.add('hidden');
    document.getElementById(viewId).classList.remove('hidden');
    currentView = viewId;
}

// --- MANEJO DE VISTAS Y BOTONES ---

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

// --- FUNCIONALIDAD: AGREGAR PRODUCTO ---

document.getElementById('add-product-form').addEventListener('submit', addProduct);

function addProduct(event) {
    event.preventDefault();

    const name = document.getElementById('product-name').value.trim();
    const type = document.getElementById('product-type').value;
    const price = document.getElementById('product-price').value;
    const quantity = document.getElementById('product-quantity').value;

    // REQUISITO 1: VALIDAR TODOS LOS CAMPOS
    if (!name || !type || !price || !quantity) {
        alert('Debes completar todos los campos');
        return;
    }

    const numericPrice = parseFloat(price);
    const numericQuantity = parseInt(quantity);

    // REQUISITO 2: VALIDAR QUE PRECIO Y CANTIDAD SEAN NÚMEROS POSITIVOS (>= 1)
    if (isNaN(numericPrice) || numericPrice < 1 || isNaN(numericQuantity) || numericQuantity < 1) {
        alert('El Precio y la Cantidad inicial deben ser números válidos y mayores o iguales a 1');
        return;
    }

    // REQUISITO 3: CREAR ID ÚNICO
    const newProduct = {
        id: nextId++,
        name: name,
        type: type,
        price: numericPrice,
        quantity: numericQuantity
    };

    products.push(newProduct);

    // Redirección al stock sin mensaje (REQUISITO)
    document.getElementById('add-product-form').reset();
    renderStock();
    showView('stock-view');
}

// --- FUNCIONALIDAD: MOSTRAR Y ACTUALIZAR STOCK ---

function renderStock() {
    const stockList = document.getElementById('stock-list');
    stockList.innerHTML = '';

    products.forEach(product => {
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
    });
}

document.getElementById('btn-update-stock').addEventListener('click', updateStock);

function updateStock() {
    let hasChanges = false;
    const quantityInputs = document.querySelectorAll('#stock-table input[type="number"]');

    quantityInputs.forEach(input => {
        const productId = parseInt(input.dataset.id);
        const newQuantity = parseInt(input.value);

        // Buscar el producto en el array
        const productIndex = products.findIndex(p => p.id === productId);

        if (productIndex !== -1 && products[productIndex].quantity !== newQuantity) {
            products[productIndex].quantity = newQuantity;
            hasChanges = true;
        }
    });

    if (hasChanges) {
        alert('Stock actualizado correctamente.');
    } else {
        alert('No se detectaron cambios en el stock.');
    }

    // Vuelve a renderizar la tabla para actualizar el color rojo si cambió el stock bajo
    renderStock();
}

// Inicialización: Mostrar el menú al cargar
showView('menu-view');