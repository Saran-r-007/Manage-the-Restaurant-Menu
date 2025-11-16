// Initialize default menu items with open-source images from Pexels
const defaultMenuItems = [
    { id: 1, name: 'Idly', price: 30, image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop' },
    { id: 2, name: 'Puttu', price: 40, image: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop' },
    { id: 3, name: 'Poori', price: 35, image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop' },
    { id: 4, name: 'Coffee', price: 25, image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop' },
    { id: 5, name: 'Dosa', price: 50, image: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop' },
    { id: 6, name: 'Vada', price: 30, image: 'https://images.pexels.com/photos/1640775/pexels-photo-1640775.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop' },
    { id: 7, name: 'Pazhampuri', price: 45, image: 'https://images.pexels.com/photos/1640771/pexels-photo-1640771.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop' }
];

// State management
let menuItems = [];
let cart = [];
let salesData = [];

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    initializeMenu();
    setupEventListeners();
    renderMenu();
    renderCart();
    initializeMonthSelect();
});

// Load data from localStorage
function loadData() {
    const savedMenu = localStorage.getItem('menuItems');
    const savedCart = localStorage.getItem('cart');
    const savedSales = localStorage.getItem('salesData');

    menuItems = savedMenu ? JSON.parse(savedMenu) : defaultMenuItems;
    cart = savedCart ? JSON.parse(savedCart) : [];
    salesData = savedSales ? JSON.parse(savedSales) : [];

    // Save default menu if it's the first time
    if (!savedMenu) {
        localStorage.setItem('menuItems', JSON.stringify(menuItems));
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('menuItems', JSON.stringify(menuItems));
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('salesData', JSON.stringify(salesData));
}

// Initialize menu with IDs
function initializeMenu() {
    if (menuItems.length === 0) {
        menuItems = defaultMenuItems.map(item => ({ ...item }));
    }
}

// Setup event listeners
function setupEventListeners() {
    // Tab navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tab = e.target.dataset.tab;
            switchTab(tab);
        });
    });

    // Add item form
    document.getElementById('add-item-form').addEventListener('submit', handleAddItem);

    // Cart actions
    document.getElementById('clear-cart').addEventListener('click', clearCart);
    document.getElementById('pay-now').addEventListener('click', showPaymentModal);
    document.getElementById('print-bill').addEventListener('click', printBill);
    document.getElementById('confirm-payment').addEventListener('click', confirmPayment);

    // Modal close
    document.querySelector('.close').addEventListener('click', closeModal);
    document.getElementById('payment-modal').addEventListener('click', (e) => {
        if (e.target.id === 'payment-modal') {
            closeModal();
        }
    });

    // Generate report
    document.getElementById('generate-report').addEventListener('click', generateReport);
}

// Tab switching
function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    document.getElementById(`${tabName}-tab`).classList.add('active');
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    if (tabName === 'manage') {
        renderManageMenu();
    } else if (tabName === 'reports') {
        // Reports will be generated on demand
    }
}

// Render menu
function renderMenu() {
    const menuGrid = document.getElementById('menu-grid');
    menuGrid.innerHTML = '';

    menuItems.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/400x300?text=${item.name}'">
            <div class="menu-item-info">
                <h3>${item.name}</h3>
                <p>₹${item.price.toFixed(2)}</p>
            </div>
        `;
        menuItem.addEventListener('click', () => addToCart(item));
        menuGrid.appendChild(menuItem);
    });
}

// Add to cart
function addToCart(item) {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: 1
        });
    }

    saveData();
    renderCart();
    updateBill();
    
    // Show notification
    showNotification(`${item.name} added to cart!`);
}

// Render cart
function renderCart() {
    const cartList = document.getElementById('cart-list');
    
    if (cart.length === 0) {
        cartList.innerHTML = '<div class="empty-cart"><p>Your cart is empty. Add items from the menu!</p></div>';
        updateBill();
        return;
    }

    cartList.innerHTML = '';
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/60x60?text=${item.name}'">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>₹${item.price.toFixed(2)} each</p>
                </div>
            </div>
            <div class="cart-item-controls">
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="decreaseQuantity(${item.id})">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="increaseQuantity(${item.id})">+</button>
                </div>
                <span class="item-price">₹${(item.price * item.quantity).toFixed(2)}</span>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `;
        cartList.appendChild(cartItem);
    });

    updateBill();
}

// Update bill
function updateBill() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('total').textContent = `₹${total.toFixed(2)}`;
}

// Quantity controls
function increaseQuantity(id) {
    const item = cart.find(cartItem => cartItem.id === id);
    if (item) {
        item.quantity += 1;
        saveData();
        renderCart();
    }
}

