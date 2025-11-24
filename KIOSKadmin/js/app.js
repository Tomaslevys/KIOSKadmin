// frontend KIOSKadmin/js/app.js

let products = [];
let currentView = 'menu-view';

// URL base de la API (mismo ordenador)
const API_BASE = '/api/products';

// Navegacion
function showView(viewId) {
    document.getElementById(currentView).classList.add('hidden');
    document.getElementById(viewId).classList.remove('hidden');
    currentView = viewId;
}

// botones
document.getElementById('btn-show-add').addEventListener('click', () => {
    showView('add-product-view');
});

document.getElementById('btn-show-stock').addEventListener('click', async () => {
    await fetchProducts();
    renderStock();
    showView('stock-view');
});

document.getElementById('btn-back-from-add').addEventListener('click', () => {
    showView('menu-view');
});

document.getElementById('btn-back-from-stock').addEventListener('click', () => {
    showView('menu-view');
});

// FORM add
document.getElementById('add-product-form').addEventListener('submit', addProduct);

async function fetchProducts() {
    try {
        const res = await fetch(API_BASE);
        products = await res.json();
    } catch (err) {
        console.error(err);
        alert('Error al cargar productos desde el servidor');
    }
}

async function addProduct(event) {
    event.preventDefault();
    const name = document.getElementById('product-name').value.trim();
    const type = document.getElementById('product-type').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const quantity = parseInt(document.getElementById('product-quantity').value);

    if (!name || !type || isNaN(price) || isNaN(quantity) || price < 1 || quantity < 1) {
        alert('Completá todos los campos correctamente');
        return;
    }

    // enviar al backend
    try {
        const res = await fetch(API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, type, price, quantity })
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Error al crear producto');
        }
        document.getElementById('add-product-form').reset();
        await fetchProducts();
        renderStock();
        showView('stock-view');
    } catch (err) {
        console.error(err);
        alert('No se pudo crear el producto');
    }
}

// render y update
function renderStock() {
    const stockList = document.getElementById('stock-list');
    stockList.innerHTML = '';

    products.forEach(product => {
        const tr = document.createElement('tr');
        tr.dataset.productId = product.id;

        const lowClass = product.quantity < 5 ? 'low-stock' : '';

        tr.innerHTML = `
            <td>${product.name}</td>
            <td>${product.type}</td>
            <td>$${Number(product.price).toFixed(2)}</td>
            <td>
                <input type="number" min="0" value="${product.quantity}" data-id="${product.id}" class="${lowClass}">
            </td>
            <td>
                <button class="btn small delete-btn" data-id="${product.id}">Eliminar</button>
            </td>
        `;
        stockList.appendChild(tr);
    });

    // agregar listeners a botones eliminar y input change para cambiar clase visual
    document.querySelectorAll('#stock-list .delete-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = e.target.dataset.id;
            if (!confirm('¿Eliminar este producto?')) return;
            try {
                const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
                if (!res.ok) throw new Error('No se pudo eliminar');
                await fetchProducts();
                renderStock();
            } catch (err) {
                console.error(err);
                alert('Error al eliminar producto');
            }
        });
    });

    document.querySelectorAll('#stock-list input[type="number"]').forEach(input => {
        input.addEventListener('input', (e) => {
            const val = parseInt(e.target.value);
            if (isNaN(val)) return;
            if (val < 5) e.target.classList.add('low-stock');
            else e.target.classList.remove('low-stock');
        });
    });
}

document.getElementById('btn-update-stock').addEventListener('click', updateStock);

async function updateStock() {
    const inputs = document.querySelectorAll('#stock-list input[type="number"]');
    let anyChange = false;

    for (const input of inputs) {
        const id = input.dataset.id;
        const newQ = parseInt(input.value);
        const prod = products.find(p => p.id === id);
        if (!prod) continue;
        if (prod.quantity !== newQ) {
            // actualizar en backend
            try {
                const res = await fetch(`${API_BASE}/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ quantity: newQ })
                });
                if (!res.ok) {
                    console.error('Error actualizando', id);
                } else {
                    anyChange = true;
                }
            } catch (err) {
                console.error(err);
            }
        }
    }

    if (anyChange) {
        alert('Stock actualizado correctamente.');
    } else {
        alert('No hubo cambios en el stock.');
    }
    await fetchProducts();
    renderStock();
}

// Inicial
(async function init() {
    await fetchProducts();
    showView('menu-view');
})();
