const API_URL = 'http://localhost:3000/api/orders';

async function loadOrders() {
    const res = await fetch(API_URL);
    const orders = await res.json();
    const tbody = document.querySelector('#orderTable');
    tbody.innerHTML = `<tr><th>ID</th><th>Customer</th><th>Layanan</th><th>Berat</th><th>Total</th><th>Status</th></tr>`;
    orders.forEach(order => {
        tbody.innerHTML += `<tr>
            <td>${order.id}</td><td>${order.customer}</td><td>${order.serviceType}</td>
            <td>${order.weight}</td><td>${order.total}</td><td>${order.status}</td>
        </tr>`;
    });
}

async function addOrder() {
    const customer = document.getElementById('customer').value;
    const serviceType = document.getElementById('serviceType').value;
    const weight = parseFloat(document.getElementById('weight').value);
    await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer, serviceType, weight })
    });
    loadOrders();
}
loadOrders();