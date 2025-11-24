// URL DEL BACKEND
const API_URL = "http://localhost:3000/productos";

let products = [];
let currentView = "menu-view";

// ---------------------
// CAMBIAR DE VISTA
// ---------------------
function showView(id) {
    document.getElementById(currentView).classList.add("hidden");
    document.getElementById(id).classList.remove("hidden");
    currentView = id;
}

// ---------------------
// CARGAR PRODUCTOS DEL SERVIDOR
// ---------------------
async function loadProducts() {
    const res = await fetch(API_URL);
    products = await res.json();
}

// ---------------------
// BOTONES
// ---------------------
document.getElementById("btn-show-add").onclick = () =>
    showView("add-product-view");

document.getElementById("btn-show-stock").onclick = async () => {
    await loadProducts();
    renderStock();
    showView("stock-view");
};

document.getElementById("btn-back-from-add").onclick = () =>
    showView("menu-view");

document.getElementById("btn-back-from-stock").onclick = () =>
    showView("menu-view");

// ---------------------
// AGREGAR PRODUCTO
// ---------------------
document.getElementById("add-product-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const newProduct = {
        name: document.getElementById("product-name").value,
        type: document.getElementById("product-type").value,
        price: parseFloat(document.getElementById("product-price").value),
        quantity: parseInt(document.getElementById("product-quantity").value)
    };

    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct)
    });

    // Recargar productos
    await loadProducts();

    showView("stock-view");
    renderStock();
});

// ---------------------
// MOSTRAR STOCK
// ---------------------
function renderStock() {
    const tbody = document.getElementById("stock-list");
    tbody.innerHTML = "";

    products.forEach(product => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.type}</td>
            <td>$${product.price}</td>
            <td>
                <input type="number" value="${product.quantity}" min="0" data-id="${product.id}">
            </td>
            <td>
                <button class="delete-btn" data-id="${product.id}">❌</button>
            </td>
        `;

        tbody.appendChild(row);
    });

    // ELIMINAR PRODUCTO
    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.onclick = () => deleteProduct(btn.dataset.id);
    });
}

// ---------------------
// ACTUALIZAR STOCK
// ---------------------
document.getElementById("btn-update-stock").onclick = async () => {
    const inputs = document.querySelectorAll("#stock-list input");

    for (let input of inputs) {
        const id = input.dataset.id;
        const newQuantity = parseInt(input.value);

        await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quantity: newQuantity })
        });
    }

    alert("Stock actualizado.");
};

// ---------------------
// ELIMINAR PRODUCTO
// ---------------------
async function deleteProduct(id) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });

    await loadProducts();
    renderStock();
}

// ---------------------
showView("menu-view");
