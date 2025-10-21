import React, {useState} from 'react';
import {authAPIs} from "../../lib/api.js";
import {handleAuth} from "../../lib/auth.js";
import {useNavigate, Link } from "react-router-dom";

const LoginUser = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email_address: '',
        password: '',
    });
    const [error, setErrors] = useState('');
    const [loading, setLoading] = useState(false);
    const [isHovered, setIsHovered] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setErrors('');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors('');

        try {
            const loginResponse = await authAPIs.userLogin({
                email_address: formData.email_address,
                password: formData.password,
            });

            handleAuth(loginResponse, 'user');
            navigate('/events');
        } catch (error) {
            setErrors(
                error.response?.data?.message || 'Login failed. Please check your credentials'
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 p-4 py-12">
                <div className="max-w-md w-full">

                    <div className="text-center mb-8">
                        <div className="text-5xl mb-4">🌸</div>
                        <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
                        <p className="text-gray-600 mt-2">Login to your account</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        {error && (
                            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">

                            <div>
                                <label htmlFor="email_address" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <input
                                    id="email_address"
                                    name="email_address"
                                    type="email"
                                    required
                                    value={formData.email_address}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                                    placeholder="Enter your email"
                                    autoComplete="email"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition pr-12"
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                                        tabIndex="-1"
                                    >
                                        {showPassword ? (
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="text-right">
                                <Link to="/forgot-password" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                                    Forgot Password?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`register-btn ${isHovered ? 'hovered' : ''}`}
                                onMouseEnter={() => !loading && setIsHovered(true)}
                                onMouseLeave={() => !loading && setIsHovered(false)}
                            >
                                <span style={{position: 'relative', zIndex: 10}}>
                                    {loading ? (
                                        <span style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                            <svg style={{animation: 'spin 1s linear infinite', height: '1.25rem', width: '1.25rem', marginRight: '0.5rem'}} viewBox="0 0 24 24">
                                                <circle style={{opacity: 0.25}} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path style={{opacity: 0.75}} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Logging In...
                                        </span>
                                    ) : (
                                        'Login'
                                    )}
                                </span>
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Don't have an account?{' '}
                                <Link to="/register" className="text-purple-600 hover:text-purple-700 font-medium">
                                    Register here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginUser;
