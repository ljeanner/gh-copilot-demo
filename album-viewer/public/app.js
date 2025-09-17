// Cart functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');

    // Add to cart functionality
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart') || e.target.closest('.add-to-cart')) {
            const button = e.target.classList.contains('add-to-cart') ? e.target : e.target.closest('.add-to-cart');
            
            const album = {
                id: button.dataset.albumId,
                title: button.dataset.albumTitle,
                artist: button.dataset.albumArtist,
                price: parseFloat(button.dataset.albumPrice),
                image: button.dataset.albumImage
            };

            // Check if album already in cart
            const existingItem = cart.find(item => item.id === album.id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                album.quantity = 1;
                cart.push(album);
            }

            // Save to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Visual feedback
            button.innerHTML = '<i class="check icon"></i> Added!';
            button.classList.add('green');
            setTimeout(() => {
                button.innerHTML = '<i class="add icon"></i> Add to Cart';
                button.classList.remove('green');
            }, 1000);

            console.log('Added to cart:', album);
        }
    });

    // Load cart on cart page
    if (window.location.pathname === '/cart') {
        displayCart();
    }

    function displayCart() {
        const cartItemsContainer = document.getElementById('cart-items');
        const emptyCartMessage = document.getElementById('empty-cart');
        const cartTotal = document.getElementById('cart-total');
        const totalAmount = document.getElementById('total-amount');

        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block';
            cartTotal.style.display = 'none';
            return;
        }

        emptyCartMessage.style.display = 'none';
        cartTotal.style.display = 'block';

        // Calculate total
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        totalAmount.textContent = total.toFixed(2);

        // Display cart items
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="item cart-item" data-album-id="${item.id}">
                <div class="ui image small">
                    <img src="${item.image}">
                </div>
                <div class="content">
                    <div class="header">
                        <span class="album-title">${item.title}</span>
                    </div>
                    <div class="meta">
                        <span class="meta-info">${item.artist}</span>
                        <span class="meta-info">$${item.price}</span>
                        <span class="meta-info">Quantity: ${item.quantity}</span>
                    </div>
                    <div class="extra">
                        <button class="ui red button remove-from-cart" data-album-id="${item.id}">
                            <i class="trash icon"></i> Remove
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // Add remove functionality
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('remove-from-cart') || e.target.closest('.remove-from-cart')) {
                const button = e.target.classList.contains('remove-from-cart') ? e.target : e.target.closest('.remove-from-cart');
                const albumId = button.dataset.albumId;
                
                cart = cart.filter(item => item.id !== albumId);
                localStorage.setItem('cart', JSON.stringify(cart));
                
                // Refresh cart display
                displayCart();
            }
        });
    }
});