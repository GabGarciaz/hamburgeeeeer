// Estado da aplicação
let currentPage = 'home';
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let user = JSON.parse(localStorage.getItem('user')) || null;

// Produtos do cardápio
const products = [
    {
        id: 1,
        name: 'Burger Clássico',
        price: 25.90,
        category: 'hamburgueres',
        image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Hambúrguer artesanal com carne bovina, queijo, alface e tomate'
    },
    {
        id: 2,
        name: 'Burger Bacon',
        price: 29.90,
        category: 'hamburgueres',
        image: 'https://images.pexels.com/photos/3738730/pexels-photo-3738730.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Hambúrguer com bacon crocante, queijo cheddar e molho especial'
    },
    {
        id: 3,
        name: 'Combo Família',
        price: 45.90,
        category: 'combos',
        image: 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: '2 hambúrgueres + batata grande + 2 refrigerantes'
    },
    {
        id: 4,
        name: 'Coca-Cola',
        price: 6.90,
        category: 'bebidas',
        image: 'https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Refrigerante gelado 350ml'
    },
    {
        id: 5,
        name: 'Burger Vegano',
        price: 27.90,
        category: 'hamburgueres',
        image: 'https://images.pexels.com/photos/1556909/pexels-photo-1556909.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Hambúrguer 100% vegetal com ingredientes frescos'
    },
    {
        id: 6,
        name: 'Combo Duplo',
        price: 39.90,
        category: 'combos',
        image: 'https://images.pexels.com/photos/2282532/pexels-photo-2282532.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Hambúrguer duplo + batata + refrigerante'
    }
];

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    updateCartCounter();
    
    // Animações de entrada
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

function initializeApp() {
    setupNavigation();
    setupMobileMenu();
    setupScrollEffects();
    showPage('home');
    
    // Remover marca d'água do Bolt
    removeBoltWatermark();
}

function removeBoltWatermark() {
    const observer = new MutationObserver(() => {
        const watermarks = document.querySelectorAll('[class*="bolt"], [id*="bolt"], div[style*="position: fixed"]');
        watermarks.forEach(el => {
            if (el.textContent && el.textContent.toLowerCase().includes('bolt')) {
                el.style.display = 'none';
                el.remove();
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            showPage(page);
            
            // Fechar menu mobile se estiver aberto
            document.querySelector('.nav-menu').classList.remove('active');
            document.querySelector('.hamburger').classList.remove('active');
        });
    });
}

function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

function setupScrollEffects() {
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollY = currentScrollY;
    });
}

function showPage(page) {
    // Esconder todas as páginas
    const pages = document.querySelectorAll('.page');
    pages.forEach(p => {
        p.classList.remove('active');
        p.style.display = 'none';
    });
    
    // Mostrar página selecionada
    const targetPage = document.getElementById(page);
    if (targetPage) {
        targetPage.style.display = 'block';
        setTimeout(() => {
            targetPage.classList.add('active');
        }, 10);
    }
    
    // Atualizar navegação ativa
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === page) {
            link.classList.add('active');
        }
    });
    
    currentPage = page;
    
    // Carregar conteúdo específico da página
    if (page === 'home') {
        loadFeaturedProducts();
    } else if (page === 'menu') {
        loadMenu();
    } else if (page === 'cart') {
        loadCart();
    } else if (page === 'orders') {
        loadOrders();
    }
}

function loadFeaturedProducts() {
    const container = document.querySelector('.featured-products');
    if (!container) return;
    
    const featuredProducts = products.slice(0, 3);
    container.innerHTML = featuredProducts.map((product, index) => `
        <div class="product-card" style="animation-delay: ${index * 0.1}s">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                <div class="product-overlay">
                    <button class="btn btn-primary" onclick="addToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i>
                        Adicionar
                    </button>
                </div>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">R$ ${product.price.toFixed(2)}</div>
            </div>
        </div>
    `).join('');
}

function loadMenu() {
    const container = document.querySelector('.menu-products');
    if (!container) return;
    
    const categories = ['todos', 'hamburgueres', 'combos', 'bebidas'];
    const filterButtons = document.querySelector('.menu-filters');
    
    if (filterButtons) {
        filterButtons.innerHTML = categories.map(cat => `
            <button class="filter-btn ${cat === 'todos' ? 'active' : ''}" 
                    onclick="filterProducts('${cat}')">
                ${cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
        `).join('');
    }
    
    displayProducts(products);
}

function filterProducts(category) {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    const filteredProducts = category === 'todos' 
        ? products 
        : products.filter(p => p.category === category);
    
    displayProducts(filteredProducts);
}

function displayProducts(productsToShow) {
    const container = document.querySelector('.menu-products');
    if (!container) return;
    
    container.innerHTML = productsToShow.map((product, index) => `
        <div class="product-card" style="animation-delay: ${index * 0.1}s">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                <div class="product-overlay">
                    <button class="btn btn-primary" onclick="addToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i>
                        Adicionar
                    </button>
                </div>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">R$ ${product.price.toFixed(2)}</div>
            </div>
        </div>
    `).join('');
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounter();
    showNotification(`${product.name} adicionado ao carrinho!`);
}

