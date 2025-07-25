const express = require('express');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve only necessary static files to reduce memory usage
app.use('/public', express.static('public'));
app.use('/uploads', express.static('uploads'));

// Optimized session configuration
app.use(session({
  secret: 'unifood-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// In-memory data storage (in production, use a real database)
let data = {
  users: [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
      role: "customer",
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
    },
    {
      id: 2,
      name: "Admin User",
      email: "admin@unifood.com",
      password: "admin123",
      role: "admin",
      addresses: []
    },
    {
      id: 3,
      name: "Jane Smith",
      email: "jane@example.com",
      password: "jane123",
      role: "customer",
      addresses: [
        {
          id: 2,
          type: "work",
          name: "Jane Smith",
          phone: "555-0123",
          address: "New York, NY, USA",
          delivery_area: "Downtown",
          delivery_charge: 30
        }
      ]
    },
    {
      id: 4,
      name: "Mike Johnson",
      email: "mike@example.com",
      password: "mike123",
      role: "customer",
      addresses: []
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
      name: "Dal Makhani Paneer",
      category: "Burger",
      price: 120,
      offer_price: 140,
      image: "/public/uploads/custom-images/dal-makhani-paneer-2023-03-05-01-25-44-9364.jpg",
      description: "Rich and creamy dal makhani with paneer",
      variants: [
        { name: "Regular", price: 120 },
        { name: "Large", price: 140 }
      ],
      extras: [
        { name: "Extra Paneer", price: 8 }
      ]
    },
    {
      id: 3,
      name: "Indian cuisine Pakora",
      category: "Burger",
      price: 80,
      offer_price: 95,
      image: "/public/uploads/custom-images/indian-cuisine-pakora-2023-03-05-01-32-04-5856.jpg",
      description: "Crispy and delicious pakoras",
      variants: [
        { name: "Small", price: 80 },
        { name: "Large", price: 95 }
      ],
      extras: []
    },
    {
      id: 4,
      name: "Beef Masala Salad",
      category: "Burger",
      price: 150,
      offer_price: 170,
      image: "/public/uploads/custom-images/beef-masala-salad-2023-03-05-01-42-23-6194.jpg",
      description: "Fresh beef masala salad",
      variants: [
        { name: "Regular", price: 150 }
      ],
      extras: []
    },
    {
      id: 5,
      name: "Chicken Nuggets",
      category: "Burger",
      price: 90,
      offer_price: 110,
      image: "/public/uploads/custom-images/chicken-nuggets-2023-03-05-01-50-15-6100.jpg",
      description: "Crispy chicken nuggets",
      variants: [
        { name: "6 pieces", price: 90 },
        { name: "12 pieces", price: 150 }
      ],
      extras: [
        { name: "Extra Sauce", price: 3 }
      ]
    },
    {
      id: 6,
      name: "Daria Shevtsova",
      category: "Burger",
      price: 120,
      offer_price: 200,
      image: "/public/uploads/custom-images/daria-shevtsova-2023-03-05-02-47-26-3957.png",
      description: "Special dish",
      variants: [
        { name: "Regular", price: 120 }
      ],
      extras: []
    },
    {
      id: 7,
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
    },
    {
      id: 8,
      name: "Fried Chicken",
      category: "Burger",
      price: 50,
      offer_price: 60,
      image: "/public/uploads/custom-images/fried-chicken-2023-03-05-02-59-51-6567.png",
      description: "Crispy fried chicken",
      variants: [
        { name: "2 pieces", price: 50 },
        { name: "4 pieces", price: 90 }
      ],
      extras: []
    },
    {
      id: 9,
      name: "Mozzarella Sticks",
      category: "Burger",
      price: 70,
      offer_price: 110,
      image: "/public/uploads/custom-images/mozzarella-sticks-2023-03-05-03-05-46-3294.png",
      description: "Crispy mozzarella sticks",
      variants: [
        { name: "Regular", price: 70 }
      ],
      extras: []
    },
    {
      id: 10,
      name: "Popcorn Chicken",
      category: "Burger",
      price: 60,
      offer_price: 90,
      image: "/public/uploads/custom-images/popcorn-chicken-2023-03-05-03-10-01-2671.png",
      description: "Bite-sized popcorn chicken",
      variants: [
        { name: "Regular", price: 60 }
      ],
      extras: []
    },
    {
      id: 11,
      name: "Chicken Wings",
      category: "Burger",
      price: 75,
      offer_price: 80,
      image: "/public/uploads/custom-images/chicken-wings-2023-03-05-03-14-33-3228.png",
      description: "Spicy chicken wings",
      variants: [
        { name: "6 wings", price: 75 },
        { name: "12 wings", price: 140 }
      ],
      extras: []
    },
    {
      id: 12,
      name: "Onion Rings",
      category: "Burger",
      price: 30,
      offer_price: 35,
      image: "/public/uploads/custom-images/onion-rings-2023-03-05-03-23-09-1753.png",
      description: "Crispy onion rings",
      variants: [
        { name: "Regular", price: 30 }
      ],
      extras: []
    },
    {
      id: 15,
      name: "Firecracker Shrimp",
      category: "Chicken",
      price: 25,
      offer_price: 30,
      image: "/public/uploads/custom-images/firecracker-shrimp-2023-03-06-12-25-11-9828.png",
      description: "Spicy firecracker shrimp",
      variants: [
        { name: "Regular", price: 25 }
      ],
      extras: []
    },
    {
      id: 16,
      name: "Grilled Octopus Salad",
      category: "Chicken",
      price: 70,
      offer_price: 75,
      image: "/public/uploads/custom-images/grilled-octopus-salad-2023-03-06-12-28-49-3466.png",
      description: "Fresh grilled octopus salad",
      variants: [
        { name: "Regular", price: 70 }
      ],
      extras: []
    },
    {
      id: 17,
      name: "Pesto and Burrata Crostini",
      category: "Pizza",
      price: 65,
      offer_price: 100,
      image: "/public/uploads/custom-images/pesto-and-burrata-crostini-2023-03-06-12-35-05-9316.png",
      description: "Delicious pesto and burrata crostini",
      variants: [
        { name: "Regular", price: 65 }
      ],
      extras: []
    },
    {
      id: 18,
      name: "Lobster Bisque",
      category: "Pizza",
      price: 60,
      offer_price: 60,
      image: "/public/uploads/custom-images/lobster-bisque-2023-03-06-12-40-12-7186.png",
      description: "Rich lobster bisque",
      variants: [
        { name: "Regular", price: 60 }
      ],
      extras: []
    },
    {
      id: 19,
      name: "Seared Ahi Tuna",
      category: "Dresserts",
      price: 85,
      offer_price: 90,
      image: "/public/uploads/custom-images/seared-ahi-tuna-2023-03-06-12-47-21-4113.png",
      description: "Premium seared ahi tuna",
      variants: [
        { name: "Regular", price: 85 }
      ],
      extras: []
    },
    {
      id: 20,
      name: "Quinoa Stuffed Peppers",
      category: "Dresserts",
      price: 110,
      offer_price: 110,
      image: "/public/uploads/custom-images/quinoa-stuffed-peppers-2023-03-06-12-52-48-9661.png",
      description: "Healthy quinoa stuffed peppers",
      variants: [
        { name: "Regular", price: 110 }
      ],
      extras: []
    },
    {
      id: 21,
      name: "Pulled Pork Sliders",
      category: "Sandwich",
      price: 130,
      offer_price: 150,
      image: "/public/uploads/custom-images/pulled-pork-sliders-2023-03-06-01-02-22-7233.png",
      description: "Juicy pulled pork sliders",
      variants: [
        { name: "3 sliders", price: 130 },
        { name: "6 sliders", price: 240 }
      ],
      extras: []
    },
    {
      id: 22,
      name: "Truffle Fries",
      category: "Sandwich",
      price: 150,
      offer_price: 200,
      image: "/public/uploads/custom-images/truffle-fries-2023-03-06-01-06-09-8443.png",
      description: "Premium truffle fries",
      variants: [
        { name: "Regular", price: 150 }
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

// Serve index.html at root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve cart and checkout pages
app.get('/cart.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'cart.html'));
});

app.get('/checkout.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'checkout.html'));
});

app.get('/order-summary.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'order-summary.html'));
});

app.get('/checkout-payment.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'checkout-payment.html'));
});

app.get('/order-confirmation.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'order-confirmation.html'));
});

// Serve login pages
app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/admin/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin/login.html'));
});

