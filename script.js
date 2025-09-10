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
    initializeApp();
    loadFeaturedProducts();
    loadMenuProducts();
    updateCartCount();
    updateCartDisplay();
    setupEventListeners();
    setupScrollEffects();
    setupAnimations();
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

function setupScrollEffects() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

function setupAnimations() {
    // Add floating animation to hero image
    const heroImage = document.querySelector('.hero-image img');
    if (heroImage) {
        heroImage.classList.add('floating');
    }
    
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe product cards
    document.querySelectorAll('.product-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
}

function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        
        // Animate hamburger
        const spans = hamburger.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
    
    // Close menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            // Reset hamburger
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });
}

function setupEventListeners() {
    // Login form
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    
    // Register form
    document.getElementById('register-form').addEventListener('submit', handleRegister);
    
    // Add click effects to buttons
    document.addEventListener('click', function(e) {
        if (e.target.matches('button') || e.target.matches('.cta-button')) {
            createRippleEffect(e);
        }
    });
}

function createRippleEffect(e) {
    const button = e.target;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    const ripple = document.createElement('span');
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    `;
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

function showPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Small delay for smooth transition
    setTimeout(() => {
        // Show selected page
        document.getElementById(pageName + '-page').classList.add('active');
        currentPage = pageName;
        
        // Update page-specific content
        if (pageName === 'cart') {
            updateCartDisplay();
        }
        
        // Re-setup animations for new page
        setupAnimations();
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
}

// Add CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

function loadFeaturedProducts() {
    const featuredProducts = products.filter(product => product.featured);
    const container = document.getElementById('featured-products');
    container.innerHTML = featuredProducts.map((product, index) => {
        const card = createProductCard(product);
        return card.replace('<div class="product-card"', `<div class="product-card" style="animation-delay: ${index * 0.1}s"`);
    }).join('');
}

function loadMenuProducts(category = 'all') {
    const filteredProducts = category === 'all' ? products : products.filter(p => p.category === category);
    const container = document.getElementById('menu-products');
    container.innerHTML = filteredProducts.map((product, index) => {
        const card = createProductCard(product);
        return card.replace('<div class="product-card"', `<div class="product-card" style="animation-delay: ${index * 0.1}s"`);
    }).join('');
    
    // Re-setup scroll animations
    setTimeout(setupAnimations, 100);
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
    // Update active button with animation
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.style.transform = 'scale(1)';
    });
    
    event.target.classList.add('active');
    event.target.style.transform = 'scale(1.05)';
    
    setTimeout(() => {
        event.target.style.transform = 'scale(1)';
    }, 200);
    
    // Load products with stagger animation
    const container = document.getElementById('menu-products');
    container.style.opacity = '0';
    container.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        loadMenuProducts(category);
        container.style.transition = 'all 0.5s ease';
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
    }, 200);
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
    
    // Animate cart count
    const cartCount = document.getElementById('cart-count');
    cartCount.style.transform = 'scale(1.3)';
    cartCount.style.background = '#28a745';
    
    setTimeout(() => {
        cartCount.style.transform = 'scale(1)';
        cartCount.style.background = '#fff';
    }, 300);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    updateCartDisplay();
    
    // Animate removal
    const cartItems = document.getElementById('cart-items');
    cartItems.style.transition = 'all 0.3s ease';
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
    const cartCountElement = document.getElementById('cart-count');
    cartCountElement.textContent = count;
    
    // Animate if count changed
    if (count > 0) {
        cartCountElement.style.animation = 'none';
        setTimeout(() => {
            cartCountElement.style.animation = 'pulse 2s infinite';
        }, 10);
    }
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
        
        cartItems.innerHTML = cart.map((item, index) => `
            <div class="cart-item" style="animation-delay: ${index * 0.1}s">
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
        const totalElement = document.getElementById('cart-total');
        totalElement.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
        
        // Animate total
        totalElement.style.transform = 'scale(1.05)';
        setTimeout(() => {
            totalElement.style.transform = 'scale(1)';
        }, 200);
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
    
    // Add loading state
    const checkoutBtn = document.querySelector('.checkout-button');
    checkoutBtn.classList.add('loading');
    checkoutBtn.textContent = 'Processando...';
    
    setTimeout(() => {
        checkoutBtn.classList.remove('loading');
        checkoutBtn.textContent = 'Finalizar Pedido';
        showPage('order');
        displayOrderSummary();
    }, 1500);
}

function displayOrderSummary() {
    const orderSummary = document.getElementById('order-summary');
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    orderSummary.innerHTML = `
        <div class="cart-summary">
            <h3>Itens do Pedido:</h3>
            ${cart.map((item, index) => `
                <div class="cart-item" style="animation-delay: ${index * 0.1}s">
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
    // Add loading state
    const confirmBtn = document.querySelector('.confirm-button');
    confirmBtn.classList.add('loading');
    confirmBtn.textContent = 'Confirmando...';
    
    // Here you would normally send the order to your backend
    const orderData = {
        user: currentUser,
        items: cart,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        timestamp: new Date().toISOString()
    };
    
    console.log('Pedido confirmado:', orderData);
    
    setTimeout(() => {
        confirmBtn.classList.remove('loading');
        confirmBtn.textContent = 'Confirmar Pedido';
        
        // Clear cart
        cart = [];
        updateCart();
        
        // Show success message
        showSuccessMessage('Pedido confirmado com sucesso! Você receberá uma confirmação em breve.');
        
        // Redirect to home
        setTimeout(() => {
            showPage('home');
        }, 2000);
    }, 2000);
}

function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    
    // Add loading state
    const loginBtn = document.querySelector('#login-form .auth-button');
    loginBtn.classList.add('loading');
    loginBtn.textContent = 'Entrando...';
    
    // Here you would normally validate with your backend
    // For demo purposes, we'll simulate a successful login
    
    setTimeout(() => {
        if (email && password) {
            currentUser = {
                id: Date.now(),
                name: email.split('@')[0],
                email: email
            };
            
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            updateUserInterface();
            
            loginBtn.classList.remove('loading');
            loginBtn.textContent = 'Entrar';
            
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
    }, 1500);
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
    
    // Add loading state
    const registerBtn = document.querySelector('#register-form .auth-button');
    registerBtn.classList.add('loading');
    registerBtn.textContent = 'Cadastrando...';
    
    setTimeout(() => {
        if (name && email && password) {
            // Here you would normally send to your backend
            currentUser = {
                id: Date.now(),
                name: name,
                email: email
            };
            
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            updateUserInterface();
            
            registerBtn.classList.remove('loading');
            registerBtn.textContent = 'Cadastrar';
            
            showSuccessMessage('Conta criada com sucesso!');
            
            setTimeout(() => showPage('home'), 1500);
        }
    }, 1500);
}

function updateUserInterface() {
    const loginLink = document.getElementById('login-link');
    const registerLink = document.getElementById('register-link');
    
    if (currentUser) {
        loginLink.textContent = `Olá, ${currentUser.name}`;
        loginLink.onclick = logout;
        registerLink.style.display = 'none';
        
        // Add welcome animation
        loginLink.style.color = '#28a745';
        setTimeout(() => {
            loginLink.style.color = '#fff';
        }, 2000);
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
    
    // Auto hide after 3 seconds
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

// Add smooth scrolling for anchor links
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.1}px)`;
    }
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