/**
 * Validate analysis request
 */
function validateAnalysisRequest(req, res, next) {
  const { resumeText, jobDescription } = req.body;

  // Check if required fields exist
  if (!resumeText || !jobDescription) {
    return res.status(400).json({
      error: 'Missing required fields',
      message: 'Both resume text and job description are required'
    });
  }

  // Validate text lengths
  if (typeof resumeText !== 'string' || resumeText.trim().length < 50) {
    return res.status(400).json({
      error: 'Invalid resume text',
      message: 'Resume text must be at least 50 characters long'
    });
  }

  if (typeof jobDescription !== 'string' || jobDescription.trim().length < 20) {
    return res.status(400).json({
      error: 'Invalid job description',
      message: 'Job description must be at least 20 characters long'
    });
  }

  // Sanitize inputs
  req.body.resumeText = sanitizeText(resumeText);
  req.body.jobDescription = sanitizeText(jobDescription);

  next();
}

/**
 * Validate file upload request
 */
function validateFileUpload(req, res, next) {
  if (!req.file) {
    return res.status(400).json({
      error: 'No file uploaded',
      message: 'Please upload a resume file'
    });
  }

  const { originalname, mimetype, size } = req.file;

  // Check file size (10MB limit)
  const maxSize = 10 * 1024 * 1024;
  if (size > maxSize) {
    return res.status(400).json({
      error: 'File too large',
      message: `File size must be less than ${maxSize / (1024 * 1024)}MB`
    });
  }

  // Check file type
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];

  if (!allowedTypes.includes(mimetype)) {
    return res.status(400).json({
      error: 'Invalid file type',
      message: 'Only PDF, DOCX, and TXT files are supported'
    });
  }

  // Check filename
  if (!originalname || originalname.trim().length === 0) {
    return res.status(400).json({
      error: 'Invalid filename',
      message: 'File must have a valid name'
    });
  }

  next();
}

/**
 * Sanitize text input
 */
function sanitizeText(text) {
  return text
    .trim()
    .replace(/\s+/g, ' ') // Normalize whitespace
    .substring(0, 10000); // Limit length to prevent abuse
}

/**
 * Validate API key (if needed for future use)
 */
function validateAPIKey(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  
  // For now, this is optional - can be implemented later for rate limiting
  if (apiKey && apiKey !== process.env.API_KEY) {
    return res.status(401).json({
      error: 'Invalid API key',
      message: 'Please provide a valid API key'
    });
  }

  next();
}

/**
 * Rate limiting middleware
 */
function rateLimit(req, res, next) {
  // Simple in-memory rate limiting (for production, use Redis)
  const clientIP = req.ip;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 100;

  // Initialize rate limit tracking (in production, use Redis)
  if (!req.app.locals.rateLimit) {
    req.app.locals.rateLimit = new Map();
  }

  const userRequests = req.app.locals.rateLimit.get(clientIP) || [];
  
  // Remove old requests outside the window
  const validRequests = userRequests.filter(timestamp => now - timestamp < windowMs);
  
  if (validRequests.length >= maxRequests) {
    return res.status(429).json({
      error: 'Rate limit exceeded',
      message: 'Too many requests. Please try again later.'
    });
  }

  // Add current request
  validRequests.push(now);
  req.app.locals.rateLimit.set(clientIP, validRequests);

  next();
}

module.exports = {
  validateAnalysisRequest,
  validateFileUpload,
  validateAPIKey,
  rateLimit
}; 