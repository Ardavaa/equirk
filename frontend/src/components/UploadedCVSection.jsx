import React from 'react';
import PDFLogo from '../assets/PDF Logo.png';

function UploadedCVSection({ resumeData, onBackToCareerInsights }) {
  if (!resumeData) return null;

  const formatFileSize = (size) => {
    if (!size) return 'PDF';
    return `${Math.round(size / 1024)} KB • PDF`;
  };

  const getFileName = () => {
    // Use the original filename if available, otherwise fallback to generic name
    if (resumeData.name) {
      return resumeData.name;
    }
    if (resumeData.originalname) {
      return resumeData.originalname;
    }
    return 'User-Resume.pdf';
  };

  const handleViewFile = () => {
    // Check if we have file data to download
    if (resumeData.fileContent || resumeData.data || resumeData.buffer || resumeData.file) {
      try {
        let blob;
        
        // Handle different data formats
        if (resumeData.fileContent) {
          // If fileContent is base64 string
          if (typeof resumeData.fileContent === 'string') {
            try {
              const byteCharacters = atob(resumeData.fileContent);
              const byteNumbers = new Array(byteCharacters.length);
              for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
              }
              const byteArray = new Uint8Array(byteNumbers);
              blob = new Blob([byteArray], { type: 'application/pdf' });
            } catch (e) {
              console.error('Error decoding base64:', e);
              // Try as direct string
              blob = new Blob([resumeData.fileContent], { type: 'application/pdf' });
            }
          } else {
            blob = new Blob([resumeData.fileContent], { type: 'application/pdf' });
          }
        } else if (resumeData.data) {
          // If data is base64 string
          if (typeof resumeData.data === 'string') {
            try {
              const byteCharacters = atob(resumeData.data);
              const byteNumbers = new Array(byteCharacters.length);
              for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
              }
              const byteArray = new Uint8Array(byteNumbers);
              blob = new Blob([byteArray], { type: 'application/pdf' });
            } catch (e) {
              console.error('Error decoding base64:', e);
              blob = new Blob([resumeData.data], { type: 'application/pdf' });
            }
          } else {
            // If data is already a blob or buffer
            blob = new Blob([resumeData.data], { type: 'application/pdf' });
          }
        } else if (resumeData.buffer) {
          blob = new Blob([resumeData.buffer], { type: 'application/pdf' });
        } else if (resumeData.file) {
          blob = resumeData.file;
        }
        
        if (blob && blob.size > 0) {
          // Create download link
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = getFileName();
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        } else {
          alert('File data not available for download. The file content was not stored during upload.');
        }
      } catch (error) {
        console.error('Error downloading file:', error);
        alert('Error downloading file. Please try again.');
      }
    } else {
      // If no file data available, show a more helpful message
      alert(`File "${getFileName()}" is not available for download. The file content was not stored during the upload process.`);
    }
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Uploaded CV</h3>
      <p className="text-gray-600 text-sm mb-4">
        We matched you with careers based on the skills and experiences in this file.
      </p>
      
      <div className="bg-white border border-[#EAEAEA] rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center">
            <img 
              src={PDFLogo} 
              alt="PDF" 
              className="w-8 h-8 object-contain"
            />
          </div>
          <div>
            <p className="font-medium text-gray-900">{getFileName()}</p>
            <p className="text-sm text-gray-500">
              {formatFileSize(resumeData.size)}
            </p>
          </div>
        </div>
        <button 
          onClick={handleViewFile}
          className="text-[#2D6A4F] hover:text-[#22503B] font-medium text-sm transition-colors"
        >
          View file
        </button>
      </div>
      
      <p className="text-sm text-gray-500 mt-3">
        These jobs are based on your last Career Insights. <button 
          onClick={onBackToCareerInsights}
          className="text-[#2D6A4F] hover:text-[#22503B] underline"
        >
          Create a new one
        </button> to refresh your matches.
      </p>
    </div>
  );
}

export default UploadedCVSection;