function decreaseQuantity(id) {
    const item = cart.find(cartItem => cartItem.id === id);
    if (item && item.quantity > 1) {
        item.quantity -= 1;
        saveData();
        renderCart();
    }
}

// Remove from cart
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveData();
    renderCart();
}

// Clear cart
function clearCart() {
    if (cart.length === 0) {
        showNotification('Cart is already empty!');
        return;
    }
    
    if (confirm('Are you sure you want to clear the cart?')) {
        cart = [];
        saveData();
        renderCart();
        showNotification('Cart cleared!');
    }
}

// Show payment modal
function showPaymentModal() {
    if (cart.length === 0) {
        showNotification('Cart is empty!');
        return;
    }

    const total = calculateTotal();
    document.getElementById('payment-amount').textContent = total.toFixed(2);
    
    const modal = document.getElementById('payment-modal');
    modal.classList.add('active');

    // Generate QR code
    const qrContainer = document.getElementById('qr-code-container');
    qrContainer.innerHTML = '';
    
    const paymentData = {
        amount: total,
        items: cart,
        timestamp: new Date().toISOString()
    };

    QRCode.toCanvas(qrContainer, JSON.stringify(paymentData), {
        width: 200,
        margin: 2
    }, (error) => {
        if (error) {
            qrContainer.innerHTML = '<p>QR Code generation failed</p>';
        }
    });
}

// Calculate total
function calculateTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Confirm payment
function confirmPayment() {
    if (cart.length === 0) {
        showNotification('Cart is empty!');
        return;
    }

    const total = calculateTotal();
    const sale = {
        id: Date.now(),
        date: new Date().toISOString(),
        items: JSON.parse(JSON.stringify(cart)),
        total: total
    };

    salesData.push(sale);
    saveData();

    cart = [];
    saveData();
    renderCart();

    closeModal();
    showNotification('Payment confirmed! Order placed successfully.');
}

// Close modal
function closeModal() {
    document.getElementById('payment-modal').classList.remove('active');
}

