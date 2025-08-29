const express = require('express');
const router = express.Router();
const { analyzeResume } = require('../services/analysisService');
const { validateAnalysisRequest } = require('../middleware/validation');

/**
 * @route POST /api/analyze
 * @desc Analyze resume against job description
 * @access Public
 */
router.post('/', validateAnalysisRequest, async (req, res, next) => {
  try {
    const { resumeText, jobDescription, fileName } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Resume text and job description are required'
      });
    }

    console.log(`📄 Analyzing resume: ${fileName || 'Untitled'}`);
    
    // Perform the analysis
    const analysis = await analyzeResume(resumeText, jobDescription, fileName);
    
    console.log(`✅ Analysis completed. Score: ${analysis.overallScore}/100`);
    
    res.json({
      success: true,
      data: analysis,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Analysis error:', error);
    next(error);
  }
});

/**
 * @route GET /api/analyze/health
 * @desc Check analysis service health
 * @access Public
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Resume Analysis',
    timestamp: new Date().toISOString()
  });
});

module.exports = router; 