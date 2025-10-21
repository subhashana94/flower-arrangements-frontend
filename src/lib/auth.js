import Cookies from 'js-cookie';

// save authentication token and user data
export const handleAuth = (data, role) => {
    // Backend returns: accessToken, refreshToken, administrator/user
    const {accessToken, refreshToken, administrator, user} = data;

    // Save Tokens with correct names
    Cookies.set("accessToken", accessToken, {expires: 1/96}); // 15 minutes
    Cookies.set("refreshToken", refreshToken, {expires: 7}); // 7 days
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
    const accessToken = Cookies.get("accessToken");
    const refreshToken = Cookies.get("refreshToken");
    return !!(accessToken || refreshToken);
}

// logout user
export const logout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    Cookies.remove("userRole");
    Cookies.remove("userData");

    if (typeof window !== "undefined") {
        window.location.href = "/login";
    }
}
