// Coffee Products Data
const coffeeProducts = [
    {
        id: 1,
        name: "Jebena Buna",
        description: "Traditional Ethiopian coffee brewed in a clay pot for rich aroma.",
        price: 50,
        image: "buna.png"
    },
    {
        id: 2,
        name: "Macchiato",
        description: "Strong espresso mixed with milk, the pride of Ethiopian coffee.",
        price: 80,
        image: "macchiato.png"
    },
    {
        id: 3,
        name: "Coffee Spris",
        description: "A unique layered drink combining Ethiopian coffee with aromatic tea for a refreshing taste.",
        price: 30,
        image: "spris.png"
    },
    {
        id: 4,
        name: "Lemon Coffee",
        description: "A refreshing blend of bold coffee with a hint of zesty lemon flavor.",
        price: 40,
        image: "lemon.png"
    },
    {
        id: 5,
        name: "Mocha coffee",
        description: "A rich and smooth coffee made with espresso, chocolate, and steamed milk.",
        price: 60,
        image: "mocha.png"
    },
    {
        id: 6,
        name: "Butter Coffee",
        description: "A traditional Ethiopian coffee blended with rich butter for a smooth, energizing taste.",
        price: 80,
        image: "butter.png"
    }
];

// Payment Methods Configuration
const paymentMethods = {
    telebirr: {
        name: "Telebirr",
        account: "0933237131",
        accountName: "Habesha Coffee Store",
        instructions: [
            "Open your Telebirr app",
            "Go to 'Send Money'",
            "Enter the phone number above",
            "Enter the exact amount shown",
            "Add 'Order #' as reference",
            "Click send"
        ]
    },
    cbe: {
        name: "CBE Birr",
        account: "1000532594352",
        accountName: "Habesha Coffee shop",
        instructions: [
            "Go to any CBE branch or use CBE Birr app",
            "Use the account number above",
            "Account name: Habesha Coffee shop",
            "Transfer the exact amount shown",
            "Use your order number as reference"
        ]
    },
    mpesa: {
        name: "M-Pesa",
        account: "0712345678",
        accountName: "Habesha Coffee",
        instructions: [
            "Open your M-Pesa menu",
            "Select 'Lipa Na M-Pesa'",
            "Enter Business Number: 888888",
            "Account Number: Your phone number",
            "Enter the exact amount shown",
            "Enter your M-Pesa PIN"
        ]
    },
    cod: {
        name: "Cash on Delivery",
        instructions: [
            "No payment required now",
            "Pay when your order arrives",
            "Have exact change ready",
            "Cash only - no cards",
            "Delivery fee: 50 ETB"
        ]
    }
};

// Cart System
let cart = JSON.parse(localStorage.getItem('habeshaCoffeeCart')) || [];
let currentFilter = 'all';

// Transaction History
let transactions = JSON.parse(localStorage.getItem('habeshaCoffeeTransactions')) || [];

// DOM Elements
const productsContainer = document.getElementById('productsContainer');
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.querySelector('.cart-count');
const clearCartBtn = document.getElementById('clearCart');
const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutModal = document.getElementById('checkoutModal');
const closeCheckout = document.getElementById('closeCheckout');
const checkoutForm = document.getElementById('checkoutForm');
const orderSummary = document.getElementById('orderSummary');
const orderTotal = document.getElementById('orderTotal');
const confirmation = document.getElementById('confirmation');
const orderNumber = document.getElementById('orderNumber');
const closeConfirmation = document.getElementById('closeConfirmation');
const filterButtons = document.querySelectorAll('.filter-btn');

// New DOM Elements for Enhanced Checkout
const paymentProcessing = document.getElementById('paymentProcessing');
const transactionSuccess = document.getElementById('transactionSuccess');
const transactionHistory = document.getElementById('transactionHistory');
const closeHistory = document.getElementById('closeHistory');
const historyList = document.getElementById('historyList');
const totalTransactions = document.getElementById('totalTransactions');
const totalAmount = document.getElementById('totalAmount');
const searchTransactions = document.getElementById('searchTransactions');
const filterDate = document.getElementById('filterDate');
const printReceipt = document.getElementById('printReceipt');
const closeSuccess = document.getElementById('closeSuccess');
const successOrderNumber = document.getElementById('successOrderNumber');
const transactionId = document.getElementById('transactionId');
const successAmount = document.getElementById('successAmount');
const successMethod = document.getElementById('successMethod');
const successDate = document.getElementById('successDate');
const historyBtn = document.getElementById('historyBtn');

