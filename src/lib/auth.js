import Cookies from 'js-cookie';

// save authentication token and user data
export const saveAuth = (data, role) => {
    const {access_token, refresh_token, administrator, user} = data;

    // Save Tokens
    Cookies.set("access_token", access_token, {expires: 1/96}); // 15 minutes
    Cookies.set("refresh_token", refresh_token, {expires: 7}); // 7 days
    Cookies.set('userRole', role);

    // save user data
    const userData = administrator || user;
    if (userData) {
        Cookies.set('userData', JSON.stringify(userData), {expires: 7}); // 7 days
    }
}

// get current user data
export const getCurrentUser = () => {
    const userData = Cookies.get("userData");
    return userData ? JSON.parse(userData) : undefined;
}

// check user if authenticated?
export const isAuthenticated = () => {
    const access_token = Cookies.get("access_token");
    const refresh_token = Cookies.get("refresh_token");
    return !!(access_token || refresh_token);
}

// logout user
export const logout = () => {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    Cookies.remove("userRole");
    Cookies.remove("userData");

    if (typeof window !== "undefined") {
        window.location.href = "/login";
    }
}

