
// Authentication management with localStorage
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.loadUserFromStorage();
        this.checkAuthOnPageLoad();
    }

    // Save user to localStorage
    saveUserToStorage(user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUser = user;
        this.updateUsersList(user);
    }

    // Load user from localStorage
    loadUserFromStorage() {
        const user = localStorage.getItem('currentUser');
        if (user) {
            this.currentUser = JSON.parse(user);
        }
        return this.currentUser;
    }

    // Update users list in localStorage
    updateUsersList(user) {
        let users = JSON.parse(localStorage.getItem('allUsers') || '[]');
        const existingUserIndex = users.findIndex(u => u.email === user.email);
        
        if (existingUserIndex !== -1) {
            users[existingUserIndex] = { ...users[existingUserIndex], ...user };
        } else {
            users.push({ ...user, id: users.length + 1 });
        }
        
        localStorage.setItem('allUsers', JSON.stringify(users));
    }

    // Get all users from localStorage
    getAllUsers() {
        return JSON.parse(localStorage.getItem('allUsers') || '[]');
    }

    // Check if user is authenticated
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Check if user is admin
    isAdmin() {
        return this.currentUser && this.currentUser.role === 'admin';
    }

    // Logout user
    logout() {
        localStorage.removeItem('currentUser');
        this.currentUser = null;
        window.location.href = '/login.html';
    }

    // Check authentication on page load
    checkAuthOnPageLoad() {
        const currentPage = window.location.pathname;
        
        // Protected user pages
        const userProtectedPages = ['/dashboard.html'];
        
        // Protected admin pages
        const adminProtectedPages = ['/admin/dashboard.html', '/admin/'];
        
        if (userProtectedPages.some(page => currentPage.includes(page))) {
            if (!this.isAuthenticated()) {
                this.redirectToLogin();
                return;
            }
        }
        
        if (adminProtectedPages.some(page => currentPage.includes(page))) {
            if (!this.isAuthenticated() || !this.isAdmin()) {
                this.redirectToLogin(true);
                return;
            }
        }
    }

    // Redirect to login
    redirectToLogin(isAdmin = false) {
        const loginPage = isAdmin ? '/admin/login.html' : '/login.html';
        if (window.location.pathname !== loginPage) {
            window.location.href = loginPage;
        }
    }

    // Show login popup for checkout
    showLoginPopup() {
        return new Promise((resolve, reject) => {
            if (this.isAuthenticated()) {
                resolve(this.currentUser);
                return;
            }

            // Create login modal
            const modalHTML = `
                <div class="modal fade" id="loginPopup" tabindex="-1" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Login Required</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body">
                                <p>Please login to continue with checkout</p>
                                <form id="popupLoginForm">
                                    <div class="mb-3">
                                        <label class="form-label">Email</label>
                                        <input type="email" class="form-control" name="email" required>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Password</label>
                                        <input type="password" class="form-control" name="password" required>
                                    </div>
                                    <button type="submit" class="btn btn-primary w-100">Login</button>
                                </form>
                                <div class="text-center mt-3">
                                    <p>Don't have an account? <a href="#" id="switchToRegister">Register here</a></p>
                                </div>
                                
                                <form id="popupRegisterForm" style="display: none;">
                                    <div class="mb-3">
                                        <label class="form-label">Name</label>
                                        <input type="text" class="form-control" name="name" required>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Email</label>
                                        <input type="email" class="form-control" name="email" required>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Password</label>
                                        <input type="password" class="form-control" name="password" required>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Confirm Password</label>
                                        <input type="password" class="form-control" name="password_confirmation" required>
                                    </div>
                                    <button type="submit" class="btn btn-primary w-100">Register</button>
                                </form>
                                <div id="registerSwitchLink" style="display: none;" class="text-center mt-3">
                                    <p>Already have an account? <a href="#" id="switchToLogin">Login here</a></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            $('body').append(modalHTML);
            $('#loginPopup').modal('show');

            // Handle form switching
            $('#switchToRegister').click((e) => {
                e.preventDefault();
                $('#popupLoginForm').hide();
                $('#popupRegisterForm').show();
                $('#switchToRegister').parent().hide();
                $('#registerSwitchLink').show();
            });

            $('#switchToLogin').click((e) => {
                e.preventDefault();
                $('#popupRegisterForm').hide();
                $('#popupLoginForm').show();
                $('#registerSwitchLink').hide();
                $('#switchToRegister').parent().show();
            });

            // Handle login form
            $('#popupLoginForm').on('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                
                $.ajax({
                    url: '/store-login',
                    method: 'POST',
                    data: {
                        email: formData.get('email'),
                        password: formData.get('password')
                    },
                    success: (response) => {
                        if (response.success) {
                            this.saveUserToStorage(response.user);
                            $('#loginPopup').modal('hide');
                            toastr.success(response.message);
                            resolve(response.user);
                        } else {
                            toastr.error(response.message);
                        }
                    },
                    error: () => {
                        toastr.error('Login failed');
                        reject(new Error('Login failed'));
                    }
                });
            });

            // Handle register form
            $('#popupRegisterForm').on('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                
                if (formData.get('password') !== formData.get('password_confirmation')) {
                    toastr.error('Passwords do not match');
                    return;
                }
                
                $.ajax({
                    url: '/store-register',
                    method: 'POST',
                    data: {
                        name: formData.get('name'),
                        email: formData.get('email'),
                        password: formData.get('password'),
                        password_confirmation: formData.get('password_confirmation')
                    },
                    success: (response) => {
                        if (response.success) {
                            this.saveUserToStorage(response.user);
                            $('#loginPopup').modal('hide');
                            toastr.success(response.message);
                            resolve(response.user);
                        } else {
                            toastr.error(response.message);
                        }
                    },
                    error: () => {
                        toastr.error('Registration failed');
                        reject(new Error('Registration failed'));
                    }
                });
            });

            // Handle modal close
            $('#loginPopup').on('hidden.bs.modal', () => {
                $('#loginPopup').remove();
                reject(new Error('Login cancelled'));
            });
        });
    }

    // Update user profile
    updateProfile(profileData) {
        if (this.currentUser) {
            const updatedUser = { ...this.currentUser, ...profileData };
            this.saveUserToStorage(updatedUser);
            return updatedUser;
        }
        return null;
    }
}

// Initialize global auth manager
window.authManager = new AuthManager();

// Global functions for compatibility
window.checkAuth = () => window.authManager.isAuthenticated();
window.getCurrentUser = () => window.authManager.currentUser;
window.logout = () => window.authManager.logout();
