
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('.'));

// In-memory data storage (in production, use a real database)
let data = {
  users: [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
      addresses: [
        {
          id: 1,
          type: "home",
          name: "John Doe",
          phone: "125-985-4587",
          address: "Los Angeles, CA, USA",
          delivery_area: "Metrocenter Mall",
          delivery_charge: 25
        }
      ]
    }
  ],
  products: [
    {
      id: 1,
      name: "Hyderabadi Biryani",
      category: "Burger",
      price: 130,
      offer_price: 150,
      image: "/public/uploads/custom-images/hyderabadi-biryani-2023-03-05-01-14-59-9689.png",
      description: "Delicious Hyderabadi style biryani with aromatic spices",
      variants: [
        { name: "Small", price: 130 },
        { name: "Medium", price: 150 },
        { name: "Large", price: 170 }
      ],
      extras: [
        { name: "Extra Cheese", price: 5 },
        { name: "Burritos", price: 10 }
      ]
    },
    {
      id: 2,
      name: "Spicy Burger",
      category: "Burger", 
      price: 40,
      offer_price: 80,
      image: "/public/uploads/custom-images/spicy-burger-2023-03-05-02-57-08-4535.png",
      description: "Spicy chicken burger with fresh vegetables",
      variants: [
        { name: "Small", price: 40 },
        { name: "Medium", price: 50 },
        { name: "Large", price: 60 }
      ],
      extras: []
    }
  ],
  cart: [],
  orders: [],
  reservations: [],
  subscribers: [],
  currentUser: null
};

// Routes

// Authentication routes
app.post('/store-login', (req, res) => {
  const { email, password } = req.body;
  const user = data.users.find(u => u.email === email && u.password === password);
  
  if (user) {
    data.currentUser = user;
    res.redirect('/dashboard.html');
  } else {
    res.redirect('/login.html?error=invalid');
  }
});

app.post('/store-register', (req, res) => {
  const { name, email, password } = req.body;
  
  // Check if user exists
  if (data.users.find(u => u.email === email)) {
    return res.redirect('/register.html?error=exists');
  }
  
  const newUser = {
    id: data.users.length + 1,
    name,
    email,
    password,
    addresses: []
  };
  
  data.users.push(newUser);
  data.currentUser = newUser;
  res.redirect('/dashboard.html');
});

// Product routes
app.get('/load-product-modal/:id', (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const product = data.products.find(p => p.id === productId);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const modalHTML = `
      <div class="wsus__cart_popup_img">
        <img src="${product.image}" alt="product" class="img-fluid w-100">
      </div>
      <div class="wsus__cart_popup_text">
        <h6>${product.name}</h6>
        <p>$${product.price}</p>
        <form id="add_to_cart_form" data-product-id="${product.id}">
          <div class="popup_size">
            <h6>Size</h6>
            ${product.variants && product.variants.length > 0 ? 
              product.variants.map(v => 
                `<label><input type="radio" name="size_variant" value="${v.name}" data-variant-price="${v.price}"> ${v.name} (+$${v.price})</label>`
              ).join('') : 
              `<label><input type="radio" name="size_variant" value="Regular" data-variant-price="${product.price}" checked> Regular ($${product.price})</label>`
            }
          </div>
          ${product.extras && product.extras.length > 0 ? `
          <div class="popup_extras">
            <h6>Extras</h6>
            ${product.extras.map(e => 
              `<label><input type="checkbox" name="optional_items[]" value="${e.name}" data-extra-price="${e.price}"> ${e.name} (+$${e.price})</label>`
            ).join('')}
          </div>` : ''}
          <div class="popup_quantity">
            <h6>Quantity</h6>
            <div class="quentity_btn">
              <button type="button" class="btn btn-danger decrement"><i class="fal fa-minus"></i></button>
              <input type="text" name="quantity" value="1" readonly>
              <button type="button" class="btn btn-success increment"><i class="fal fa-plus"></i></button>
            </div>
          </div>
          <button type="submit" class="common_btn">Add to Cart</button>
        </form>
      </div>
    `;
    
    res.send(modalHTML);
  } catch (error) {
    console.error('Error in load-product-modal:', error);
    res.status(500).json({ error: 'Server error occurred' });
  }
});

// Cart routes
app.post('/add-to-cart', (req, res) => {
  const { product_id, size_variant, optional_items, quantity } = req.body;
  const product = data.products.find(p => p.id == product_id);
  
  if (!product) return res.status(404).json({ error: 'Product not found' });
  
  const variant = product.variants.find(v => v.name === size_variant);
  const extras = optional_items || [];
  
  let totalPrice = variant.price * parseInt(quantity);
  if (Array.isArray(extras)) {
    extras.forEach(extra => {
      const extraItem = product.extras.find(e => e.name === extra);
      if (extraItem) totalPrice += extraItem.price;
    });
  }
  
  const cartItem = {
    id: Date.now(),
    product_id: product.id,
    name: product.name,
    image: product.image,
    size: size_variant,
    extras: extras,
    quantity: parseInt(quantity),
    price: totalPrice,
    base_price: variant.price
  };
  
  data.cart.push(cartItem);
  res.json({ success: true, message: 'Added to cart successfully' });
});

app.get('/cart-quantity-update', (req, res) => {
  const { rowid, quantity } = req.query;
  const cartItem = data.cart.find(item => item.id == rowid);
  
  if (cartItem) {
    cartItem.quantity = parseInt(quantity);
    cartItem.price = cartItem.base_price * cartItem.quantity;
    if (cartItem.extras) {
      cartItem.extras.forEach(extra => {
        const product = data.products.find(p => p.id == cartItem.product_id);
        const extraItem = product.extras.find(e => e.name === extra);
        if (extraItem) cartItem.price += extraItem.price;
      });
    }
  }
  
  res.json({ success: true });
});

app.get('/remove-cart-item/:id', (req, res) => {
  const itemId = req.params.id;
  data.cart = data.cart.filter(item => item.id != itemId);
  res.json({ success: true, message: 'Item removed from cart' });
});

app.get('/cart-clear', (req, res) => {
  data.cart = [];
  res.json({ success: true, message: 'Cart cleared successfully' });
});

// Reservation route
app.post('/store-reservation', (req, res) => {
  const { reserve_date, reserve_time, person } = req.body;
  
  const reservation = {
    id: data.reservations.length + 1,
    date: reserve_date,
    time: reserve_time,
    persons: person,
    user: data.currentUser?.name || 'Guest',
    status: 'pending'
  };
  
  data.reservations.push(reservation);
  res.json({ success: true, message: 'Reservation request sent successfully' });
});

// Newsletter subscription
app.post('/subscribe-request', (req, res) => {
  const { email } = req.body;
  
  if (!data.subscribers.find(s => s.email === email)) {
    data.subscribers.push({ email, date: new Date() });
  }
  
  res.json({ success: true, message: 'Successfully subscribed to newsletter' });
});

// API routes for getting data
app.get('/api/cart', (req, res) => {
  res.json(data.cart);
});

app.get('/api/user', (req, res) => {
  res.json(data.currentUser);
});

app.get('/api/products', (req, res) => {
  const { category, search } = req.query;
  let products = data.products;
  
  if (category) {
    products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }
  
  if (search) {
    products = products.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  res.json(products);
});

// Contact form
app.post('/store-contact', (req, res) => {
  console.log('Contact form submitted:', req.body);
  res.json({ success: true, message: 'Message sent successfully' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
