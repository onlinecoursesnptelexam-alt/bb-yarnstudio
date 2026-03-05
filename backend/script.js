// Scroll to contact section with product info
function scrollToContact(productName) {
    // Scroll to contact section
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        
        // Pre-fill the message field with product interest
        setTimeout(() => {
            const messageField = document.querySelector('textarea[name="entry.1276477844"]');
            if (messageField) {
                messageField.value = `I'm interested in the: ${productName}`;
            }
        }, 500);
    } else {
        // If contact section doesn't exist, scroll to bottom and show alert
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        setTimeout(() => {
            alert(`Interested in: ${productName}\n\nPlease contact us for more information!`);
        }, 1000);
    }
}

// Handle contact form submission
function handleContactSubmit(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value,
        interestedProduct: sessionStorage.getItem('interestedProduct') || 'General inquiry'
    };
    
    // Here you would normally send this data to your server
    console.log('Contact form submitted:', formData);
    
    // Show success message
    alert('Thank you for your message! We will get back to you soon.');
    
    // Reset form
    event.target.reset();
    sessionStorage.removeItem('interestedProduct');
}

document.querySelector(".btn").addEventListener("click", function() {
    document.querySelector(".products").scrollIntoView({
        behavior: "smooth"
    });
});

// Load products from server API
async function loadProducts() {
    console.log('Loading products from server...');
    try {
        const response = await fetch('/api/products');
        console.log('Server response:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const products = await response.json();
        console.log('Products loaded:', products);
        
        // Sort products by ID in descending order (newest first)
        products.sort((a, b) => b.id - a.id);
        
        const productGrid = document.getElementById('productGrid');
        
        if (productGrid) {
            productGrid.innerHTML = '';
            
            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                productCard.innerHTML = `
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='images/krishna.jpeg'">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <div class="price">
                        <span class="discount-price">₹${product.discountPrice}</span>
                        <span class="original-price">₹${product.originalPrice}</span>
                    </div>
                `;
                productGrid.appendChild(productCard);
            });
            
            console.log('Products rendered to grid');
            addBuyNowButtons();
        } else {
            console.error('Product grid not found');
        }
    } catch (error) {
        console.error('Error loading products from server:', error);
        console.log('Falling back to localStorage...');
        
        // Fallback to localStorage if server is not available
        const products = JSON.parse(localStorage.getItem('products')) || JSON.parse(localStorage.getItem('adminProducts')) || [];
        console.log('Fallback products:', products);
        
        // Sort products by ID in descending order (newest first)
        products.sort((a, b) => b.id - a.id);
        
        const productGrid = document.getElementById('productGrid');
        
        if (productGrid) {
            productGrid.innerHTML = '';
            
            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                productCard.innerHTML = `
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='images/krishna.jpeg'">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <div class="price">
                        <span class="discount-price">₹${product.discountPrice}</span>
                        <span class="original-price">₹${product.originalPrice}</span>
                    </div>
                `;
                productGrid.appendChild(productCard);
            });
            addBuyNowButtons();
        }
    }
}

// Add Buy Now buttons to product cards
function addBuyNowButtons() {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        // Check if Buy Now button already exists
        if (!card.querySelector('.buy-now-btn')) {
            const productName = card.querySelector('h3').textContent;
            const buyNowBtn = document.createElement('button');
            buyNowBtn.className = 'btn buy-now-btn';
            buyNowBtn.textContent = 'Buy Now';
            buyNowBtn.onclick = () => scrollToContact(productName);
            card.appendChild(buyNowBtn);
        }
    });
}

/* Load products on page load */
document.addEventListener('DOMContentLoaded', function() {
    loadProducts().then(() => {
        // Add Buy Now buttons after products are loaded
        setTimeout(addBuyNowButtons, 100);
    });
});