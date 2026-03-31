/**
 * Global App Logic & API Integration
 */

const API_BASE_URL = 'http://localhost:8080/api';

// Utility: Show Toast Notifications
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = 'ph-info';
    if(type === 'success') icon = 'ph-check-circle';
    if(type === 'error') icon = 'ph-warning-circle';

    toast.innerHTML = `
        <i class="ph-fill ${icon}" style="font-size: 1.2rem;"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Cleanup
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// Global Auth Check & Logout Functions
function logout() {
    sessionStorage.removeItem('user');
    window.location.href = 'index.html';
}

function getSessionUser() {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

function checkAuth(requiredRole = null) {
    const user = getSessionUser();
    if (!user) {
        window.location.href = 'index.html';
        return;
    }
    if (requiredRole && user.role !== requiredRole) {
        showToast('Unauthorized access!', 'error');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
    
    // Populate dynamic UI elements if they exist
    const userNameDisplays = document.querySelectorAll('.display-username');
    userNameDisplays.forEach(el => el.textContent = user.username);
    
    return user;
}

// Attach Event Listeners to Auth Forms (if they exist on the page)
document.addEventListener('DOMContentLoaded', () => {
    
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = document.getElementById('regUsername').value;
            const password = document.getElementById('regPassword').value;
            const role = document.getElementById('regRole').value;
            const btn = registerForm.querySelector('button[type="submit"]');

            btn.disabled = true;
            btn.innerHTML = `<i class="ph ph-spinner ph-spin"></i> Registering...`;

            try {
                const response = await fetch(`${API_BASE_URL}/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password, role })
                });

                if (response.ok) {
                    showToast('Registration successful! Please login.', 'success');
                    registerForm.reset();
                    // Optional: switch to login tab programmatically
                    if(typeof switchTab === 'function') switchTab('login');
                } else {
                    showToast('Registration failed.', 'error');
                }
            } catch (error) {
                console.error('Registration Error:', error);
                showToast('Server error.', 'error');
            } finally {
                btn.disabled = false;
                btn.innerHTML = `Create Account <i class="ph-bold ph-user-plus"></i>`;
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;
            const btn = loginForm.querySelector('button[type="submit"]');

            btn.disabled = true;
            btn.innerHTML = `<i class="ph ph-spinner ph-spin"></i> Authenticating...`;

            try {
                const response = await fetch(`${API_BASE_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.text(); 
                
                if (data) {
                    const user = JSON.parse(data);
                    // Store user session (simple approach since we aren't using JWT in this project)
                    sessionStorage.setItem('user', JSON.stringify(user));
                    showToast(`Welcome back, ${user.username}!`, 'success');
                    
                    // Route to correct dashboard based on role
                    setTimeout(() => {
                        if (user.role === 'STUDENT') window.location.href = 'student.html';
                        else if (user.role === 'FACULTY') window.location.href = 'faculty.html';
                        else if (user.role === 'GUARD') window.location.href = 'guard.html';
                        else window.location.href = 'index.html'; // fallback
                    }, 1000);

                } else {
                    showToast('Invalid credentials.', 'error');
                }
            } catch (error) {
                console.error('Login Error:', error);
                showToast('Server error. Is the backend running?', 'error');
            } finally {
                btn.disabled = false;
                btn.innerHTML = `Sign In <i class="ph-bold ph-arrow-right"></i>`;
            }
        });
    }

    // Attach global logout listeners
    document.querySelectorAll('[data-action="logout"]').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    });
});
