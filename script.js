// App State

let currentUser = null;
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentPage = 'home';

// Products Database
const products = [
    {
        id: 1,
        name: 'Burger Clássico',
        description: 'Hambúrguer artesanal com carne bovina, alface, tomate, cebola e molho especial',
        price: 25.90,
        category: 'burgers',
        image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400',
        featured: true
    },
    {
        id: 2,
        name: 'Burger Bacon',
        description: 'Delicioso hambúrguer com bacon crocante, queijo cheddar e molho barbecue',
        price: 32.90,
        category: 'burgers',
        image: 'https://images.pexels.com/photos/3915906/pexels-photo-3915906.jpeg?auto=compress&cs=tinysrgb&w=400',
        featured: true
    },
    {
        id: 3,
        name: 'Burger Duplo',
        description: 'Dois hambúrgueres suculentos com queijo, alface, tomate e molho especial',
        price: 38.90,
        category: 'burgers',
        image: 'https://images.pexels.com/photos/1556698/pexels-photo-1556698.jpeg?auto=compress&cs=tinysrgb&w=400',
        featured: false
    },
    {
        id: 4,
        name: 'Combo Clássico',
        description: 'Burger Clássico + Batata Frita + Refrigerante 350ml',
        price: 35.90,
        category: 'combos',
        image: 'https://images.pexels.com/photos/2271107/pexels-photo-2271107.jpeg?auto=compress&cs=tinysrgb&w=400',
        featured: true
    },
    {
        id: 5,
        name: 'Combo Bacon',
        description: 'Burger Bacon + Batata Frita + Refrigerante 350ml',
        price: 42.90,
        category: 'combos',
        image: 'https://images.pexels.com/photos/1199957/pexels-photo-1199957.jpeg?auto=compress&cs=tinysrgb&w=400',
        featured: false
    },
    {
        id: 6,
        name: 'Combo Família',
        description: '2 Burgers + 2 Batatas + 2 Refrigerantes',
        price: 75.90,
        category: 'combos',
        image: 'https://images.pexels.com/photos/2282532/pexels-photo-2282532.jpeg?auto=compress&cs=tinysrgb&w=400',
        featured: true
    },
    {
        id: 7,
        name: 'Coca-Cola 350ml',
        description: 'Refrigerante Coca-Cola gelado',
        price: 8.90,
        category: 'drinks',
        image: 'https://images.pexels.com/photos/2775860/pexels-photo-2775860.jpeg?auto=compress&cs=tinysrgb&w=400',
        featured: false
    },
    {
        id: 8,
        name: 'Suco Natural',
        description: 'Suco natural de laranja 400ml',
        price: 12.90,
        category: 'drinks',
        image: 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=400',
        featured: false
    }
];

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    // Remove Bolt watermark
    setTimeout(() => {
        const watermarks = document.querySelectorAll('div[style*="position: fixed"][style*="bottom"][style*="right"]');
        watermarks.forEach(el => {
            if (el.textContent.includes('Made in Bolt') || el.textContent.includes('Bolt')) {
                el.remove();
            }
        });
    }, 100);
    
    // Keep checking and removing watermark
    setInterval(() => {
        const watermarks = document.querySelectorAll('div[style*="position: fixed"][style*="bottom"][style*="right"]');
        watermarks.forEach(el => {
            if (el.textContent.includes('Made in Bolt') || el.textContent.includes('Bolt')) {
                el.remove();
            }
        });
    }, 1000);
    
    initializeApp();
    loadFeaturedProducts();
    loadMenuProducts();
    updateCartCount();
    updateCartDisplay();
    setupEventListeners();
});

function initializeApp() {
    // Check if user is logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUserInterface();
    }
    
    // Setup mobile menu
    setupMobileMenu();
}

function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });
    
    // Close menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

function setupEventListeners() {
    // Login form
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    
    // Register form
    document.getElementById('register-form').addEventListener('submit', handleRegister);
}

function showPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    document.getElementById(pageName + '-page').classList.add('active');
    currentPage = pageName;
    
    // Update page-specific content
    if (pageName === 'cart') {
        updateCartDisplay();
    }
    
    // Scroll to top
    window.scrollTo(0, 0);
}

function loadFeaturedProducts() {
    const featuredProducts = products.filter(product => product.featured);
    const container = document.getElementById('featured-products');
    container.innerHTML = featuredProducts.map(product => createProductCard(product)).join('');
}

function loadMenuProducts(category = 'all') {
    const filteredProducts = category === 'all' ? products : products.filter(p => p.category === category);
    const container = document.getElementById('menu-products');
    container.innerHTML = filteredProducts.map(product => createProductCard(product)).join('');
}

