'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageDropzoneProps {
  onImageLoad: (imageData: ImageData, imageUrl: string) => void;
  currentImage: string | null;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
};

export function ImageDropzone({ onImageLoad, currentImage }: ImageDropzoneProps) {
  const loadImage = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Create canvas to get image data
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Limit canvas size for performance
        const maxDimension = 800;
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = (height / width) * maxDimension;
            width = maxDimension;
          } else {
            width = (width / height) * maxDimension;
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        const imageData = ctx.getImageData(0, 0, width, height);
        onImageLoad(imageData, e.target?.result as string);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, [onImageLoad]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      loadImage(file);
    }
  }, [loadImage]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: MAX_FILE_SIZE,
    multiple: false,
  });

  const hasError = fileRejections.length > 0;
  const errorMessage = hasError
    ? fileRejections[0].errors[0].code === 'file-too-large'
      ? 'File is too large. Maximum size is 10MB.'
      : 'Please upload a valid image file (JPG, PNG, or WebP).'
    : null;

  return (
    <div
      {...getRootProps()}
      className={`
        relative border-2 border-dashed rounded-2xl transition-all duration-200 cursor-pointer
        ${isDragActive
          ? 'border-purple-500 bg-purple-50'
          : hasError
            ? 'border-red-400 bg-red-50'
            : 'border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100'
        }
        ${currentImage ? 'p-2' : 'p-12'}
      `}
    >
      <input {...getInputProps()} />

      <AnimatePresence mode="wait">
        {currentImage ? (
          <motion.div
            key="image"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative aspect-video rounded-xl overflow-hidden"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentImage}
              alt="Uploaded image"
              className="w-full h-full object-contain bg-gray-900"
            />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
              <div className="text-white text-center">
                <svg
                  className="w-8 h-8 mx-auto mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-sm font-medium">Click or drop to replace</p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
              isDragActive ? 'bg-purple-100' : 'bg-gray-200'
            }`}>
              <svg
                className={`w-8 h-8 ${isDragActive ? 'text-purple-600' : 'text-gray-500'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>

            {isDragActive ? (
              <p className="text-lg font-medium text-purple-600">Drop your image here</p>
            ) : (
              <>
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Drag & drop an image here
                </p>
                <p className="text-gray-500">or click to browse</p>
                <p className="text-sm text-gray-400 mt-4">
                  Supports JPG, PNG, WebP up to 10MB
                </p>
              </>
            )}

            {errorMessage && (
              <p className="mt-4 text-sm text-red-600 font-medium">{errorMessage}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
