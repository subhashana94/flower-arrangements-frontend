import {useState} from 'react';

const useImageCropper = (config = {}) => {
    const {
        aspectRatio = 1,
        outputWidth = 400,
        outputHeight = 400,
        cropShape = 'rect',
        maxSizeMB = 1
    } = config;

    const [originalImage, setOriginalImage] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);
    const [showCropper, setShowCropper] = useState(false);
    const [imageFile, setImageFile] = useState(null);

    // Handle file input change
    // Validates file type and size, then shows cropper

    const handleFileSelect = async (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!validTypes.includes(file.type)) {
            alert('Only PNG, JPG and JPEG file types are allowed');
            event.target.value = ''; // Reset input
            return;
        }

        // Validate file size (max 10MB for original)
        if (file.size > 10 * 1024 * 1024) {
            alert('Image size must be less than 10MB');
            event.target.value = ''; // Reset input
            return;
        }

        try {
            // Convert to base64 for cropper
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                setOriginalImage(reader.result);
                setShowCropper(true);
            };
        } catch (error) {
            alert('Failed to process image: ' + error.message);
        }
    };

    // Handle crop complete
    // Receives the cropped and compressed base64 image
    const handleCropComplete = (base64String, file) => {
        setCroppedImage(base64String);
        setImageFile(file);
        setShowCropper(false);
        setOriginalImage(null);
    };

    // Handle crop cancel
    const handleCropCancel = () => {
        setShowCropper(false);
        setOriginalImage(null);
    };

    // Reset all states
    const reset = () => {
        setOriginalImage(null);
        setCroppedImage(null);
        setShowCropper(false);
        setImageFile(null);
    };

    // Clear cropped image
    const clearCroppedImage = () => {
        setCroppedImage(null);
        setImageFile(null);
    };

    return {
        // State
        croppedImage,
        showCropper,
        originalImage,
        imageFile,

        // Methods
        handleFileSelect,
        handleCropComplete,
        handleCropCancel,
        reset,
        clearCroppedImage,

        // Config (for passing to ImageCropperModal)
        cropperConfig: {
            aspectRatio,
            outputWidth,
            outputHeight,
            cropShape,
            maxSizeMB
        }
    };
};

export default useImageCropper;
