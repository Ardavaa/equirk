
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

    // Extract text from PDF buffer
    const pdfData = await pdfParse(req.file.buffer);
    
    // Convert buffer to base64 for storage
    const fileContent = req.file.buffer.toString('base64');
    
    // Return extracted text and file content
    res.json({
      success: true,
      text: pdfData.text,
      fileData: {
        content: fileContent,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
      },
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
  if (!job) return res.status(400).json({ error: 'Missing job parameter' });
  
  try {
    const roadmap = await generateRoadmap(job, disabilities);
    
    // Since generateRoadmap now returns arrays directly, just validate they exist and are arrays
    const safe = {
      basic: Array.isArray(roadmap.basic) ? roadmap.basic : [],
      intermediate: Array.isArray(roadmap.intermediate) ? roadmap.intermediate : [],
      advanced: Array.isArray(roadmap.advanced) ? roadmap.advanced : [],
      ...(roadmap.disabilityGuidance && { disabilityGuidance: roadmap.disabilityGuidance })
    };
    
    res.json(safe);
  } catch (e) {
    console.error('Roadmap generation error:', e);
    res.status(500).json({ error: e.message });
  }
});

// In-memory storage for saved data (in production, use a database)
let savedDataStore = {};

// Endpoint to save user data (roadmaps, matches)
app.post('/api/saved-data/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const { savedRoadmaps, recentCareerMatches } = req.body;

    if (!savedDataStore[userId]) {
      savedDataStore[userId] = {};
    }

    if (savedRoadmaps) {
      savedDataStore[userId].savedRoadmaps = savedRoadmaps;
    }

    if (recentCareerMatches) {
      savedDataStore[userId].recentCareerMatches = recentCareerMatches;
    }

    res.json({ 
      success: true, 
      message: 'Data saved successfully',
      data: savedDataStore[userId]
    });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ error: 'Failed to save data' });
  }
});

// Endpoint to retrieve user data
app.get('/api/saved-data/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const userData = savedDataStore[userId] || {
      savedRoadmaps: [],
      recentCareerMatches: []
    };

    res.json(userData);
  } catch (error) {
    console.error('Error retrieving data:', error);
    res.status(500).json({ error: 'Failed to retrieve data' });
  }
});

// Endpoint to delete specific saved roadmap
app.delete('/api/saved-data/:userId/roadmap/:roadmapId', (req, res) => {
  try {
    const { userId, roadmapId } = req.params;
    
    if (savedDataStore[userId] && savedDataStore[userId].savedRoadmaps) {
      savedDataStore[userId].savedRoadmaps = savedDataStore[userId].savedRoadmaps
        .filter(roadmap => roadmap.id !== roadmapId);
    }

    res.json({ 
      success: true, 
      message: 'Roadmap deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting roadmap:', error);
    res.status(500).json({ error: 'Failed to delete roadmap' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📄 PDF extraction endpoint: POST /api/extract-pdf-text`);
  console.log(`💾 Saved data endpoints: GET/POST /api/saved-data/:userId`);
}); 