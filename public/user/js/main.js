
$(function () {

    "use strict";

    // Load authentication script first
    $.getScript('/public/user/js/auth.js').done(function() {
        console.log('Auth manager loaded');
        
        // Initialize authentication
        if (window.authManager) {
            window.authManager.init();
        }
    });

    // Check user authentication status
    function checkAuthStatus() {
        if (window.authManager && window.authManager.isAuthenticated()) {
            const user = window.authManager.currentUser;
            updateUIForAuthenticatedUser(user);
        } else {
            updateUIForGuestUser();
        }
    }

    // Update UI for authenticated user
    function updateUIForAuthenticatedUser(user) {
        // Update user info in header if exists
        $('.user-name').text(user.name);
        $('.user-email').text(user.email);
        
        // Show logout button, hide login button
        $('.login-btn').hide();
        $('.logout-btn').show();
        $('.user-dashboard-link').show();
    }

    // Update UI for guest user
    function updateUIForGuestUser() {
        $('.login-btn').show();
        $('.logout-btn').hide();
        $('.user-dashboard-link').hide();
    }

    // Logout functionality
    $(document).on('click', '#logout_btn, .logout-btn', function(e) {
        e.preventDefault();
        
        if (window.authManager) {
            window.authManager.logout();
        } else {
            $.ajax({
                url: '/logout',
                method: 'POST',
                success: function(response) {
                    if (response.success) {
                        toastr.success('Logged out successfully');
                        setTimeout(() => {
                            window.location.href = response.redirect;
                        }, 1000);
                    }
                },
                error: function() {
                    toastr.error('Logout failed');
                }
            });
        }
    });

    // Initialize auth status check after a short delay
    setTimeout(checkAuthStatus, 100);

    function checkAuthStatus() {
        $.ajax({
            url: '/api/user',
            method: 'GET',
            success: function(user) {
                if (user && user.name) {
                    // User is logged in
                    $('.auth-links').html(`
                        <li><span style="color: #fff; margin-right: 10px;">Welcome, ${user.name}!</span></li>
                        <li><a href="/dashboard.html"><i class="fas fa-user"></i> Dashboard</a></li>
                        <li><a href="#" id="logoutBtn"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
                    `);
                } else {
                    // User not logged in
                    $('.auth-links').html(`
                        <li><a href="/login.html"><i class="fas fa-sign-in-alt"></i> Login</a></li>
                        <li><a href="/register.html"><i class="fas fa-user-plus"></i> Register</a></li>
                    `);
                }
            },
            error: function() {
                // User not logged in
                $('.auth-links').html(`
                    <li><a href="/login.html"><i class="fas fa-sign-in-alt"></i> Login</a></li>
                    <li><a href="/register.html"><i class="fas fa-user-plus"></i> Register</a></li>
                `);
            }
        });
    }

    // Event delegation for dynamically added menu items
    $(document).on('click', '.wsus__menu_item', function(e) {
        // Check if the click is on action buttons
        if ($(e.target).closest('ul').length > 0) {
            return; // Don't trigger modal if clicking on action buttons
        }
        
        // Get product ID from onclick attribute or data attribute
        let onclick = $(this).attr('onclick');
        if (onclick) {
            let productId = onclick.match(/load_product_model\((\d+)\)/);
            if (productId) {
                load_product_model(parseInt(productId[1]));
            }
        }
    });

    //======menu fix js======
    if ($('.main_menu').offset() != undefined) {
        var navoff = $('.main_menu').offset().top;
        $(window).scroll(function () {
            var scrolling = $(this).scrollTop();

            if (scrolling > navoff) {
                $('.main_menu').addClass('menu_fix');
            } else {
                $('.main_menu').removeClass('menu_fix');
            }
        });
    }

    //=======MENU CART======
    $(".cart_icon").click(function (e) {
        e.preventDefault();
        $(".wsus__menu_cart_area").addClass("show_mini_cart");
    });

    $(document).on('click', '.close_cart', function () {
        $(".wsus__menu_cart_area").removeClass("show_mini_cart");
    });

    //=======MENU SEARCH======
    $(".menu_search").click(function () {
        $(".wsus__search_form").addClass("show");
    });

    $(".close_search").click(function () {
        $(".wsus__search_form").removeClass("show");
    });

    //=========NICE SELECT=========
    $('#select_js').niceSelect();
    $('#select_js2').niceSelect();
    $('#select_js3').niceSelect();
    $('#select_js4').niceSelect();

    //=======BANNER SLIDER======
    $('.banner_slider').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        cssEase: 'linear',
        dots: true,
        arrows: false,
    });

    //=======OFFER ITEM SLIDER======
    $('.offer_item_slider').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        dots: false,
        arrows: true,
        nextArrow: '<i class="far fa-long-arrow-right nextArrow"></i>',
        prevArrow: '<i class="far fa-long-arrow-left prevArrow"></i>',

        responsive: [
            {
                breakpoint: 1400,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    });

    //*==========ISOTOPE==============
    var $grid = $('.grid').isotope({});

    $('.menu_filter').on('click', 'button', function () {
        var filterValue = $(this).attr('data-filter');
        $grid.isotope({
            filter: filterValue
        });
    });

    //active class
    $('.menu_filter button').on("click", function (event) {
        $(this).siblings('.active').removeClass('active');
        $(this).addClass('active');
        event.preventDefault();
    });

    //*=======simplyCountdown========
    var d = new Date(),
        countUpDate = new Date();
    d.setDate(d.getDate() + 365);

    // default example
    simplyCountdown('.simply-countdown-one', {
        year: d.getFullYear(),
        month: d.getMonth() + 1,
        day: d.getDate(),
        enableUtc: true
    });

    //=======TEAM SLIDER======
    $('.team_slider').slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        dots: true,
        arrows: false,

        responsive: [
            {
                breakpoint: 1400,
                settings: {
                    slidesToShow: 4,
                }
            },
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    });

    //=======ADD SLIDER======
    $('.add_slider').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        dots: false,
        arrows: true,
        nextArrow: '<i class="far fa-long-arrow-right nextArrow"></i>',
        prevArrow: '<i class="far fa-long-arrow-left prevArrow"></i>',

        responsive: [
            {
                breakpoint: 1400,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    });

    //=========COUNTER JS=========
    $('.counter').countUp();

    //=======OFFER ITEM SLIDER======
    $('.testi_slider').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        dots: true,
        arrows: false,

        responsive: [
            {
                breakpoint: 1400,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    });

    //=======BRAND SLIDER======
    $('.brand_slider').slick({
        slidesToShow: 6,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        dots: false,
        arrows: false,

        responsive: [
            {
                breakpoint: 1400,
                settings: {
                    slidesToShow: 5,
                }
            },
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 4,
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    });

    //*=======SCROLL BUTTON=======
    $('.wsus__scroll_btn').on('click', function () {
        $('html, body').animate({
            scrollTop: 0,
        }, 300);
    });

    $(window).on('scroll', function () {
        var scrolling = $(this).scrollTop();

        if (scrolling > 300) {
            $('.wsus__scroll_btn').fadeIn();
        } else {
            $('.wsus__scroll_btn').fadeOut();
        }
    });

    //======= VENOBOX.JS.=========
    $('.venobox').venobox();

    //=======OFFER ITEM SLIDER======
    $('.blog_det_slider').slick({
        slidesToShow: 2,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        dots: true,
        arrows: false,

        responsive: [
            {
                breakpoint: 1400,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    });

    //=======OFFER ITEM SLIDER======
    $('.related_product_slider').slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        dots: false,
        arrows: true,
        nextArrow: '<i class="far fa-long-arrow-right nextArrow"></i>',
        prevArrow: '<i class="far fa-long-arrow-left prevArrow"></i>',

        responsive: [
            {
                breakpoint: 1400,
                settings: {
                    slidesToShow: 4,
                }
            },
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    });

    //*==========wow js==========
    new WOW().init();

    //*==========PERSONAL INFO==========
    $(".dash_info_btn").click(function () {
        $(".wsus_dash_personal_info").toggleClass("show");
    });

    //*==========ORDER HISTORY==========
    $(".view_invoice").on("click", function () {
        $(".wsus_dashboard_order").fadeOut();
    });

    $('.view_invoice').on('click', function () {
        $(".wsus__invoice").fadeIn();
    });

    $(".go_back").on("click", function () {
        $(".wsus_dashboard_order").fadeIn();
    });

    $(".go_back").on("click", function () {
        $(".wsus__invoice").fadeOut();
    });

    //*==========DASHBOARD ADDRESS==========
    $(".dash_add_new_address").on("click", function () {
        $(".address_body").addClass("show_new_address");
    });

    $(".cancel_new_address").on("click", function () {
        $(".address_body").removeClass("show_new_address");
    });

    $(document).on('click', '.dash_edit_btn', function () {
        $(".address_body").addClass("show_edit_address");
    });

    $(".cancel_edit_address").on("click", function () {
        $(".address_body").removeClass("show_edit_address");
    });

    //=======OFFER ITEM SLIDER======
    $('.banner2_slider').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        dots: false,
        arrows: true,
        nextArrow: '<i class="far fa-long-arrow-right nextArrow"></i>',
        prevArrow: '<i class="far fa-long-arrow-left prevArrow"></i>',
    });

    //=======TESTIMONIAL 2 SLIDER======
    $('.testi_slider2').slick({
        slidesToShow: 2,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        dots: false,
        arrows: true,
        nextArrow: '<i class="far fa-long-arrow-right nextArrow"></i>',
        prevArrow: '<i class="far fa-long-arrow-left prevArrow"></i>',

        responsive: [
            {
                breakpoint: 1400,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 1,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    });

    //=======PRODUCT DETAILS SLIDER======
    if ($("#exzoom").length > 0) {
        $("#exzoom").exzoom({
            autoPlay: true,
        });
    }

});
