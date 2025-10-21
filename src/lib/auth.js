import Cookies from 'js-cookie';

// Set authentication session after successful login/register
export const handleAuth = (data, role) => {
    // Backend returns: accessToken, refreshToken, administrator/user
    const {accessToken, refreshToken, administrator, user} = data;

    // Save Tokens
    Cookies.set("accessToken", accessToken, {expires: 1/96}); // 15 minutes
    Cookies.set("refreshToken", refreshToken, {expires: 7}); // 7 days
    Cookies.set('userRole', role); // 'admin' or 'user'

    // Save user data
    const userData = administrator || user;
    if (userData) {
        Cookies.set('userData', JSON.stringify(userData), {expires: 7}); // 7 days
    }
}

// Get current user data
export const getCurrentUser = () => {
    const userData = Cookies.get("userData");
    return userData ? JSON.parse(userData) : undefined;
}

// Check if user is authenticated
export const isAuthenticated = () => {
    const accessToken = Cookies.get("accessToken");
    const refreshToken = Cookies.get("refreshToken");
    return !!(accessToken || refreshToken);
}

// Get user role
export const getUserRole = () => {
    return Cookies.get("userRole");
}

// Check if user is admin
export const isAdmin = () => {
    return getUserRole() === 'admin';
}

// Check if user is regular user
export const isUser = () => {
    return getUserRole() === 'user';
}

// Clear authentication session (logout)
export const logout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    Cookies.remove("userRole");
    Cookies.remove("userData");

    if (typeof window !== "undefined") {
        window.location.href = "/login";
    }
}
