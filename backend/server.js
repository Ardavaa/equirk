
require('dotenv').config();
const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const cors = require('cors');
const { generateRoadmap } = require('./roadmap_generator');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads (memory storage for PDF processing)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Only accept PDF files
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend server is running' });
});

// PDF text extraction endpoint
app.post('/api/extract-pdf-text', upload.single('pdf'), async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ 
        error: 'No PDF file uploaded',
        message: 'Please upload a PDF file'
      });
    }

    console.log(`Processing PDF: ${req.file.originalname} (${req.file.size} bytes)`);

    // Extract text from PDF buffer
    const pdfData = await pdfParse(req.file.buffer);
    
    // Return extracted text
    res.json({
      success: true,
      text: pdfData.text,
      metadata: {
        filename: req.file.originalname,
        pages: pdfData.numpages,
        info: pdfData.info,
        textLength: pdfData.text.length
      }
    });

  } catch (error) {
    console.error('PDF extraction error:', error);
    
    res.status(500).json({
      error: 'Failed to extract text from PDF',
      message: error.message
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File too large',
        message: 'PDF file must be smaller than 10MB'
      });
    }
  }
  
  res.status(500).json({
    error: 'Server error',
    message: error.message
  });
});


// Roadmap generator endpoint
app.get('/api/roadmap', async (req, res) => {
  const { job, disabilities } = req.query;
  console.log('Roadmap request received for job:', job, 'with disabilities:', disabilities);
  if (!job) return res.status(400).json({ error: 'Missing job parameter' });
  
  try {
    console.log('Generating roadmap...');
    const roadmap = await generateRoadmap(job, disabilities);
    console.log('Roadmap generated:', roadmap);
    console.log('DisabilityGuidance in roadmap:', roadmap.disabilityGuidance ? 'Present' : 'Not present');
    
    // Since generateRoadmap now returns arrays directly, just validate they exist and are arrays
    const safe = {
      basic: Array.isArray(roadmap.basic) ? roadmap.basic : [],
      intermediate: Array.isArray(roadmap.intermediate) ? roadmap.intermediate : [],
      advanced: Array.isArray(roadmap.advanced) ? roadmap.advanced : [],
      ...(roadmap.disabilityGuidance && { disabilityGuidance: roadmap.disabilityGuidance })
    };
    
    console.log('Safe roadmap with disability guidance:', safe.disabilityGuidance ? 'Present' : 'Not present');
    res.json(safe);
  } catch (e) {
    console.error('Roadmap generation error:', e);
    res.status(500).json({ error: e.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📄 PDF extraction endpoint: POST /api/extract-pdf-text`);
}); 