# Restaurant Menu & Billing System

A complete restaurant website with menu management, cart functionality, billing system, and sales reporting.

## Features

### 🍽️ Menu Display
- Beautiful grid layout showing all menu items with images
- Click on any item to add it to the cart
- Default menu items: Idly, Puttu, Poori, Coffee, Dosa, Vada, Pazhampuri

### 🛒 Shopping Cart
- Add items directly from menu by clicking
- Increase/decrease quantity
- Remove items from cart
- Real-time bill calculation with tax (5%)
- Clear cart functionality

### 💳 Payment System
- **Pay Now** button generates QR code for payment
- QR code contains payment details
- Confirm payment to complete order
- Orders are saved to sales data

### 🧾 Bill Management
- **Print Bill** - Print formatted bill with all details
- Bill includes itemized list, subtotal, tax, and total
- Professional bill layout

### 📊 Sales Reports
- Monthly sales report generation
- View total revenue, orders, and tax
- Item-wise sales breakdown
- Daily sales statistics
- Select any month from the last 12 months

### ⚙️ Menu Management (CRUD)
- **Create**: Add new menu items with name, price, and image URL
- **Read**: View all menu items
- **Update**: Edit existing menu items
- **Delete**: Remove menu items

## How to Use

1. **Open the website**: Simply open `index.html` in your web browser

2. **View Menu**: Click on "Menu" tab to see all available items

3. **Add to Cart**: Click on any menu item to add it to your cart

4. **Manage Cart**: 
   - Go to "Cart" tab to view your items
   - Use +/- buttons to adjust quantity
   - Click "Remove" to delete an item
   - Click "Clear Cart" to remove all items

5. **Pay**: 
   - Click "Pay Now" button
   - QR code will be generated
   - Click "Confirm Payment" to complete the order

6. **Print Bill**: Click "Print Bill" button to print the current cart

7. **Manage Menu**: 
   - Go to "Manage Menu" tab
   - Add new items using the form
   - Edit or delete existing items

8. **View Reports**: 
   - Go to "Sales Report" tab
   - Select a month
   - Click "Generate Report" to view sales statistics

## Data Persistence

All data (menu items, cart, sales) is stored in browser's localStorage, so your data persists even after closing the browser.

## Technologies Used

- HTML5
- CSS3 (with modern gradients and animations)
- JavaScript (Vanilla JS)
- QRCode.js library (for QR code generation)

## Browser Compatibility

Works on all modern browsers (Chrome, Firefox, Safari, Edge)

## Notes

- Images are loaded from external URLs. If an image fails to load, a placeholder will be shown.
- The tax rate is set to 5% and can be modified in the JavaScript code.
- All prices are in Indian Rupees (₹).