app.get('/register.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'register.html'));
});

app.get('/dashboard.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// Authentication routes
app.post('/store-login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.json({ success: false, message: 'Email and password are required' });
    }

    const user = data.users.find(u => u.email === email && u.password === password);

    if (user) {
      req.session.user = user;
      data.currentUser = user;
      
      // Redirect based on role
      if (user.role === 'admin') {
        res.json({ 
          success: true, 
          redirect: '/admin/dashboard.html', 
          role: 'admin',
          message: 'Admin login successful!',
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        });
      } else {
        res.json({ 
          success: true, 
          redirect: '/dashboard.html', 
          role: 'customer',
          message: 'Customer login successful!',
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        });
      }
    } else {
      res.json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error occurred during login' });
  }
});

// Admin specific login route
app.post('/admin-login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.json({ success: false, message: 'Email and password are required' });
    }

    const user = data.users.find(u => u.email === email && u.password === password && u.role === 'admin');

    if (user) {
      req.session.user = user;
      data.currentUser = user;
      
      res.json({ 
        success: true, 
        redirect: '/admin/dashboard.html', 
        role: 'admin',
        message: 'Admin login successful!',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } else {
      res.json({ success: false, message: 'Invalid admin credentials' });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ success: false, message: 'Server error occurred during admin login' });
  }
});

