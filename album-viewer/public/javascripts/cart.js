// Shopping Cart Management Module
const cart = {
  items: [],
  
  // Initialize cart from localStorage
  init() {
    this.loadFromStorage();
    this.updateCartDisplay();
  },
  
  // Add album to cart
  addItem(album) {
    // Check if album already exists in cart
    const existingItem = this.items.find(item => item.id === album.id);
    
    if (existingItem) {
      // Increment quantity if album already exists
      existingItem.quantity += 1;
    } else {
      // Add new album with quantity 1
      this.items.push({
        id: album.id,
        title: album.title,
        artist: album.artist,
        price: album.price,
        image_url: album.image_url,
        quantity: 1
      });
    }
    
    this.saveToStorage();
    this.updateCartDisplay();
    this.showAddedToCartFeedback(album.title);
  },
  
  // Remove album from cart
  removeItem(albumId) {
    this.items = this.items.filter(item => item.id !== albumId);
    this.saveToStorage();
    this.updateCartDisplay();
    this.updateCartView();
  },
  
  // Get total number of items in cart
  getItemCount() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  },
  
  // Calculate total price
  getTotal() {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  },
  
  // Update cart display (header badge)
  updateCartDisplay() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
      const count = this.getItemCount();
      cartCount.textContent = count;
      cartCount.style.display = count > 0 ? 'inline' : 'none';
    }
  },
  
  // Update cart view contents
  updateCartView() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (cartItems) {
      cartItems.innerHTML = '';
      
      if (this.items.length === 0) {
        cartItems.innerHTML = '<div class="ui message">Your cart is empty</div>';
      } else {
        this.items.forEach(item => {
          const itemDiv = document.createElement('div');
          itemDiv.className = 'ui segment';
          itemDiv.innerHTML = `
            <div class="ui grid">
              <div class="three wide column">
                <img src="${item.image_url}" class="ui small image">
              </div>
              <div class="ten wide column">
                <div class="ui header">${item.title}</div>
                <div class="meta">${item.artist}</div>
                <div class="meta">$${item.price} x ${item.quantity}</div>
              </div>
              <div class="three wide column">
                <button class="ui red button remove-from-cart" data-id="${item.id}">Remove</button>
              </div>
            </div>
          `;
          cartItems.appendChild(itemDiv);
        });
      }
    }
    
    if (cartTotal) {
      cartTotal.textContent = `Total: $${this.getTotal()}`;
    }
  },
  
  // Save cart to localStorage
  saveToStorage() {
    localStorage.setItem('albumCart', JSON.stringify(this.items));
  },
  
  // Load cart from localStorage
  loadFromStorage() {
    const saved = localStorage.getItem('albumCart');
    if (saved) {
      try {
        this.items = JSON.parse(saved);
      } catch (e) {
        console.error('Error loading cart from storage:', e);
        this.items = [];
      }
    }
  },
  
  // Show feedback when item is added
  showAddedToCartFeedback(albumTitle) {
    // Create a simple toast notification
    const toast = document.createElement('div');
    toast.className = 'ui success message';
    toast.style.position = 'fixed';
    toast.style.top = '20px';
    toast.style.right = '20px';
    toast.style.zIndex = '9999';
    toast.innerHTML = `<i class="check icon"></i> "${albumTitle}" added to cart!`;
    
    document.body.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 3000);
  },
  
  // Clear all items from cart
  clearCart() {
    this.items = [];
    this.saveToStorage();
    this.updateCartDisplay();
    this.updateCartView();
  }
};

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  cart.init();
  
  // Update cart view if we're on the cart page
  if (window.location.pathname === '/cart') {
    cart.updateCartView();
  }
  
  // Add event listeners for "Add to Cart" buttons
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-to-cart')) {
      const albumData = {
        id: parseInt(e.target.dataset.id),
        title: e.target.dataset.title,
        artist: e.target.dataset.artist,
        price: parseFloat(e.target.dataset.price),
        image_url: e.target.dataset.imageUrl
      };
      cart.addItem(albumData);
    }
    
    if (e.target.classList.contains('remove-from-cart')) {
      const albumId = parseInt(e.target.dataset.id);
      cart.removeItem(albumId);
    }
    
    if (e.target.id === 'clear-cart') {
      cart.clearCart();
    }
  });
  
  // Cart icon click handler
  const cartIcon = document.getElementById('cart-icon');
  if (cartIcon) {
    cartIcon.addEventListener('click', function(e) {
      e.preventDefault();
      window.location.href = '/cart';
    });
  }
});