import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

const ResumeUpload = ({ onFileSelect, onTextExtracted, onJobRecommendations, className = '' }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [jobRecommendations, setJobRecommendations] = useState([]);
  const [isGettingRecommendations, setIsGettingRecommendations] = useState(false);
  const fileInputRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  // Only accept PDF files
  const acceptedTypes = [
    'application/pdf'
  ];

  const maxFileSize = 10 * 1024 * 1024; // 10MB

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const validateFile = (file) => {
    if (!acceptedTypes.includes(file.type)) {
      setError('Please upload a PDF file only');
      return false;
    }

    if (file.size > maxFileSize) {
      setError('File size must be less than 10MB');
      return false;
    }

    return true;
  };

  const extractTextFromBackend = async (file) => {
    const formData = new FormData();
    formData.append('pdf', file);

    const response = await fetch('http://localhost:3001/api/extract-pdf-text', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to extract text from PDF');
    }

    const result = await response.json();
    return result.text;
  };

  const getJobRecommendations = async (cvText) => {
    const response = await fetch('http://localhost:5000/recommend-jobs-batch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cv_text: cvText,
        top_n: 5
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to get job recommendations');
    }

    const result = await response.json();
    return result.recommendations;
  };

  const processFile = async (file) => {
    if (!validateFile(file)) return;

    setError('');
    setSelectedFile(file);
    setIsExtracting(true);
    setUploadProgress(0);
    
    try {
      // Show progress for file processing
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 70) {
            clearInterval(progressInterval);
            return 70;
          }
          return prev + 10;
        });
      }, 200);

      // Extract text from PDF using backend API
      const text = await extractTextFromBackend(file);
      
      // Update progress
      clearInterval(progressInterval);
      setUploadProgress(80);
      setExtractedText(text);
      setIsExtracting(false);
      
      // Log the extracted text (as requested)
      console.log('EXTRACTED TEXT:', text);
      
      // Get job recommendations
      setIsGettingRecommendations(true);
      setUploadProgress(85);
      
      try {
        const recommendations = await getJobRecommendations(text);
        setJobRecommendations(recommendations);
        console.log('JOB RECOMMENDATIONS:', recommendations);
        
        // Call callback to pass recommendations to parent
        if (onJobRecommendations) onJobRecommendations(recommendations);
        
        setUploadProgress(100);
      } catch (recError) {
        console.warn('Failed to get job recommendations:', recError);
        // Continue without recommendations
        setUploadProgress(100);
      }
      
      setIsGettingRecommendations(false);
      
      // Call callbacks
      if (onFileSelect) onFileSelect(file);
      if (onTextExtracted) onTextExtracted(text);
      
    } catch (error) {
      console.error('PDF processing error:', error);
      setError('Failed to extract text from PDF. Please try again.');
      setIsExtracting(false);
      setIsGettingRecommendations(false);
      setUploadProgress(0);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleBrowseFiles = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = () => (
    <svg 
      className="w-12 h-12 text-[#2D6A4F] mb-4" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={1.5} 
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
      />
    </svg>
  );

  const getCloudIcon = () => (
    <svg 
      className="w-12 h-12 text-[#2D6A4F] mb-4" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={1.5} 
        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" 
      />
    </svg>
  );



  return (
    <div className={`w-full ${className}`}>
      {!selectedFile ? (
        <div
          className={`
            relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer
            ${isDragActive 
              ? 'border-[#2D6A4F] bg-gradient-to-br from-green-50 to-emerald-50 scale-105' 
              : 'border-gray-300 bg-white hover:border-[#2D6A4F] hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50'
            }
            ${error ? 'border-red-300 bg-red-50' : ''}
          `}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleBrowseFiles}
        >
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf"
            onChange={handleFileSelect}
          />

          {/* Upload Icon */}
          <motion.div
            animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center"
          >
            {getCloudIcon()}
            
            <h3 className="text-xl font-medium text-custom-dark mb-2">
              Drag & drop your resume
            </h3>
            
            <p className="text-gray-600 mb-4">
              or{' '}
              <span className="text-[#2D6A4F] font-medium hover:underline">
                browse files
              </span>
            </p>
            
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                {getFileIcon()}
                <span>PDF files only</span>
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10M7 4v16a1 1 0 001 1h8a1 1 0 001 1V4M7 4H5a1 1 0 00-1 1v16a1 1 0 001 1h2" />
                </svg>
                <span>Max 10MB</span>
              </div>
            </div>
          </motion.div>

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm"
            >
              {error}
            </motion.div>
          )}
        </div>
      ) : (
        /* File Selected State */
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="border-2 border-[#2D6A4F] bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {getFileIcon()}
              <div>
                <h4 className="font-medium text-custom-dark">{selectedFile.name}</h4>
                <p className="text-sm text-gray-600">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={handleRemoveFile}
              className="p-2 text-[#2D6A4F] hover:text-[#22503B] hover:bg-green-100 rounded-lg transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress Bar */}
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">
                  {isGettingRecommendations 
                    ? 'Getting job recommendations...' 
                    : isExtracting 
                      ? 'Extracting text from PDF...' 
                      : 'Processing PDF...'
                  }
                </span>
                <span className="text-sm text-[#2D6A4F] font-medium">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="h-2 bg-gradient-to-r from-[#2D6A4F] to-[#22503B] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            </div>
          )}

          {/* Success State */}
          {uploadProgress === 100 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <div className="flex items-center gap-2 text-[#2D6A4F] text-sm font-medium">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                PDF processed successfully!
              </div>
              {extractedText && (
                <div className="text-xs text-gray-600">
                  Extracted {extractedText.length} characters from PDF
                </div>
              )}
              {jobRecommendations.length > 0 && (
                <div className="text-xs text-[#2D6A4F] mt-1">
                  ✨ Found {jobRecommendations.length} job recommendations
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default ResumeUpload; 