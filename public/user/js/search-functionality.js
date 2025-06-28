
// Search functionality
$(document).ready(function() {
    
    // Search form submission
    $('form[action="products"]').on('submit', function(e) {
        e.preventDefault();
        
        const searchTerm = $(this).find('input[name="search"]').val();
        const category = $(this).find('select[name="category"]').val();
        
        let url = '/products.html?';
        if (searchTerm) url += `search=${encodeURIComponent(searchTerm)}&`;
        if (category) url += `category=${encodeURIComponent(category)}&`;
        
        window.location.href = url;
    });
    
    // Category filter buttons
    $('.menu_filter button').on('click', function() {
        const category = $(this).data('filter').replace('.category_', '');
        
        // Remove active class from all buttons
        $('.menu_filter button').removeClass('first_menu_product');
        $(this).addClass('first_menu_product');
        
        // Show/hide products based on category
        if (category === '*') {
            $('.wsus__menu_item').parent().show();
        } else {
            $('.wsus__menu_item').parent().hide();
            $(`.category_${category}`).show();
        }
    });
    
    // Newsletter subscription
    $('#subscribe_form').on('submit', function(e) {
        e.preventDefault();
        
        $.ajax({
            url: '/subscribe-request',
            method: 'POST',
            data: $(this).serialize(),
            success: function(response) {
                alert('Successfully subscribed to newsletter!');
                $('#subscribe_form')[0].reset();
            },
            error: function() {
                alert('Error subscribing to newsletter');
            }
        });
    });
    
    // Reservation form
    $('.wsus__reservation_form').on('submit', function(e) {
        e.preventDefault();
        
        $.ajax({
            url: '/store-reservation',
            method: 'POST',
            data: $(this).serialize(),
            success: function(response) {
                alert('Reservation request sent successfully!');
                $('.wsus__reservation_form')[0].reset();
                $('#staticBackdrop').modal('hide');
            },
            error: function() {
                alert('Error sending reservation request');
            }
        });
    });
});