// Notification System
function createNotificationSystem() {
    const notificationContainer = document.createElement('div');
    notificationContainer.id = 'notification-container';
    notificationContainer.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-width: 300px;
    `;
    document.body.appendChild(notificationContainer);
    return notificationContainer;
}

const notificationContainer = createNotificationSystem();

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    
    let backgroundColor, icon;
    if (type === 'success') {
        backgroundColor = '#4CAF50';
        icon = '✓';
    } else if (type === 'error') {
        backgroundColor = '#f44336';
        icon = '✗';
    } else if (type === 'warning') {
        backgroundColor = '#ff9800';
        icon = '⚠';
    } else {
        backgroundColor = '#2196F3';
        icon = 'ℹ';
    }
    
    notification.style.cssText = `
        background-color: ${backgroundColor};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideIn 0.3s ease;
        transform-origin: top right;
    `;
    
    notification.innerHTML = `
        <span style="font-size: 18px; font-weight: bold;">${icon}</span>
        <span>${message}</span>
    `;
    
    notificationContainer.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Initialize the application
function init() {
    displayProducts();
    updateCartCount();
    setupEventListeners();
    setupEnhancedCheckout();
    setupTransactionHistory();
}

// Display coffee products
function displayProducts() {
    if (!productsContainer) {
        showNotification('Products container not found!', 'error');
        return;
    }
    
    productsContainer.innerHTML = '';
    
    const filteredProducts = coffeeProducts; // Removed filter logic since it wasn't working
    
    if (filteredProducts.length === 0) {
        productsContainer.innerHTML = '<p style="text-align: center; grid-column: 1 / -1; color: #666;">No products found</p>';
        return;
    }
    
    filteredProducts.forEach(product => {
        try {
            const productCard = createProductCard(product);
            productsContainer.appendChild(productCard);
        } catch (error) {
            console.error('Error creating product card:', error);
            showNotification(`Error loading product: ${product.name}`, 'error');
        }
    });
}

// Create product card HTML
function createProductCard(product) {
    const div = document.createElement('div');
    div.className = 'product-card';
    div.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/300x200?text=Coffee+Image'">
        </div>
        <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-price">${product.price} ETB</div>
            <div class="product-actions">
                <div class="quantity-control">
                    <button type="button" class="quantity-btn minus" data-id="${product.id}" data-action="decrease">-</button>
                    <input type="text" class="quantity-input" id="qty-${product.id}" value="1" readonly>
                    <button type="button" class="quantity-btn plus" data-id="${product.id}" data-action="increase">+</button>
                </div>
                <button type="button" class="add-to-cart" data-id="${product.id}">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
            </div>
        </div>
    `;
    return div;
}

// Event Delegation for dynamic elements
function handleProductActions(e) {
    const target = e.target;
    
    // Handle quantity buttons
    if (target.classList.contains('quantity-btn') && target.dataset.id) {
        const productId = parseInt(target.dataset.id);
        const action = target.dataset.action;
        const change = action === 'increase' ? 1 : -1;
        updateQuantity(productId, change);
    }
    
    // Handle add to cart buttons for products
    if (target.classList.contains('add-to-cart') || target.closest('.add-to-cart')) {
        const button = target.classList.contains('add-to-cart') ? target : target.closest('.add-to-cart');
        const productId = parseInt(button.dataset.id);
        addToCart(productId);
    }
}

// Cart Functions
function addToCart(productId) {
    try {
        const product = coffeeProducts.find(p => p.id === productId);
        if (!product) {
            showNotification('Product not found!', 'error');
            return;
        }
        
        const quantityInput = document.getElementById(`qty-${productId}`);
        if (!quantityInput) {
            showNotification('Quantity input not found!', 'error');
            return;
        }
        
        const quantity = parseInt(quantityInput.value);
        if (isNaN(quantity) || quantity < 1) {
            showNotification('Invalid quantity!', 'error');
            return;
        }
        
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: productId,
                name: product.name,
                price: product.price,
                quantity: quantity,
                image: product.image
            });
        }
        
        updateCart();
        showNotification(`${quantity} ${product.name} added to cart!`, 'success');
        
        // Reset quantity to 1
        quantityInput.value = 1;
    } catch (error) {
        console.error('Error adding to cart:', error);
        showNotification('Error adding item to cart!', 'error');
    }
}

function updateQuantity(productId, change) {
    try {
        const input = document.getElementById(`qty-${productId}`);
        if (!input) {
            showNotification('Quantity input not found!', 'error');
            return;
        }
        
        let quantity = parseInt(input.value) + change;
        
        if (quantity < 1) quantity = 1;
        if (quantity > 10) {
            quantity = 10;
            showNotification('Maximum quantity is 10 per item', 'warning');
        }
        
        input.value = quantity;
    } catch (error) {
        console.error('Error updating quantity:', error);
        showNotification('Error updating quantity!', 'error');
    }
}

function updateCart() {
    try {
        // Save to localStorage
        localStorage.setItem('habeshaCoffeeCart', JSON.stringify(cart));
        
        // Update cart count
        updateCartCount();
        
        // Update cart display if modal is open
        if (cartModal.style.display === 'flex') {
            displayCartItems();
        }
    } catch (error) {
        console.error('Error updating cart:', error);
        showNotification('Error updating cart!', 'error');
    }
}

function updateCartCount() {
    try {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCount) {
            cartCount.textContent = totalItems;
        }
    } catch (error) {
        console.error('Error updating cart count:', error);
    }
}

