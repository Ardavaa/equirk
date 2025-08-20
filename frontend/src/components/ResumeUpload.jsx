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
    // Only set dragActive to false if we're leaving the drop zone entirely
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragActive(false);
    }
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
      className="w-8 h-8 md:w-12 md:h-12 text-[#2D6A4F] mb-4" 
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
      className="w-8 h-8 md:w-12 md:h-12 text-[#2D6A4F] mb-4" 
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
      <div className="space-y-4">
        {/* Upload Area */}
        {!selectedFile || uploadProgress < 100 ? (
          <div
            className={`
              relative border-2 border-dashed border-gray-300 rounded-lg p-12 text-center transition-all duration-200 cursor-pointer bg-white
              ${isDragActive 
                ? 'border-[#2D6A4F] bg-green-50' 
                : 'hover:border-[#2D6A4F] hover:bg-green-50'
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

            {/* Upload states */}
            {!selectedFile ? (
              /* Initial Upload State */
              <motion.div
                animate={isDragActive ? { scale: 1.05 } : { scale: 1 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center"
              >
                {/* Cloud Icon */}
                <svg className="w-12 h-12 text-[#2D6A4F] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Drag your file to start uploading
                </h3>
                
                <p className="text-gray-500 mb-6">OR</p>
                
                <button
                  type="button"
                  className="px-6 py-2 border border-[#2D6A4F] text-[#2D6A4F] rounded-lg hover:bg-green-50 transition-colors font-medium"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBrowseFiles();
                  }}
                >
                  Browse file
                </button>
              </motion.div>
            ) : uploadProgress > 0 && uploadProgress < 100 ? (
              /* Upload Progress State */
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center"
              >
                {/* Circular Progress */}
                <div className="relative w-16 h-16 mb-4">
                  <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="#e5e7eb"
                      strokeWidth="4"
                      fill="none"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="#2D6A4F"
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 28}`}
                      strokeDashoffset={`${2 * Math.PI * 28 * (1 - uploadProgress / 100)}`}
                      strokeLinecap="round"
                      className="transition-all duration-300"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-medium text-[#2D6A4F]">{uploadProgress}%</span>
                  </div>
                </div>
                
                <h3 className="text-lg font-medium text-gray-700 mb-4">
                  Uploading ...
                </h3>
                
                <button
                  type="button"
                  className="px-6 py-2 border border-[#2D6A4F] text-[#2D6A4F] rounded-lg hover:bg-green-50 transition-colors font-medium"
                  onClick={handleRemoveFile}
                >
                  Cancel
                </button>
              </motion.div>
            ) : null}

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
          /* File Uploaded Successfully State */
          <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-12 text-center bg-white">
            {/* Cloud Icon */}
            <svg className="w-12 h-12 text-[#2D6A4F] mb-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
            
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Drag your file to start uploading
            </h3>
            
            <p className="text-gray-500 mb-6">OR</p>
            
            <button
              type="button"
              className="px-6 py-2 border border-[#2D6A4F] text-[#2D6A4F] rounded-lg hover:bg-green-50 transition-colors font-medium"
              onClick={handleBrowseFiles}
            >
              Browse file
            </button>
          </div>
        )}

        {/* File size info */}
        <p className="text-center text-sm text-gray-500">
          Only support .pdf file up to 10MB
        </p>

        {/* Uploaded file details */}
        {selectedFile && uploadProgress === 100 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
          >
            <div className="flex items-center gap-3">
              {/* PDF Icon */}
              <div className="w-10 h-10 flex items-center justify-center">
                <img src="/src/assets/PDF Logo.png" alt="PDF" className="w-10 h-10" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 truncate max-w-[300px]" title={selectedFile.name}>
                  {selectedFile.name.length > 50 ? selectedFile.name.substring(0, 50) + '...' : selectedFile.name}
                </h4>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{(selectedFile.size / 1024).toFixed(0)} KB</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Completed</span>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={handleRemoveFile}
              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ResumeUpload; 