function updateCartCounter() {
    const counter = document.querySelector('.cart-counter');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (counter) {
        counter.textContent = totalItems;
        counter.style.display = totalItems > 0 ? 'block' : 'none';
        
        if (totalItems > 0) {
            counter.classList.add('pulse');
            setTimeout(() => counter.classList.remove('pulse'), 300);
        }
    }
}

function loadCart() {
    const container = document.querySelector('.cart-items');
    const totalElement = document.querySelector('.cart-total');
    
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h3>Seu carrinho está vazio</h3>
                <p>Adicione alguns produtos deliciosos!</p>
                <button class="btn btn-primary" onclick="showPage('menu')">
                    Ver Cardápio
                </button>
            </div>
        `;
        if (totalElement) totalElement.textContent = 'R$ 0,00';
        return;
    }
    
    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="item-info">
                <h4>${item.name}</h4>
                <p>R$ ${item.price.toFixed(2)}</p>
            </div>
            <div class="quantity-controls">
                <button onclick="updateQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
            <div class="item-total">
                R$ ${(item.price * item.quantity).toFixed(2)}
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (totalElement) {
        totalElement.textContent = `R$ ${total.toFixed(2)}`;
    }
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounter();
    loadCart();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounter();
    loadCart();
}

function checkout() {
    if (cart.length === 0) {
        showNotification('Seu carrinho está vazio!', 'error');
        return;
    }
    
    if (!user) {
        showNotification('Faça login para finalizar o pedido!', 'warning');
        showPage('login');
        return;
    }
    
    showPage('orders');
}

function loadOrders() {
    const container = document.querySelector('.order-summary');
    if (!container || cart.length === 0) return;
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    container.innerHTML = `
        <div class="order-items">
            ${cart.map(item => `
                <div class="order-item">
                    <span>${item.name} x${item.quantity}</span>
                    <span>R$ ${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            `).join('')}
        </div>
        <div class="order-total">
            <strong>Total: R$ ${total.toFixed(2)}</strong>
        </div>
        <button class="btn btn-primary btn-large" onclick="confirmOrder()">
            Confirmar Pedido
        </button>
    `;
}

function confirmOrder() {
    // Aqui será integrado com o backend futuramente
    const orderData = {
        user: user,
        items: cart,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        timestamp: new Date().toISOString()
    };
    
    console.log('Pedido confirmado:', orderData);
    
    // Limpar carrinho
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounter();
    
    showNotification('Pedido confirmado com sucesso!', 'success');
    showPage('home');
}

// Funções de autenticação
function login(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (!email || !password) {
        showNotification('Preencha todos os campos!', 'error');
        return;
    }
    
    // Simulação de login - integrar com backend futuramente
    const userData = {
        email: email,
        name: email.split('@')[0],
        id: Date.now()
    };
    
    user = userData;
    localStorage.setItem('user', JSON.stringify(user));
    
    showNotification('Login realizado com sucesso!', 'success');
    updateAuthUI();
    showPage('home');
}

function register(event) {
    event.preventDefault();
    
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;
    
    if (!name || !email || !password || !confirmPassword) {
        showNotification('Preencha todos os campos!', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('As senhas não coincidem!', 'error');
        return;
    }
    
    // Simulação de cadastro - integrar com backend futuramente
    const userData = {
        name: name,
        email: email,
        id: Date.now()
    };
    
    user = userData;
    localStorage.setItem('user', JSON.stringify(user));
    
    showNotification('Cadastro realizado com sucesso!', 'success');
    updateAuthUI();
    showPage('home');
}

function logout() {
    user = null;
    localStorage.removeItem('user');
    updateAuthUI();
    showNotification('Logout realizado com sucesso!', 'success');
    showPage('home');
}

function updateAuthUI() {
    const loginLink = document.querySelector('[data-page="login"]');
    const userInfo = document.querySelector('.user-info');
    
    if (user) {
        if (loginLink) loginLink.style.display = 'none';
        if (userInfo) {
            userInfo.style.display = 'block';
            userInfo.innerHTML = `
                <span>Olá, ${user.name}!</span>
                <button onclick="logout()" class="btn btn-secondary btn-small">Sair</button>
            `;
        }
    } else {
        if (loginLink) loginLink.style.display = 'block';
        if (userInfo) userInfo.style.display = 'none';
    }
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Efeitos visuais adicionais
function createRippleEffect(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Adicionar efeito ripple aos botões
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn')) {
        createRippleEffect(e);
    }
});

// Intersection Observer para animações
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observar elementos para animação
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.product-card, .feature-card, .section');
    animateElements.forEach(el => observer.observe(el));
});