// Print bill
function printBill() {
    if (cart.length === 0) {
        showNotification('Cart is empty!');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    let printContent = `
        <html>
        <head>
            <title>Bill</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h1 { text-align: center; color: #667eea; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
                th { background: #667eea; color: white; }
                .total-row { font-weight: bold; font-size: 1.2em; }
                .summary { margin-top: 20px; padding: 15px; background: #f8f9fa; }
            </style>
        </head>
        <body>
            <h1>Restaurant Bill</h1>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
    `;

    cart.forEach(item => {
        printContent += `
            <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>₹${item.price.toFixed(2)}</td>
                <td>₹${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
        `;
    });

    printContent += `
                </tbody>
            </table>
            <div class="summary">
                <p class="total-row"><strong>Total:</strong> ₹${total.toFixed(2)}</p>
            </div>
        </body>
        </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
}

// Manage menu - Add item
function handleAddItem(e) {
    e.preventDefault();
    
    const name = document.getElementById('item-name').value.trim();
    const price = parseFloat(document.getElementById('item-price').value);
    const image = document.getElementById('item-image').value.trim();

    if (!name || !price || !image) {
        showNotification('Please fill all fields!');
        return;
    }

    const newItem = {
        id: Date.now(),
        name: name,
        price: price,
        image: image
    };

    menuItems.push(newItem);
    saveData();
    renderMenu();
    renderManageMenu();

    // Reset form
    document.getElementById('add-item-form').reset();
    showNotification(`${name} added to menu!`);
}

// Render manage menu
function renderManageMenu() {
    const manageList = document.getElementById('manage-menu-list');
    manageList.innerHTML = '';

    menuItems.forEach(item => {
        const manageItem = document.createElement('div');
        manageItem.className = 'manage-item';
        manageItem.innerHTML = `
            <div class="manage-item-info">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/80x80?text=${item.name}'">
                <div class="manage-item-details">
                    <h4>${item.name}</h4>
                    <p>₹${item.price.toFixed(2)}</p>
                </div>
            </div>
            <div class="manage-item-actions">
                <button class="btn btn-edit" onclick="editItem(${item.id})">Edit</button>
                <button class="btn btn-delete" onclick="deleteItem(${item.id})">Delete</button>
            </div>
        `;
        manageList.appendChild(manageItem);
    });
}

// Edit item
function editItem(id) {
    const item = menuItems.find(menuItem => menuItem.id === id);
    if (!item) return;

    const newName = prompt('Enter new name:', item.name);
    if (newName === null) return;

    const newPrice = prompt('Enter new price:', item.price);
    if (newPrice === null) return;

    const newImage = prompt('Enter new image URL:', item.image);
    if (newImage === null) return;

    if (newName.trim() && !isNaN(newPrice) && newImage.trim()) {
        item.name = newName.trim();
        item.price = parseFloat(newPrice);
        item.image = newImage.trim();
        
        saveData();
        renderMenu();
        renderManageMenu();
        showNotification(`${item.name} updated!`);
    }
}

// Delete item
function deleteItem(id) {
    const item = menuItems.find(menuItem => menuItem.id === id);
    if (!item) return;

    if (confirm(`Are you sure you want to delete ${item.name}?`)) {
        menuItems = menuItems.filter(menuItem => menuItem.id !== id);
        saveData();
        renderMenu();
        renderManageMenu();
        showNotification(`${item.name} deleted!`);
    }
}

// Initialize month select
function initializeMonthSelect() {
    const monthSelect = document.getElementById('month-select');
    const months = [];
    const currentDate = new Date();
    
    // Generate last 12 months
    for (let i = 0; i < 12; i++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        const monthName = date.toLocaleString('default', { month: 'long', year: 'numeric' });
        const monthValue = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        months.push({ name: monthName, value: monthValue });
    }

    months.forEach(month => {
        const option = document.createElement('option');
        option.value = month.value;
        option.textContent = month.name;
        monthSelect.appendChild(option);
    });
}

// Generate report
function generateReport() {
    const selectedMonth = document.getElementById('month-select').value;
    
    if (!selectedMonth) {
        showNotification('Please select a month!');
        return;
    }

    const [year, month] = selectedMonth.split('-');
    const filteredSales = salesData.filter(sale => {
        const saleDate = new Date(sale.date);
        return saleDate.getFullYear() == year && saleDate.getMonth() + 1 == month;
    });

    if (filteredSales.length === 0) {
        document.getElementById('report-content').innerHTML = `
            <p style="text-align: center; padding: 40px; color: #999;">
                No sales data available for this month.
            </p>
        `;
        return;
    }

    // Calculate totals
    const totalSales = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
    const totalOrders = filteredSales.length;

    // Item-wise sales
    const itemSales = {};
    filteredSales.forEach(sale => {
        sale.items.forEach(item => {
            if (!itemSales[item.name]) {
                itemSales[item.name] = { quantity: 0, revenue: 0 };
            }
            itemSales[item.name].quantity += item.quantity;
            itemSales[item.name].revenue += item.price * item.quantity;
        });
    });

    let reportHTML = `
        <h3>Sales Report for ${new Date(year, month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
        <div class="report-summary">
            <div class="summary-row">
                <span>Total Orders:</span>
                <span>${totalOrders}</span>
            </div>
            <div class="summary-row total">
                <span>Total Revenue:</span>
                <span>₹${totalSales.toFixed(2)}</span>
            </div>
        </div>
        <h3 style="margin-top: 30px;">Item-wise Sales</h3>
        <table class="report-table">
            <thead>
                <tr>
                    <th>Item Name</th>
                    <th>Quantity Sold</th>
                    <th>Revenue</th>
                </tr>
            </thead>
            <tbody>
    `;

    Object.entries(itemSales)
        .sort((a, b) => b[1].revenue - a[1].revenue)
        .forEach(([itemName, data]) => {
            reportHTML += `
                <tr>
                    <td>${itemName}</td>
                    <td>${data.quantity}</td>
                    <td>₹${data.revenue.toFixed(2)}</td>
                </tr>
            `;
        });

    reportHTML += `
            </tbody>
        </table>
        <h3 style="margin-top: 30px;">Daily Sales</h3>
        <table class="report-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Orders</th>
                    <th>Revenue</th>
                </tr>
            </thead>
            <tbody>
    `;

    // Daily sales
    const dailySales = {};
    filteredSales.forEach(sale => {
        const date = new Date(sale.date).toLocaleDateString();
        if (!dailySales[date]) {
            dailySales[date] = { orders: 0, revenue: 0 };
        }
        dailySales[date].orders += 1;
        dailySales[date].revenue += sale.total;
    });

    Object.entries(dailySales)
        .sort((a, b) => new Date(a[0]) - new Date(b[0]))
        .forEach(([date, data]) => {
            reportHTML += `
                <tr>
                    <td>${date}</td>
                    <td>${data.orders}</td>
                    <td>₹${data.revenue.toFixed(2)}</td>
                </tr>
            `;
        });

    reportHTML += `
            </tbody>
        </table>
    `;

    document.getElementById('report-content').innerHTML = reportHTML;
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        z-index: 2000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