function displayCartItems() {
    try {
        if (!cartItems) return;
        
        cartItems.innerHTML = '';
        
        if (cart.length === 0) {
            cartItems.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">Your cart is empty</p>';
            if (cartTotal) cartTotal.textContent = '0 ETB';
            return;
        }
        
        let total = 0;
        
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const itemDiv = document.createElement('div');
            itemDiv.className = 'cart-item';
            itemDiv.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image || 'https://via.placeholder.com/50x50?text=Item'}" alt="${item.name}">
                </div>
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <div class="cart-item-price">${item.price} ETB × ${item.quantity}</div>
                </div>
                <div class="cart-item-actions">
                    <button type="button" class="quantity-btn" data-index="${index}" data-change="-1">-</button>
                    <span>${item.quantity}</span>
                    <button type="button" class="quantity-btn" data-index="${index}" data-change="1">+</button>
                    <button type="button" class="remove-btn" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            cartItems.appendChild(itemDiv);
        });
        
        if (cartTotal) {
            cartTotal.textContent = `${total} ETB`;
        }
    } catch (error) {
        console.error('Error displaying cart items:', error);
        showNotification('Error loading cart items!', 'error');
    }
}

function updateCartItem(index, change) {
    try {
        if (index < 0 || index >= cart.length) {
            showNotification('Invalid cart item!', 'error');
            return;
        }
        
        cart[index].quantity += change;
        
        if (cart[index].quantity < 1) {
            cart.splice(index, 1);
            showNotification('Item removed from cart', 'warning');
        }
        
        updateCart();
    } catch (error) {
        console.error('Error updating cart item:', error);
        showNotification('Error updating cart item!', 'error');
    }
}

function removeFromCart(index) {
    try {
        if (index < 0 || index >= cart.length) {
            showNotification('Invalid cart item!', 'error');
            return;
        }
        
        const itemName = cart[index].name;
        cart.splice(index, 1);
        updateCart();
        showNotification(`${itemName} removed from cart`, 'warning');
    } catch (error) {
        console.error('Error removing from cart:', error);
        showNotification('Error removing item from cart!', 'error');
    }
}

function clearCart() {
    try {
        if (cart.length === 0) {
            showNotification('Cart is already empty!', 'info');
            return;
        }
        
        if (confirm('Are you sure you want to clear your cart?')) {
            cart = [];
            updateCart();
            showNotification('Cart cleared successfully!', 'success');
            if (cartModal) cartModal.style.display = 'none';
        }
    } catch (error) {
        console.error('Error clearing cart:', error);
        showNotification('Error clearing cart!', 'error');
    }
}

// Enhanced Checkout Functions
function openCheckout() {
    try {
        if (cart.length === 0) {
            showNotification('Your cart is empty!', 'error');
            return;
        }
        
        // Reset form to step 1
        const steps = document.querySelectorAll('.form-step');
        steps.forEach(step => step.classList.remove('active'));
        document.getElementById('step1').classList.add('active');
        
        // Update order summary
        if (!orderSummary) {
            showNotification('Order summary element not found!', 'error');
            return;
        }
        
        orderSummary.innerHTML = '';
        let total = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const div = document.createElement('div');
            div.style.cssText = 'margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #eee;';
            div.innerHTML = `
                ${item.name} (${item.quantity}) - ${itemTotal} ETB
            `;
            orderSummary.appendChild(div);
        });
        
        if (orderTotal) {
            orderTotal.textContent = `${total} ETB`;
        }
        
        // Show checkout modal
        if (cartModal) cartModal.style.display = 'none';
        if (checkoutModal) checkoutModal.style.display = 'flex';
        
        // Focus on first input
        const nameInput = document.getElementById('name');
        if (nameInput) nameInput.focus();
    } catch (error) {
        console.error('Error opening checkout:', error);
        showNotification('Error opening checkout!', 'error');
    }
}

// Setup Enhanced Checkout
function setupEnhancedCheckout() {
    // Setup multi-step navigation
    setupStepNavigation();
    
    // Setup payment method change listeners
    setupPaymentMethodListeners();
    
    // Setup print receipt button
    if (printReceipt) {
        printReceipt.addEventListener('click', printOrderReceipt);
    }
    
    // Setup close success button
    if (closeSuccess) {
        closeSuccess.addEventListener('click', () => {
            if (transactionSuccess) transactionSuccess.style.display = 'none';
            if (confirmation) confirmation.style.display = 'none';
        });
    }
}

// Setup Step Navigation
function setupStepNavigation() {
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    
    // Next Step
    nextButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const currentStep = button.closest('.form-step');
            const nextStepId = button.dataset.next;
            const nextStep = document.getElementById(nextStepId);
            
            // Validate current step before proceeding
            if (validateStep(currentStep.id)) {
                currentStep.classList.remove('active');
                nextStep.classList.add('active');
                
                // Update review sections if going to step 3
                if (nextStepId === 'step3') {
                    updateReviewSections();
                }
                
                // Update payment details if on step 2
                if (currentStep.id === 'step1' && nextStepId === 'step2') {
                    updatePaymentDetails();
                }
            }
        });
    });
    
    // Previous Step
    prevButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const currentStep = button.closest('.form-step');
            const prevStepId = button.dataset.prev;
            const prevStep = document.getElementById(prevStepId);
            
            currentStep.classList.remove('active');
            prevStep.classList.add('active');
        });
    });
}