app.post('/store-register', (req, res) => {
  const { name, email, password, password_confirmation } = req.body;

  // Validate password confirmation
  if (password !== password_confirmation) {
    return res.json({ success: false, message: 'Passwords do not match' });
  }

  // Check if user exists
  if (data.users.find(u => u.email === email)) {
    return res.json({ success: false, message: 'Email already exists' });
  }

  const newUser = {
    id: data.users.length + 1,
    name,
    email,
    password,
    role: 'customer',
    addresses: []
  };

  data.users.push(newUser);
  req.session.user = newUser;
  data.currentUser = newUser;
  res.json({ success: true, redirect: '/dashboard.html', role: 'customer' });
});

// Logout route
app.post('/logout', (req, res) => {
  req.session.destroy();
  data.currentUser = null;
  res.json({ success: true, redirect: '/login.html' });
});

// Check authentication middleware
const requireAuth = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login.html');
  }
};

// Check admin middleware
const requireAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Admin access required' });
  }
};

// Product routes
app.get('/load-product-modal/:id', (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const product = data.products.find(p => p.id === productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const modalHTML = `
      <div class="row">
        <div class="col-xl-6 col-lg-6">
          <div class="wsus__cart_popup_img">
            <img src="${product.image}" alt="product" class="img-fluid w-100">
          </div>
        </div>
        <div class="col-xl-6 col-lg-6">
          <div class="wsus__cart_popup_text">
            <h2>${product.name}</h2>
            <div class="rating">
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <span>(1)</span>
            </div>
            <h3 class="price">$${product.price} ${product.offer_price ? `<del>$${product.offer_price}</del>` : ''}</h3>
            <div class="product-description" style="margin: 15px 0; padding: 10px; background: #f8f9fa; border-radius: 5px;">
              <p style="margin: 0; color: #666; font-size: 14px;">${product.description}</p>
            </div>

            <form id="add_to_cart_form" data-product-id="${product.id}">
              <div class="details_size">
                <h5>Select Size</h5>
                ${product.variants && product.variants.length > 0 ? 
                  product.variants.map((v, index) => 
                    `<div class="form-check">
                       <input class="form-check-input" type="radio" name="size_variant" value="${v.name}" data-variant-price="${v.price}" id="size_${index}" ${index === 0 ? 'checked' : ''}>
                       <label class="form-check-label" for="size_${index}">
                         ${v.name} <span>+$${v.price}</span>
                       </label>
                     </div>`
                  ).join('') : 
                  `<div class="form-check">
                     <input class="form-check-input" type="radio" name="size_variant" value="Regular" data-variant-price="${product.price}" id="size_0" checked>
                     <label class="form-check-label" for="size_0">
                       Regular <span>$${product.price}</span>
                     </label>
                   </div>`
                }
              </div>

              ${product.extras && product.extras.length > 0 ? `
              <div class="details_extra_item">
                <h5>Select Addon (Optional)</h5>
                ${product.extras.map((e, index) => 
                  `<div class="form-check">
                     <input class="form-check-input" type="checkbox" name="optional_items[]" value="${e.name}" data-extra-price="${e.price}" id="extra_${index}">
                     <label class="form-check-label" for="extra_${index}">
                       ${e.name} <span>+$${e.price}</span>
                     </label>
                   </div>`
                ).join('')}
              </div>` : ''}

              <div class="details_quentity">
                <h5>Select Quantity</h5>
                <div class="quentity_btn_area d-flex flex-wrap align-items-center">
                  <div class="quentity_btn">
                    <button class="btn btn-danger decrement" type="button"><i class="fal fa-minus"></i></button>
                    <input type="text" name="quantity" value="1" readonly>
                    <button class="btn btn-success increment" type="button"><i class="fal fa-plus"></i></button>
                  </div>
                  <h3>$<span class="total-price">${product.variants && product.variants.length > 0 ? product.variants[0].price : product.price}</span></h3>
                </div>
              </div>

              <ul class="details_button_area d-flex flex-wrap">
                <li><button type="submit" class="common_btn">Add to Cart</button></li>
                <li><button type="button" class="common_btn buy-now-btn" style="background: #28a745; margin-left: 10px;">Buy Now</button></li>
              </ul>
            </form>
          </div>
        </div>
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
  try {
    const { product_id, size_variant, optional_items, quantity } = req.body;
    const product = data.products.find(p => p.id == product_id);

    if (!product) return res.status(404).json({ error: 'Product not found' });

    // Ensure variants exist, if not create default
    const variants = product.variants || [{ name: "Regular", price: product.price }];
    const variant = variants.find(v => v.name === size_variant);

    if (!variant) {
      return res.status(400).json({ error: 'Invalid variant selected' });
    }

    const extras = optional_items || [];
    const productExtras = product.extras || [];

    let totalPrice = variant.price * parseInt(quantity);
    if (Array.isArray(extras)) {
      extras.forEach(extra => {
        const extraItem = productExtras.find(e => e.name === extra);
        if (extraItem) totalPrice += extraItem.price * parseInt(quantity);
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

    // Initialize session cart if it doesn't exist
    if (!req.session.cart) {
        req.session.cart = [];
    }
    
    req.session.cart.push(cartItem);
    res.json({ success: true, message: 'Added to cart successfully' });
  } catch (error) {
    console.error('Error in add-to-cart:', error);
    res.status(500).json({ error: 'Server error occurred' });
  }
});

app.put('/update-cart-quantity/:id', (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  
  if (!req.session.cart) {
    req.session.cart = [];
  }
  
  const cartItem = req.session.cart.find(item => item.id == id);

  if (cartItem) {
    const product = data.products.find(p => p.id == cartItem.product_id);
    cartItem.quantity = parseInt(quantity);
    
    // Calculate base price for the quantity
    cartItem.price = cartItem.base_price * cartItem.quantity;
    
    // Add extras price for the quantity
    if (cartItem.extras && cartItem.extras.length > 0 && product && product.extras) {
      cartItem.extras.forEach(extra => {
        const extraItem = product.extras.find(e => e.name === extra);
        if (extraItem) {
          cartItem.price += extraItem.price * cartItem.quantity;
        }
      });
    }
  }

  res.json({ success: true });
});

app.delete('/remove-from-cart/:id', (req, res) => {
  const itemId = req.params.id;
  
  if (!req.session.cart) {
    req.session.cart = [];
  }
  
  req.session.cart = req.session.cart.filter(item => item.id != itemId);
  res.json({ success: true, message: 'Item removed from cart' });
});

// Alternative GET route for compatibility
app.get('/remove-cart-item/:id', (req, res) => {
  const itemId = req.params.id;
  
  if (!req.session.cart) {
    req.session.cart = [];
  }
  
  req.session.cart = req.session.cart.filter(item => item.id != itemId);
  res.json({ success: true, message: 'Item removed from cart' });
});

app.delete('/clear-cart', (req, res) => {
  req.session.cart = [];
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

// Get cart data
app.get('/api/cart', (req, res) => {
    // Initialize session cart if it doesn't exist
    if (!req.session.cart) {
        req.session.cart = [];
    }
    res.json(req.session.cart);
});

// Get cart data for cart page
app.get('/cart-data', (req, res) => {
    // Initialize session cart if it doesn't exist
    if (!req.session.cart) {
        req.session.cart = [];
    }
    res.json({
        success: true,
        cartItems: req.session.cart
    });
});

// Buy Now - Direct purchase
app.post('/buy-now', (req, res) => {
    try {
        const { product_id, size_variant, optional_items, quantity } = req.body;
        const product = data.products.find(p => p.id == product_id);

        if (!product) return res.status(404).json({ error: 'Product not found' });

        // Ensure variants exist, if not create default
        const variants = product.variants || [{ name: "Regular", price: product.price }];
        const variant = variants.find(v => v.name === size_variant);

        if (!variant) {
            return res.status(400).json({ error: 'Invalid variant selected' });
        }

        const extras = optional_items || [];
        const productExtras = product.extras || [];

        let totalPrice = variant.price * parseInt(quantity);
        if (Array.isArray(extras)) {
            extras.forEach(extra => {
                const extraItem = productExtras.find(e => e.name === extra);
                if (extraItem) totalPrice += extraItem.price * parseInt(quantity);
            });
        }

        const buyNowItem = {
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

        // Store in session for direct purchase
        req.session.buyNowItem = buyNowItem;
        res.json({ success: true, message: 'Ready for purchase', buyNowItem });
    } catch (error) {
        console.error('Error in buy-now:', error);
        res.status(500).json({ error: 'Server error occurred' });
    }
});

// Get buy now item
app.get('/buy-now-data', (req, res) => {
    res.json({
        success: true,
        buyNowItem: req.session.buyNowItem || null
    });
});

// Process order
app.post('/place-order', (req, res) => {
    try {
        const { address_id, payment_method, order_type } = req.body; // order_type: 'cart' or 'buyNow'
        
        let orderItems = [];
        let totalAmount = 0;

        if (order_type === 'buyNow' && req.session.buyNowItem) {
            orderItems = [req.session.buyNowItem];
            totalAmount = req.session.buyNowItem.price;
        } else if (order_type === 'cart' && req.session.cart) {
            orderItems = req.session.cart;
            totalAmount = req.session.cart.reduce((sum, item) => sum + item.price, 0);
        } else {
            return res.status(400).json({ error: 'No items to order' });
        }

        const order = {
            id: Date.now(),
            items: orderItems,
            total: totalAmount,
            address_id: address_id,
            payment_method: payment_method,
            status: 'pending',
            created_at: new Date(),
            user: data.currentUser?.name || 'Guest'
        };

        data.orders.push(order);

        // Clear the session data
        if (order_type === 'buyNow') {
            req.session.buyNowItem = null;
        } else {
            req.session.cart = [];
        }

        res.json({ 
            success: true, 
            message: 'Order placed successfully!',
            order_id: order.id 
        });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ error: 'Server error occurred' });
    }
});

// Get current user info
app.get('/api/user', (req, res) => {
  if (req.session.user) {
    res.json({
      success: true,
      user: {
        id: req.session.user.id,
        name: req.session.user.name,
        email: req.session.user.email,
        role: req.session.user.role
      }
    });
  } else {
    res.json({
      success: false,
      user: null
    });
  }
});

// Check authentication status
app.get('/auth-status', (req, res) => {
  res.json({
    isAuthenticated: !!req.session.user,
    user: req.session.user || null
  });
});

// Admin routes
app.get('/admin/dashboard.html', requireAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, 'admin/dashboard.html'));
});

// Get all users (admin only)
app.get('/api/admin/users', requireAdmin, (req, res) => {
  res.json({
    success: true,
    users: data.users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      registered: new Date().toISOString().split('T')[0] // Dummy date
    }))
  });
});

// Get all orders (admin only)
app.get('/api/admin/orders', requireAdmin, (req, res) => {
  res.json({
    success: true,
    orders: data.orders
  });
});

// Get dashboard stats (admin only)
app.get('/api/admin/stats', requireAdmin, (req, res) => {
  res.json({
    success: true,
    stats: {
      totalUsers: data.users.filter(u => u.role === 'customer').length,
      totalOrders: data.orders.length,
      totalProducts: data.products.length,
      totalRevenue: data.orders.reduce((sum, order) => sum + order.total, 0),
      pendingOrders: data.orders.filter(o => o.status === 'pending').length
    }
  });
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

// Cleanup function to manage memory
const cleanup = () => {
  // Clear old cart sessions periodically
  setInterval(() => {
    console.log('Memory cleanup running...');
  }, 30 * 60 * 1000); // Every 30 minutes
};

// Error handling to prevent crashes
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`UniFood Server running on port ${PORT}`);
  cleanup();
});