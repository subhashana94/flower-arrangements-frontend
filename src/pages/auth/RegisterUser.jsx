import React from 'react';
import './RegisterUser.css';
import {authAPIs} from "../../lib/api.js";
import {saveAuth} from "../../lib/auth.js";
import {useNavigate, Link} from "react-router-dom";
import ImageCropperModal from "../../components/ImageCropperModal.jsx";
import useImageCropper from "../../lib/useImageCropper.js";

const RegisterUser = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = React.useState({
        full_name: "",
        contact_number: "",
        email_address: "",
        password: "",
        confirm_password: "",
    });
    const [error, setErrors] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [isHovered, setIsHovered] = React.useState(false);

    const imageCropper = useImageCropper({
        aspectRatio: 1,
        outputWidth: 400,
        outputHeight: 400,
        cropShape: 'round',
        maxSizeMB: 1
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setErrors('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors('');

        if (formData.password !== formData.confirm_password) {
            setErrors('Passwords do not match');
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setErrors('Passwords must be at least 6 characters long');
            setLoading(false);
            return;
        }

        try {
            const {confirm_password, ...registerData} = formData;

            // Add cropped image if available
            if (imageCropper.croppedImage) {
                registerData.user_image = imageCropper.croppedImage;
            }

            await authAPIs.userRegister(registerData);

            const loginResponse = await authAPIs.userLogin({
                email_address: formData.email_address,
                password: formData.password,
            });

            saveAuth(loginResponse, 'user');
            navigate('/events');
        } catch (error) {
            setErrors(
                error.response?.data?.message || 'Registration fail. Please try again later.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div
                className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 p-4 py-12">
                <div className="max-w-md w-full">
                    <div className="text-center mb-8">
                        <div className="text-5xl mb-4">🌸</div>
                        <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>
                        <p className="text-gray-600 mt-2">Join our flower arrangement community</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        {error && (
                            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Image Upload with Cropper */}
                            <div className="flex flex-col items-center mb-4">
                                <div
                                    className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-3 overflow-hidden">
                                    {imageCropper.croppedImage ? (
                                        <img
                                            src={imageCropper.croppedImage}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24"
                                             stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                        </svg>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    <label
                                        className="cursor-pointer bg-purple-50 text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-100 transition text-sm font-medium">
                                        {imageCropper.croppedImage ? 'Change Photo' : 'Upload Photo'}
                                        <input
                                            type="file"
                                            accept="image/png,image/jpeg,image/jpg"
                                            onChange={imageCropper.handleFileSelect}
                                            className="hidden"
                                        />
                                    </label>

                                    {imageCropper.croppedImage && (
                                        <button
                                            type="button"
                                            onClick={imageCropper.clearCroppedImage}
                                            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition text-sm font-medium"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 mt-2">Optional - Max 1MB</p>
                            </div>

                            <div>
                                <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name *
                                </label>
                                <input
                                    id="full_name"
                                    name="full_name"
                                    type="text"
                                    required
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                                    placeholder="Enter your full name"
                                />
                            </div>

                            <div>
                                <label htmlFor="contact_number"
                                       className="block text-sm font-medium text-gray-700 mb-1">
                                    Contact Number *
                                </label>
                                <input
                                    id="contact_number"
                                    name="contact_number"
                                    type="tel"
                                    required
                                    value={formData.contact_number}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                                    placeholder="Enter your contact number"
                                />
                            </div>

                            <div>
                                <label htmlFor="email_address" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address *
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
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Password *
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                                    placeholder="Minimum 6 characters"
                                />
                            </div>

                            <div>
                                <label htmlFor="confirm_password"
                                       className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirm Password *
                                </label>
                                <input
                                    id="confirm_password"
                                    name="confirm_password"
                                    type="password"
                                    required
                                    value={formData.confirm_password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                                    placeholder="Re-enter your password"
                                />
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
                                            <svg style={{
                                                animation: 'spin 1s linear infinite',
                                                height: '1.25rem',
                                                width: '1.25rem',
                                                marginRight: '0.5rem'
                                            }} viewBox="0 0 24 24">
                                                <circle style={{opacity: 0.25}} cx="12" cy="12" r="10"
                                                        stroke="currentColor" strokeWidth="4" fill="none"/>
                                                <path style={{opacity: 0.75}} fill="currentColor"
                                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                            </svg>
                                            Creating Account...
                                        </span>
                                    ) : (
                                        'Create Account'
                                    )}
                                </span>
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Already have an account?{' '}
                                <Link to="/login" className="text-purple-600 hover:text-purple-700 font-medium">
                                    Login here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Cropper Modal */}
            {imageCropper.showCropper && (
                <ImageCropperModal
                    image={imageCropper.originalImage}
                    onCropComplete={imageCropper.handleCropComplete}
                    onCancel={imageCropper.handleCropCancel}
                    title="Crop Profile Photo"
                    {...imageCropper.cropperConfig}
                />
            )}
        </div>
    );
};

export default RegisterUser;