// Setup Payment Method Listeners
function setupPaymentMethodListeners() {
    const paymentOptions = document.querySelectorAll('input[name="payment"]');
    paymentOptions.forEach(option => {
        option.addEventListener('change', () => {
            updatePaymentDetails();
        });
    });
}

// Validate Step
function validateStep(stepId) {
    let isValid = true;
    const errors = [];
    
    if (stepId === 'step1') {
        // Validate customer information
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const region = document.getElementById('region').value;
        const zone = document.getElementById('zone').value.trim();
        const woreda = document.getElementById('woreda').value.trim();
        const address = document.getElementById('address').value.trim();
        
        // Validate name
        if (!name) {
            errors.push('Full name is required');
            highlightError('name');
            isValid = false;
        }
        
        // Validate phone
        const phoneRegex = /^(\+251|0)?9\d{8}$/;
        const cleanPhone = phone.replace(/\s/g, '');
        if (!phone) {
            errors.push('Phone number is required');
            highlightError('phone');
            isValid = false;
        } else if (!phoneRegex.test(cleanPhone)) {
            errors.push('Please enter a valid Ethiopian phone number (e.g., 0912345678 or +251912345678)');
            highlightError('phone');
            isValid = false;
        }
        
        // Validate region
        if (!region) {
            errors.push('Please select your region');
            highlightError('region');
            isValid = false;
        }
        
        // Validate zone
        if (!zone) {
            errors.push('Zone is required');
            highlightError('zone');
            isValid = false;
        }
        
        // Validate woreda
        if (!woreda) {
            errors.push('Woreda is required');
            highlightError('woreda');
            isValid = false;
        }
        
        // Validate address
        if (!address) {
            errors.push('Address is required');
            highlightError('address');
            isValid = false;
        } else if (address.length < 10) {
            errors.push('Please provide a more detailed address (minimum 10 characters)');
            highlightError('address');
            isValid = false;
        }
    } else if (stepId === 'step2') {
        // Validate payment details
        const paymentMethod = document.querySelector('input[name="payment"]:checked');
        if (!paymentMethod) {
            errors.push('Please select a payment method');
            isValid = false;
        } else if (paymentMethod.value !== 'cod') {
            const paymentReference = document.getElementById('paymentReference');
            if (paymentReference && !paymentReference.value.trim()) {
                errors.push('Please enter your transaction reference number');
                highlightError('paymentReference');
                isValid = false;
            }
        }
    } else if (stepId === 'step3') {
        // Validate terms agreement
        const terms = document.getElementById('terms');
        if (!terms || !terms.checked) {
            errors.push('You must agree to the terms and conditions');
            isValid = false;
        }
    }
    
    // Show errors
    if (errors.length > 0) {
        errors.forEach(error => {
            showNotification(error, 'error');
        });
    }
    
    return isValid;
}

function highlightError(fieldId) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.classList.add('error-highlight');
        setTimeout(() => {
            field.classList.remove('error-highlight');
        }, 3000);
    }
}

