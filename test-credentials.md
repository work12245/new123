
# UniFood Test System - Login Credentials & Testing Guide

## 🔐 Login Credentials

### Customer Accounts (For Testing Purchases)
1. **Test User** (Recommended for testing)
   - Email: `test@example.com`
   - Password: `test123`
   - Has delivery address configured

2. **John Doe**
   - Email: `john@example.com`
   - Password: `password123`
   - Has delivery address in Los Angeles

3. **Jane Smith**
   - Email: `jane@example.com`
   - Password: `jane123`
   - Has delivery address in New York

4. **Mike Johnson**
   - Email: `mike@example.com`
   - Password: `mike123`
   - Has delivery address in Chicago

5. **Sarah Wilson**
   - Email: `sarah@example.com`
   - Password: `sarah123`
   - Has delivery address in Miami

### Admin Account (For Managing Orders)
- **Admin User**
  - Email: `admin@unifood.com`
  - Password: `admin123`
  - Full admin access to dashboard

## 📋 Testing Workflow

### 1. Customer Journey
1. **Login as Customer**: Use any customer credentials above
2. **Browse Menu**: Click on any food item to view details
3. **Add to Cart**: Select size, extras, quantity and add to cart
4. **Checkout**: Go to cart, proceed to checkout
5. **Place Order**: Select delivery address and payment method
6. **Order Confirmation**: Receive confirmation with order ID

### 2. Admin Management
1. **Login as Admin**: Use admin credentials
2. **View Dashboard**: See statistics, orders, and reservations
3. **Manage Orders**: Change order status (pending → preparing → on the way → delivered)
4. **Manage Reservations**: Approve or reject table reservations
5. **View Analytics**: Check total revenue, users, and products

## 🏪 Sample Orders Available
- Order #1001: John Doe - Hyderabadi Biryani (Delivered)
- Order #1002: Jane Smith - Mixed items (Pending)
- Order #1003: Mike Johnson - Chicken Nuggets (Preparing)
- Order #1004: Sarah Wilson - Fried Chicken combo (On the way)

## 📍 Access URLs
- **Main Site**: `http://localhost:5000/`
- **Customer Login**: `http://localhost:5000/login.html`
- **Admin Login**: `http://localhost:5000/admin/login.html`
- **Admin Dashboard**: `http://localhost:5000/admin/dashboard.html`

## 🎯 Key Features to Test
1. **Menu Item Clicks**: All items are now clickable
2. **Cart Functionality**: Add/remove items, update quantities
3. **Order Placement**: Complete purchase flow
4. **Admin Panel**: Order management and status updates
5. **Real-time Updates**: Changes reflect immediately

## 💡 Testing Tips
- Use "Test User" account for the cleanest testing experience
- Try different order statuses in admin panel
- Test both "Add to Cart" and "Buy Now" features
- Check order details in admin panel after placing orders
- Test reservation system from main site

Start with customer login → place an order → switch to admin → manage the order!
