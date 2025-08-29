const express = require('express');
const router = express.Router();
const multer = require('multer');
const { parseDocument } = require('../services/documentService');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept PDF, DOCX, and TXT files
    const allowedTypes = [
      'application/pdf',
      'application/x-pdf',
      'application/acrobat',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      console.error('Rejected file type:', file.mimetype);
      cb(new Error('Invalid file type. Only PDF, DOCX, and TXT files are allowed.'), false);
    }
  }
});

/**
 * @route POST /api/upload
 * @desc Upload and parse resume document
 * @access Public
 */
router.post('/', upload.single('resume'), async (req, res, next) => {
  try {
    if (!req.file) {
      console.error('No file uploaded or invalid file type.');
      return res.status(400).json({
        error: 'No file uploaded',
        message: 'Please upload a valid PDF, DOCX, or TXT resume file.'
      });
    }
    const { originalname, mimetype, buffer } = req.file;
    console.log(`📁 Processing file: ${originalname} (${mimetype})`);
    // Parse the document
    let parsedText;
    try {
      parsedText = await parseDocument(buffer, mimetype);
    } catch (parseErr) {
      console.error('Document parsing failed:', parseErr);
      return res.status(400).json({
        error: 'Document parsing failed',
        message: 'Could not extract text from the uploaded file. Please ensure the file contains readable, selectable text (not a scanned image).'
      });
    }
    if (!parsedText || parsedText.trim().length === 0) {
      console.error('Parsed text is empty.');
      return res.status(400).json({
        error: 'Document parsing failed',
        message: 'Could not extract text from the uploaded file. Please ensure the file contains readable, selectable text (not a scanned image).'
      });
    }
    console.log(`✅ Successfully parsed ${originalname}. Text length: ${parsedText.length} characters`);
    res.json({
      success: true,
      data: {
        fileName: originalname,
        fileType: mimetype,
        text: parsedText,
        textLength: parsedText.length,
        wordCount: parsedText.split(/\s+/).length
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An unexpected error occurred during file upload. Please try again or use a different file.'
    });
  }
});

/**
 * @route GET /api/upload/supported-formats
 * @desc Get list of supported file formats
 * @access Public
 */
router.get('/supported-formats', (req, res) => {
  res.json({
    supportedFormats: [
      {
        extension: '.pdf',
        mimeType: 'application/pdf',
        description: 'Portable Document Format'
      },
      {
        extension: '.docx',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        description: 'Microsoft Word Document'
      },
      {
        extension: '.txt',
        mimeType: 'text/plain',
        description: 'Plain Text File'
      }
    ],
    maxFileSize: '10MB'
  });
});

module.exports = router; 