// Update Payment Details
function updatePaymentDetails() {
    const paymentMethod = document.querySelector('input[name="payment"]:checked');
    if (!paymentMethod) return;
    
    const method = paymentMethod.value;
    const paymentDetails = document.getElementById('paymentDetails');
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = method === 'cod' ? 50 : 0;
    const finalAmount = totalAmount + deliveryFee;
    
    let html = '';
    
    switch(method) {
        case 'telebirr':
            html = `
                <div class="payment-details-content active">
                    <div class="payment-instruction">
                        <h5>How to Pay with ${paymentMethods[method].name}:</h5>
                        <ol>
                            ${paymentMethods[method].instructions.map(instruction => `<li>${instruction}</li>`).join('')}
                        </ol>
                    </div>
                    <div class="account-info highlight">
                        <p>Send money to this phone number:</p>
                        <div class="account-number">${paymentMethods[method].account}</div>
                        <div class="account-name">${paymentMethods[method].accountName}</div>
                        <div class="payment-amount">${finalAmount} ETB</div>
                        <p class="form-hint">Amount must be exact. Include your order number as reference.</p>
                    </div>
                    <div class="verify-payment">
                        <h5>Verify Your Payment</h5>
                        <input type="text" id="paymentReference" placeholder="Enter transaction reference number" maxlength="20" required>
                        <button type="button" class="btn-primary" onclick="verifyPayment()">
                            <i class="fas fa-check-circle"></i> Verify & Continue
                        </button>
                    </div>
                </div>
            `;
            break;
            
        case 'cbe':
            html = `
                <div class="payment-details-content active">
                    <div class="payment-instruction">
                        <h5>How to Pay with CBE Birr:</h5>
                        <ol>
                            ${paymentMethods.cbe.instructions.map(instruction => `<li>${instruction}</li>`).join('')}
                        </ol>
                    </div>
                    <div class="account-info highlight">
                        <p>Transfer to this CBE account:</p>
                        <div class="account-number">${paymentMethods.cbe.account}</div>
                        <div class="account-name">${paymentMethods.cbe.accountName}</div>
                        <div class="payment-amount">${finalAmount} ETB</div>
                        <p class="form-hint">Use your order number as reference. Bank transfer may take 1-2 hours.</p>
                    </div>
                    <div class="verify-payment">
                        <h5>Verify Your Payment</h5>
                        <input type="text" id="paymentReference" placeholder="Enter transaction ID or reference" maxlength="20" required>
                        <button type="button" class="btn-primary" onclick="verifyPayment()">
                            <i class="fas fa-check-circle"></i> Verify Bank Transfer
                        </button>
                    </div>
                </div>
            `;
            break;
            
        case 'mpesa':
            html = `
                <div class="payment-details-content active">
                    <div class="payment-instruction">
                        <h5>How to Pay with ${paymentMethods[method].name}:</h5>
                        <ol>
                            ${paymentMethods[method].instructions.map(instruction => `<li>${instruction}</li>`).join('')}
                        </ol>
                    </div>
                    <div class="account-info highlight">
                        <p>Send money to this M-Pesa number:</p>
                        <div class="account-number">${paymentMethods[method].account}</div>
                        <div class="account-name">${paymentMethods[method].accountName}</div>
                        <div class="payment-amount">${finalAmount} ETB</div>
                        <p class="form-hint">Amount must be exact. Include your order number as reference.</p>
                    </div>
                    <div class="verify-payment">
                        <h5>Verify Your Payment</h5>
                        <input type="text" id="paymentReference" placeholder="Enter transaction reference number" maxlength="20" required>
                        <button type="button" class="btn-primary" onclick="verifyPayment()">
                            <i class="fas fa-check-circle"></i> Verify & Continue
                        </button>
                    </div>
                </div>
            `;
            break;
            
        case 'cod':
            html = `
                <div class="payment-details-content active">
                    <div class="payment-instruction">
                        <h5>Cash on Delivery Instructions:</h5>
                        <ol>
                            ${paymentMethods.cod.instructions.map(instruction => `<li>${instruction}</li>`).join('')}
                        </ol>
                    </div>
                    <div class="account-info">
                        <p>No payment needed now. You'll pay when you receive your order.</p>
                        <div class="payment-amount">${finalAmount} ETB</div>
                        <p class="form-hint">Total includes 50 ETB delivery fee. Have exact change ready.</p>
                    </div>
                </div>
            `;
            break;
    }
    
    if (paymentDetails) {
        paymentDetails.innerHTML = html;
    }
}

// Verify Payment
function verifyPayment() {
    const reference = document.getElementById('paymentReference');
    if (!reference || !reference.value.trim()) {
        showNotification('Please enter your transaction reference number', 'error');
        return;
    }
    
    // Simulate verification
    showNotification('Payment verified successfully!', 'success');
    
    // Enable next step
    setTimeout(() => {
        const nextStepBtn = document.querySelector('.next-step[data-next="step3"]');
        if (nextStepBtn) nextStepBtn.click();
    }, 1000);
}

// Update Review Sections
function updateReviewSections() {
    // Update customer info
    const reviewCustomer = document.getElementById('reviewCustomer');
    if (reviewCustomer) {
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const phone2 = document.getElementById('phone2').value;
        const region = document.getElementById('region').options[document.getElementById('region').selectedIndex].text;
        
        reviewCustomer.innerHTML = `
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            ${phone2 ? `<p><strong>Alt Phone:</strong> ${phone2}</p>` : ''}
            <p><strong>Region:</strong> ${region}</p>
        `;
    }
    
    // Update address info
    const reviewAddress = document.getElementById('reviewAddress');
    if (reviewAddress) {
        const zone = document.getElementById('zone').value;
        const woreda = document.getElementById('woreda').value;
        const kebele = document.getElementById('kebele').value;
        const address = document.getElementById('address').value;
        
        reviewAddress.innerHTML = `
            <p><strong>Zone:</strong> ${zone}</p>
            <p><strong>Woreda:</strong> ${woreda}</p>
            ${kebele ? `<p><strong>Kebele:</strong> ${kebele}</p>` : ''}
            <p><strong>Address:</strong> ${address}</p>
        `;
    }
    
    // Update payment info
    const reviewPayment = document.getElementById('reviewPayment');
    if (reviewPayment) {
        const paymentMethod = document.querySelector('input[name="payment"]:checked');
        if (paymentMethod) {
            const method = paymentMethods[paymentMethod.value];
            reviewPayment.innerHTML = `
                <p><strong>Method:</strong> ${method.name}</p>
                ${paymentMethod.value !== 'cod' ? `<p><strong>Account:</strong> ${method.account}</p>` : ''}
            `;
        }
    }
    
    // Update order items
    const reviewItems = document.getElementById('reviewItems');
    const reviewTotal = document.getElementById('reviewTotal');
    if (reviewItems && reviewTotal) {
        reviewItems.innerHTML = '';
        let total = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const itemDiv = document.createElement('div');
            itemDiv.className = 'review-item';
            itemDiv.innerHTML = `
                <span>${item.name} (${item.quantity})</span>
                <span>${itemTotal} ETB</span>
            `;
            reviewItems.appendChild(itemDiv);
        });
        
        // Add delivery fee for COD
        const paymentMethod = document.querySelector('input[name="payment"]:checked');
        if (paymentMethod && paymentMethod.value === 'cod') {
            total += 50;
            const deliveryDiv = document.createElement('div');
            deliveryDiv.className = 'review-item';
            deliveryDiv.innerHTML = `
                <span>Delivery Fee</span>
                <span>50 ETB</span>
            `;
            reviewItems.appendChild(deliveryDiv);
        }
        
        reviewTotal.textContent = `${total} ETB`;
    }
}

