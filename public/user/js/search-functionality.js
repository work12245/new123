
// Search functionality
$(document).ready(function() {
    
    // Search form submission
    $('form[action="products"]').on('submit', function(e) {
        e.preventDefault();
        
        const searchTerm = $(this).find('input[name="search"]').val().trim();
        
        if (searchTerm) {
            window.location.href = `/products.html?search=${encodeURIComponent(searchTerm)}`;
        } else {
            window.location.href = '/products.html';
        }
    });
    
    // Language selection form
    $('#setLanguage').on('change', function(e) {
        e.preventDefault();
        const selectedLang = $(this).find('select').val();
        toastr.info(`Language changed to: ${selectedLang}`);
    });
    
    // Category filter buttons
    $('.menu_filter button').on('click', function(e) {
        e.preventDefault();
        
        const filterValue = $(this).attr('data-filter');
        
        // Remove active classes
        $('.menu_filter button').removeClass('first_menu_product active');
        $(this).addClass('first_menu_product active');
        
        // Filter products using isotope
        if (typeof $.fn.isotope !== 'undefined') {
            $('.grid').isotope({ filter: filterValue });
        } else {
            // Fallback filtering
            if (filterValue === '*') {
                $('.grid .col-xl-3').show();
            } else {
                $('.grid .col-xl-3').hide();
                $(filterValue).show();
            }
        }
    });
    
    // Newsletter subscription
    $('#subscribe_form').on('submit', function(e) {
        e.preventDefault();
        
        const email = $(this).find('input[name="email"]').val().trim();
        
        if (!email) {
            toastr.error('Please enter your email address');
            return;
        }
        
        // Disable button during submission
        $('#subscribe_btn').prop('disabled', true).html('<i class="fas fa-spinner"></i>');
        
        $.ajax({
            url: '/subscribe-request',
            method: 'POST',
            data: { email: email },
            success: function(response) {
                toastr.success('Successfully subscribed to newsletter!');
                $('#subscribe_form')[0].reset();
            },
            error: function() {
                toastr.error('Error subscribing to newsletter');
            },
            complete: function() {
                $('#subscribe_btn').prop('disabled', false).html('<i class="fas fa-paper-plane"></i>');
            }
        });
    });
    
    // Contact form submission
    $(document).on('submit', '.wsus__contact_form, form[action*="contact"]', function(e) {
        e.preventDefault();
        
        const formData = $(this).serialize();
        
        $.ajax({
            url: '/store-contact',
            method: 'POST',
            data: formData,
            success: function(response) {
                toastr.success('Message sent successfully!');
                $('.wsus__contact_form')[0].reset();
            },
            error: function() {
                toastr.error('Error sending message');
            }
        });
    });
    
    // Reservation form
    $(document).on('submit', '.wsus__reservation_form, form[action*="reservation"]', function(e) {
        e.preventDefault();
        
        const formData = $(this).serialize();
        
        $.ajax({
            url: '/store-reservation',
            method: 'POST',
            data: formData,
            success: function(response) {
                toastr.success('Reservation request sent successfully!');
                $('.wsus__reservation_form')[0].reset();
                $('.modal').modal('hide');
            },
            error: function() {
                toastr.error('Error sending reservation request');
            }
        });
    });
});
