import React, {useState, useCallback} from 'react';
import Cropper from 'react-easy-crop';
import imageCompression from 'browser-image-compression';

const ImageCropperModal = ({
                               image,
                               onCropComplete,
                               onCancel,
                               aspectRatio = 1, // 1 = square, 16/9 = landscape, 4/3 = standard
                               outputWidth = 400,
                               outputHeight = 400,
                               cropShape = 'rect', // 'rect' or 'round'
                               title = 'Crop Image',
                               maxSizeMB = 1 // Max compressed file size in MB
                           }) => {
    const [crop, setCrop] = useState({x: 0, y: 0});
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [loading, setLoading] = useState(false);

    const onCropCompleteCallback = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const createCroppedImage = async () => {
        try {
            setLoading(true);

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = outputWidth;
            canvas.height = outputHeight;

            const imageElement = new Image();
            imageElement.src = image;

            await new Promise((resolve, reject) => {
                imageElement.onload = resolve;
                imageElement.onerror = reject;
            });

            // Save context state
            ctx.save();

            // Apply rotation if needed
            if (rotation !== 0) {
                const radians = (rotation * Math.PI) / 180;
                ctx.translate(canvas.width / 2, canvas.height / 2);
                ctx.rotate(radians);
                ctx.translate(-canvas.width / 2, -canvas.height / 2);
            }

            // Draw cropped image scaled to output size
            ctx.drawImage(
                imageElement,
                croppedAreaPixels.x,
                croppedAreaPixels.y,
                croppedAreaPixels.width,
                croppedAreaPixels.height,
                0,
                0,
                outputWidth,
                outputHeight
            );

            ctx.restore();

            // Convert canvas to blob
            const blob = await new Promise((resolve) => {
                canvas.toBlob(resolve, 'image/jpeg', 0.95);
            });

            // Compress image
            const compressedFile = await imageCompression(blob, {
                maxSizeMB: maxSizeMB,
                maxWidthOrHeight: Math.max(outputWidth, outputHeight),
                useWebWorker: true,
                fileType: 'image/jpeg'
            });

            // Convert to base64
            const reader = new FileReader();
            reader.readAsDataURL(compressedFile);
            reader.onloadend = () => {
                const base64String = reader.result;
                onCropComplete(base64String, compressedFile);
                setLoading(false);
            };

        } catch (error) {
            console.error('Error cropping image:', error);
            alert('Failed to crop image. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                </div>

                {/*Cropper Area*/}
                <div className="relative h-96 bg-gray-100">
                    <Cropper
                        image={image}
                        crop={crop}
                        zoom={zoom}
                        rotation={rotation}
                        aspect={aspectRatio}
                        cropShape={cropShape}
                        showGrid={true}
                        onCropChange={setCrop}
                        onCropComplete={onCropCompleteCallback}
                        onZoomChange={setZoom}
                        onRotationChange={setRotation}
                    />
                </div>

                {/* Controls */}
                <div className="px-6 py-4 space-y-4">
                    {/* Zoom Control */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Zoom
                        </label>
                        <input
                            type="range"
                            min={1}
                            max={3}
                            step={0.1}
                            value={zoom}
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                        />
                    </div>

                    {/* Rotation Control */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rotation
                        </label>
                        <input
                            type="range"
                            min={0}
                            max={360}
                            step={1}
                            value={rotation}
                            onChange={(e) => setRotation(Number(e.target.value))}
                            className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                        />
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={createCroppedImage}
                        disabled={loading}
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                            strokeWidth="4" fill="none"/>
                                    <path className="opacity-75" fill="currentColor"
                                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                </svg>
                                Processing...
                            </>
                        ) : (
                            'Crop & Save'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageCropperModal;