// Enhanced Process Order Function
function processOrder(event) {
    event.preventDefault();
    
    try {
        // Validate all steps
        if (!validateStep('step1') || !validateStep('step2') || !validateStep('step3')) {
            showNotification('Please fix all errors before submitting', 'error');
            return;
        }
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            phone2: document.getElementById('phone2').value.trim(),
            region: document.getElementById('region').options[document.getElementById('region').selectedIndex].text,
            zone: document.getElementById('zone').value.trim(),
            woreda: document.getElementById('woreda').value.trim(),
            kebele: document.getElementById('kebele').value.trim(),
            address: document.getElementById('address').value.trim(),
            paymentMethod: document.querySelector('input[name="payment"]:checked').value,
            paymentReference: document.getElementById('paymentReference') ? document.getElementById('paymentReference').value.trim() : ''
        };
        
        // Generate order and transaction IDs
        const newOrderNumber = 'HAB' + Date.now().toString().slice(-8);
        const newTransactionId = 'TRX' + Math.random().toString(36).substr(2, 9).toUpperCase();
        
        // Calculate total
        let total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        if (formData.paymentMethod === 'cod') {
            total += 50; // Delivery fee
        }
        
        // Prepare order data
        const orderData = {
            orderNumber: newOrderNumber,
            transactionId: newTransactionId,
            customer: formData,
            items: [...cart],
            total: total,
            paymentMethod: formData.paymentMethod,
            paymentReference: formData.paymentReference,
            timestamp: new Date().toISOString(),
            status: formData.paymentMethod === 'cod' ? 'pending' : 'paid',
            deliveryStatus: 'processing'
        };
        
        // Save order to localStorage
        const orders = JSON.parse(localStorage.getItem('habeshaCoffeeOrders')) || [];
        orders.push(orderData);
        localStorage.setItem('habeshaCoffeeOrders', JSON.stringify(orders));
        
        // Save transaction to history
        const transaction = {
            id: newTransactionId,
            orderNumber: newOrderNumber,
            amount: total,
            method: formData.paymentMethod,
            status: formData.paymentMethod === 'cod' ? 'pending' : 'completed',
            date: new Date().toISOString(),
            reference: formData.paymentReference
        };
        
        transactions.push(transaction);
        localStorage.setItem('habeshaCoffeeTransactions', JSON.stringify(transactions));
        
        // Show processing modal for digital payments
        if (formData.paymentMethod !== 'cod') {
            showPaymentProcessing(orderData);
        } else {
            showOrderConfirmation(orderData);
        }
        
    } catch (error) {
        console.error('Error processing order:', error);
        showNotification('Error processing your order! Please try again.', 'error');
    }
}

// Show Payment Processing
function showPaymentProcessing(orderData) {
    // Show processing modal
    if (paymentProcessing) {
        paymentProcessing.style.display = 'flex';
    }
    
    // Hide checkout modal
    if (checkoutModal) {
        checkoutModal.style.display = 'none';
    }
    
    // Simulate payment processing
    let timeLeft = 30;
    const timerElement = document.getElementById('paymentTimer');
    const processingMessage = document.getElementById('processingMessage');
    
    if (processingMessage) {
        processingMessage.textContent = `Processing ${orderData.paymentMethod.toUpperCase()} payment...`;
    }
    
    const countdown = setInterval(() => {
        timeLeft--;
        if (timerElement) {
            timerElement.textContent = `${timeLeft}s`;
        }
        
        if (timeLeft <= 0) {
            clearInterval(countdown);
            
            // Simulate successful payment
            setTimeout(() => {
                if (paymentProcessing) {
                    paymentProcessing.style.display = 'none';
                }
                showTransactionSuccess(orderData);
            }, 1000);
        }
    }, 1000);
}