function createProductCard(product) {
    return `
        <div class="product-card" data-category="${product.category}">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">R$ ${product.price.toFixed(2).replace('.', ',')}</div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">Adicionar ao Carrinho</button>
            </div>
        </div>
    `;
}

function filterCategory(category) {
    // Update active button
    document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Load products
    loadMenuProducts(category);
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
    showSuccessMessage('Produto adicionado ao carrinho!');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    updateCartDisplay();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCart();
            updateCartDisplay();
        }
    }
}

function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartEmpty = document.getElementById('cart-empty');
    const cartSummary = document.getElementById('cart-summary');
    
    if (cart.length === 0) {
        cartItems.style.display = 'none';
        cartEmpty.style.display = 'block';
        cartSummary.style.display = 'none';
    } else {
        cartItems.style.display = 'block';
        cartEmpty.style.display = 'none';
        cartSummary.style.display = 'block';
        
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</div>
                </div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Remover</button>
            </div>
        `).join('');
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        document.getElementById('cart-total').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    }
}

function checkout() {
    if (cart.length === 0) {
        showSuccessMessage('Seu carrinho está vazio!');
        return;
    }
    
    if (!currentUser) {
        showSuccessMessage('Você precisa fazer login para finalizar o pedido');
        setTimeout(() => showPage('login'), 1500);
        return;
    }
    
    showPage('order');
    displayOrderSummary();
}

function displayOrderSummary() {
    const orderSummary = document.getElementById('order-summary');
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    orderSummary.innerHTML = `
        <div class="cart-summary">
            <h3>Itens do Pedido:</h3>
            ${cart.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">R$ ${item.price.toFixed(2).replace('.', ',')} x ${item.quantity}</div>
                    </div>
                    <div class="cart-item-price">R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</div>
                </div>
            `).join('')}
            <div class="summary-item">
                <span>Total do Pedido:</span>
                <span>R$ ${total.toFixed(2).replace('.', ',')}</span>
            </div>
        </div>
    `;
}

function confirmOrder() {
    // Here you would normally send the order to your backend
    const orderData = {
        user: currentUser,
        items: cart,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        timestamp: new Date().toISOString()
    };
    
    console.log('Pedido confirmado:', orderData);
    
    // Clear cart
    cart = [];
    updateCart();
    
    // Show success message
    showSuccessMessage('Pedido confirmado com sucesso! Você receberá uma confirmação em breve.');
    
    // Redirect to home
    setTimeout(() => {
        showPage('home');
    }, 2000);
}

function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    
    // Here you would normally validate with your backend
    // For demo purposes, we'll simulate a successful login
    
    if (email && password) {
        currentUser = {
            id: Date.now(),
            name: email.split('@')[0],
            email: email
        };
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateUserInterface();
        showSuccessMessage('Login realizado com sucesso!');
        
        // Redirect based on context
        setTimeout(() => {
            if (cart.length > 0) {
                showPage('cart');
            } else {
                showPage('home');
            }
        }, 1500);
    }
}

function handleRegister(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    
    // Basic validation
    if (password !== confirmPassword) {
        showSuccessMessage('As senhas não coincidem!');
        return;
    }
    
    if (name && email && password) {
        // Here you would normally send to your backend
        currentUser = {
            id: Date.now(),
            name: name,
            email: email
        };
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateUserInterface();
        showSuccessMessage('Conta criada com sucesso!');
        
        setTimeout(() => showPage('home'), 1500);
    }
}

function updateUserInterface() {
    const loginLink = document.getElementById('login-link');
    const registerLink = document.getElementById('register-link');
    
    if (currentUser) {
        loginLink.textContent = `Olá, ${currentUser.name}`;
        loginLink.onclick = logout;
        registerLink.style.display = 'none';
    } else {
        loginLink.textContent = 'Login';
        loginLink.onclick = () => showPage('login');
        registerLink.style.display = 'block';
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUserInterface();
    showSuccessMessage('Logout realizado com sucesso!');
    setTimeout(() => showPage('home'), 1500);
}

function showSuccessMessage(message) {
    const successMessage = document.getElementById('success-message');
    const successText = document.getElementById('success-text');
    
    successText.textContent = message;
    successMessage.classList.add('show');
    
    setTimeout(() => {
        successMessage.classList.remove('show');
    }, 3000);
}

// Close success message when clicking outside
document.addEventListener('click', function(e) {
    const successMessage = document.getElementById('success-message');
    if (e.target === successMessage) {
        successMessage.classList.remove('show');
    }
});