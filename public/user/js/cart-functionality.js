
// Cart functionality
$(document).ready(function() {
    
    // Load cart data on page load
    loadCartData();
    
    // Cart icon click handler
    $(document).on('click', '.cart_icon', function(e) {
        e.preventDefault();
        $('.wsus__menu_cart_area').addClass('active');
    });
    
    // Close cart
    $(document).on('click', '.close_cart', function() {
        $('.wsus__menu_cart_area').removeClass('active');
    });
    
    // Add to cart form submission
    $(document).on('submit', '#add_to_cart_form', function(e) {
        e.preventDefault();
        
        const productId = $(this).data('product-id');
        
        // Check if size is selected
        if (!$("input[name='size_variant']:checked").length) {
            toastr.error('Please select a size');
            return;
        }
        
        // Collect form data as regular object
        const formData = {
            product_id: productId,
            size_variant: $("input[name='size_variant']:checked").val(),
            quantity: $("input[name='quantity']").val() || 1,
            optional_items: []
        };
        
        // Collect optional items
        $("input[name='optional_items[]']:checked").each(function() {
            formData.optional_items.push($(this).val());
        });
        
        $.ajax({
            url: '/add-to-cart',
            method: 'POST',
            data: formData,
            success: function(response) {
                toastr.success('Added to cart successfully!');
                $('#cartModal').modal('hide');
                loadCartData();
            },
            error: function(xhr) {
                console.log('Error details:', xhr.responseText);
                toastr.error('Error adding to cart');
            }
        });
    });
    
    // Quantity increment/decrement in modal
    $(document).on('click', '.increment', function() {
        const input = $(this).siblings('input[name="quantity"]');
        let value = parseInt(input.val());
        input.val(value + 1);
        calculateModalPrice();
    });
    
    $(document).on('click', '.decrement', function() {
        const input = $(this).siblings('input[name="quantity"]');
        let value = parseInt(input.val());
        if (value > 1) {
            input.val(value - 1);
            calculateModalPrice();
        }
    });
    
    // Size variant change
    $(document).on('change', 'input[name="size_variant"]', function() {
        calculateModalPrice();
    });
    
    // Extra items change
    $(document).on('change', 'input[name="optional_items[]"]', function() {
        calculateModalPrice();
    });
    
    function calculateModalPrice() {
        let basePrice = parseFloat($('input[name="size_variant"]:checked').data('variant-price')) || 0;
        let quantity = parseInt($('input[name="quantity"]').val()) || 1;
        let extrasPrice = 0;
        
        $('input[name="optional_items[]"]:checked').each(function() {
            extrasPrice += parseFloat($(this).data('extra-price')) || 0;
        });
        
        let totalPrice = (basePrice + extrasPrice) * quantity;
        $('.total-price').text(totalPrice.toFixed(0));
    }
    
    // Load product modal
    window.load_product_model = function(productId) {
        $.ajax({
            url: `/load-product-modal/${productId}`,
            method: 'GET',
            success: function(response) {
                $('.load_product_modal_response').html(response);
                $('#cartModal').modal('show');
            },
            error: function(xhr, status, error) {
                console.log('Error details:', xhr.responseText);
                toastr.error('Error loading product');
            }
        });
    };
    
    // Alternative function name for compatibility
    window.loadProductModal = function(productId) {
        load_product_model(productId);
    };
    
    // Remove item from mini cart
    $(document).on('click', '.mini-item-remove', function() {
        const li = $(this).closest('li');
        const rowid = li.data('mini-item-rowid');
        
        $.ajax({
            url: `/remove-cart-item/${rowid}`,
            method: 'GET',
            success: function(response) {
                toastr.success('Item removed from cart');
                loadCartData();
            },
            error: function() {
                toastr.error('Error removing item');
            }
        });
    });
    
    function loadCartData() {
        $.ajax({
            url: '/api/cart',
            method: 'GET',
            success: function(cartItems) {
                updateCartDisplay(cartItems);
            },
            error: function() {
                // Silently handle error, no need to show error for cart loading
                updateCartDisplay([]);
            }
        });
    }
    
    function updateCartDisplay(cartItems) {
        let cartCount = cartItems.length;
        let subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
        
        // Update cart count
        $('.topbar_cart_qty').text(cartCount);
        
        // Update mini cart
        if (cartItems.length === 0) {
            $('.wsus__menu_cart_boody').html(`
                <div class="wsus__menu_cart_header">
                    <h5>Your shopping cart is empty!</h5>
                    <span class="close_cart"><i class="fal fa-times"></i></span>
                </div>
            `);
        } else {
            let cartHTML = `
                <div class="wsus__menu_cart_header">
                    <h5 class="mini_cart_body_item">Total Item(${cartCount})</h5>
                    <span class="close_cart"><i class="fal fa-times"></i></span>
                </div>
                <ul class="mini_cart_list">
            `;
            
            cartItems.forEach(item => {
                const extrasHTML = item.extras && item.extras.length > 0 
                    ? item.extras.map(extra => `<span class="extra">${extra}</span>`).join('') 
                    : '';
                
                cartHTML += `
                    <li class="min-item-${item.id}" data-mini-item-rowid="${item.id}">
                        <div class="menu_cart_img">
                            <img src="${item.image}" alt="menu" class="img-fluid w-100">
                        </div>
                        <div class="menu_cart_text">
                            <a class="title" href="#">${item.name}</a>
                            <p class="size">${item.size}</p>
                            ${extrasHTML}
                            <p class="price mini-price-${item.id}">$${item.price}</p>
                        </div>
                        <input type="hidden" class="mini-input-price set-mini-input-price-${item.id}" value="${item.price}">
                        <span class="del_icon mini-item-remove"><i class="fal fa-times"></i></span>
                    </li>
                `;
            });
            
            cartHTML += `
                </ul>
                <p class="subtotal">Sub Total <span class="mini_sub_total">$${subtotal}</span></p>
                <a class="cart_view" href="cart.html">view cart</a>
                <a class="checkout" href="checkout.html">checkout</a>
            `;
            
            $('.wsus__menu_cart_boody').html(cartHTML);
        }
    }
});