// Show Transaction Success
function showTransactionSuccess(orderData) {
    // Update success modal
    if (successOrderNumber) successOrderNumber.textContent = orderData.orderNumber;
    if (transactionId) transactionId.textContent = orderData.transactionId;
    if (successAmount) successAmount.textContent = `${orderData.total} ETB`;
    if (successMethod) successMethod.textContent = paymentMethods[orderData.paymentMethod].name;
    if (successDate) {
        const date = new Date(orderData.timestamp);
        successDate.textContent = date.toLocaleDateString('en-ET', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    // Show success modal
    if (transactionSuccess) {
        transactionSuccess.style.display = 'flex';
    }
    
    // Clear cart
    cart = [];
    updateCart();
    
    // Reset checkout form
    if (checkoutForm) {
        checkoutForm.reset();
        const steps = document.querySelectorAll('.form-step');
        steps.forEach(step => step.classList.remove('active'));
        if (steps[0]) steps[0].classList.add('active');
    }
    
    // Show success notification
    showNotification(`Payment of ${orderData.total} ETB successful! Transaction ID: ${orderData.transactionId}`, 'success');
}

// Show Order Confirmation (for COD)
function showOrderConfirmation(orderData) {
    // Update confirmation modal
    if (orderNumber) {
        orderNumber.textContent = orderData.orderNumber;
    }
    
    // Show confirmation modal
    if (confirmation) {
        confirmation.style.display = 'flex';
    }
    
    // Hide checkout modal
    if (checkoutModal) {
        checkoutModal.style.display = 'none';
    }
    
    // Clear cart
    cart = [];
    updateCart();
    
    // Reset checkout form
    if (checkoutForm) {
        checkoutForm.reset();
        const steps = document.querySelectorAll('.form-step');
        steps.forEach(step => step.classList.remove('active'));
        if (steps[0]) steps[0].classList.add('active');
    }
    
    // Show success notification
    showNotification(`Order #${orderData.orderNumber} placed successfully! You'll pay ${orderData.total} ETB on delivery.`, 'success');
}

// Setup Transaction History
function setupTransactionHistory() {
    // Close history button
    if (closeHistory) {
        closeHistory.addEventListener('click', () => {
            if (transactionHistory) transactionHistory.style.display = 'none';
        });
    }
    
    // Search transactions
    if (searchTransactions) {
        searchTransactions.addEventListener('input', (e) => {
            filterTransactions(e.target.value);
        });
    }
    
    // Filter by date
    if (filterDate) {
        filterDate.addEventListener('change', (e) => {
            filterTransactionsByDate(e.target.value);
        });
    }
    
    // History button
    if (historyBtn) {
        historyBtn.addEventListener('click', openTransactionHistory);
    }
}

// Open Transaction History
function openTransactionHistory() {
    updateTransactionHistory();
    if (transactionHistory) {
        transactionHistory.style.display = 'flex';
    }
}

// Update Transaction History
function updateTransactionHistory(filteredTransactions = transactions) {
    if (!historyList) return;
    
    historyList.innerHTML = '';
    
    if (filteredTransactions.length === 0) {
        historyList.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">No transactions found</p>';
    } else {
        filteredTransactions.forEach(transaction => {
            const transactionElement = createTransactionElement(transaction);
            historyList.appendChild(transactionElement);
        });
    }
    
    // Update summary
    updateTransactionSummary(filteredTransactions);
}

// Create Transaction Element
function createTransactionElement(transaction) {
    const div = document.createElement('div');
    div.className = 'transaction-item';
    
    const date = new Date(transaction.date);
    const formattedDate = date.toLocaleDateString('en-ET', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    div.innerHTML = `
        <div class="transaction-info">
            <div class="transaction-id">${transaction.id}</div>
            <div class="transaction-details">
                <span>Order: ${transaction.orderNumber}</span>
                <span>Method: ${transaction.method}</span>
            </div>
            <div class="transaction-date">${formattedDate}</div>
        </div>
        <div class="transaction-right">
            <div class="transaction-amount">${transaction.amount} ETB</div>
            <div class="transaction-status ${transaction.status}">${transaction.status}</div>
        </div>
    `;
    
    return div;
}

// Update Transaction Summary
function updateTransactionSummary(filteredTransactions) {
    if (!totalTransactions || !totalAmount) return;
    
    const total = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
    totalTransactions.textContent = filteredTransactions.length;
    totalAmount.textContent = `${total} ETB`;
}

// Filter Transactions
function filterTransactions(searchTerm) {
    const filtered = transactions.filter(transaction => {
        return transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
               transaction.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
               transaction.method.toLowerCase().includes(searchTerm.toLowerCase());
    });
    updateTransactionHistory(filtered);
}

// Filter Transactions by Date
function filterTransactionsByDate(range) {
    const now = new Date();
    let filtered = [...transactions];
    
    switch(range) {
        case 'today':
            filtered = transactions.filter(t => {
                const date = new Date(t.date);
                return date.toDateString() === now.toDateString();
            });
            break;
        case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            filtered = transactions.filter(t => new Date(t.date) >= weekAgo);
            break;
        case 'month':
            const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
            filtered = transactions.filter(t => new Date(t.date) >= monthAgo);
            break;
    }
    
    updateTransactionHistory(filtered);
}

// Print Order Receipt
function printOrderReceipt() {
    const receiptContent = `
        <div style="font-family: Arial, sans-serif; max-width: 300px; padding: 20px;">
            <h2 style="text-align: center; color: #2c1810;">Habesha Coffee</h2>
            <hr>
            <p><strong>Order:</strong> ${successOrderNumber.textContent}</p>
            <p><strong>Transaction:</strong> ${transactionId.textContent}</p>
            <p><strong>Date:</strong> ${successDate.textContent}</p>
            <p><strong>Amount:</strong> ${successAmount.textContent}</p>
            <p><strong>Method:</strong> ${successMethod.textContent}</p>
            <hr>
            <p style="text-align: center; font-size: 12px;">Thank you for your purchase!</p>
        </div>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Receipt - Habesha Coffee</title>
            </head>
            <body>${receiptContent}</body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// Setup Event Listeners
function setupEventListeners() {
    try {
        // Cart button
        if (cartBtn) {
            cartBtn.addEventListener('click', () => {
                displayCartItems();
                if (cartModal) cartModal.style.display = 'flex';
            });
        }
        
        // Close cart button
        if (closeCart) {
            closeCart.addEventListener('click', () => {
                if (cartModal) cartModal.style.display = 'none';
            });
        }
        
        // Clear cart button
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', clearCart);
        }
        
        // Checkout button
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', openCheckout);
        }
        
        // Close checkout button
        if (closeCheckout) {
            closeCheckout.addEventListener('click', () => {
                if (checkoutModal) checkoutModal.style.display = 'none';
                // Reset form to step 1
                const steps = document.querySelectorAll('.form-step');
                steps.forEach(step => step.classList.remove('active'));
                if (steps[0]) steps[0].classList.add('active');
            });
        }
        
        // Close confirmation button
        if (closeConfirmation) {
            closeConfirmation.addEventListener('click', () => {
                if (confirmation) confirmation.style.display = 'none';
            });
        }
        
        // Checkout form submission
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', processOrder);
        }
        
        // Filter buttons (if they exist)
        if (filterButtons.length > 0) {
            filterButtons.forEach(button => {
                button.addEventListener('click', () => {
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                    currentFilter = button.dataset.filter;
                    displayProducts();
                });
            });
        }
        
        // Close modals when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === cartModal) {
                cartModal.style.display = 'none';
            }
            if (e.target === checkoutModal) {
                checkoutModal.style.display = 'none';
                // Reset form to step 1
                const steps = document.querySelectorAll('.form-step');
                steps.forEach(step => step.classList.remove('active'));
                if (steps[0]) steps[0].classList.add('active');
            }
            if (e.target === confirmation) {
                confirmation.style.display = 'none';
            }
            if (e.target === transactionSuccess) {
                transactionSuccess.style.display = 'none';
            }
            if (e.target === paymentProcessing) {
                paymentProcessing.style.display = 'none';
            }
            if (e.target === transactionHistory) {
                transactionHistory.style.display = 'none';
            }
        });
        
        // Event delegation for dynamic elements
        document.addEventListener('click', handleProductActions);
        
        // Event delegation for cart item actions
        document.addEventListener('click', (e) => {
            const target = e.target;
            
            if (target.classList.contains('quantity-btn') && target.dataset.index !== undefined) {
                const index = parseInt(target.dataset.index);
                const change = parseInt(target.dataset.change);
                updateCartItem(index, change);
            }
            
            if (target.classList.contains('remove-btn') || target.closest('.remove-btn')) {
                const button = target.classList.contains('remove-btn') ? target : target.closest('.remove-btn');
                const index = parseInt(button.dataset.index);
                if (!isNaN(index)) {
                    removeFromCart(index);
                }
            }
        });
        
        // Close modals with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (cartModal.style.display === 'flex') {
                    cartModal.style.display = 'none';
                }
                if (checkoutModal.style.display === 'flex') {
                    checkoutModal.style.display = 'none';
                    // Reset form to step 1
                    const steps = document.querySelectorAll('.form-step');
                    steps.forEach(step => step.classList.remove('active'));
                    if (steps[0]) steps[0].classList.add('active');
                }
                if (confirmation && confirmation.style.display === 'flex') {
                    confirmation.style.display = 'none';
                }
                if (transactionSuccess && transactionSuccess.style.display === 'flex') {
                    transactionSuccess.style.display = 'none';
                }
                if (paymentProcessing && paymentProcessing.style.display === 'flex') {
                    paymentProcessing.style.display = 'none';
                }
                if (transactionHistory && transactionHistory.style.display === 'flex') {
                    transactionHistory.style.display = 'none';
                }
            }
        });
        
    } catch (error) {
        console.error('Error setting up event listeners:', error);
        showNotification('Error initializing the application!', 'error');
    }
}

// Utility function to scroll to products
function scrollToProducts() {
    const productsSection = document.getElementById('products');
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Export functions for global access
window.habeshaCoffee = {
    cart,
    coffeeProducts,
    paymentMethods,
    transactions,
    addToCart,
    updateCart,
    clearCart,
    openCheckout,
    openTransactionHistory,
    showNotification,
    scrollToProducts
};