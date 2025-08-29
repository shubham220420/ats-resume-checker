const OpenAI = require('openai');
const natural = require('natural');
const { extractKeywords, calculateSimilarity } = require('./nlpService');
const { validateResumeStructure } = require('./structureService');

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Main function to analyze resume against job description
 */
async function analyzeResume(resumeText, jobDescription, fileName = 'Resume') {
  try {
    console.log('🔍 Starting resume analysis...');

    // Step 1: Extract keywords from both documents
    const resumeKeywords = await extractKeywords(resumeText);
    const jobKeywords = await extractKeywords(jobDescription);

    // Step 2: Calculate semantic similarity
    const similarityScore = await calculateSimilarity(resumeText, jobDescription);

    // Step 3: Analyze resume structure
    const structureAnalysis = validateResumeStructure(resumeText);

    // Step 4: Get AI-powered suggestions
    const aiSuggestions = await generateAISuggestions(resumeText, jobDescription, resumeKeywords, jobKeywords);

    // Step 5: Calculate keyword match score
    const keywordMatch = calculateKeywordMatch(resumeKeywords, jobKeywords);

    // Step 6: Calculate overall score
    const overallScore = calculateOverallScore({
      similarityScore,
      keywordMatch,
      structureAnalysis,
      aiSuggestions
    });

    // Step 7: Generate detailed feedback
    const feedback = generateDetailedFeedback({
      keywordMatch,
      structureAnalysis,
      aiSuggestions,
      overallScore
    });

    return {
      overallScore: Math.round(overallScore),
      breakdown: {
        atsCompatibility: Math.round(structureAnalysis.score),
        keywordMatch: Math.round(keywordMatch.score),
        contentQuality: Math.round(aiSuggestions.contentQualityScore),
        sectionCompleteness: Math.round(structureAnalysis.sectionScore),
        overallReadability: Math.round(similarityScore * 100)
      },
      keywordAnalysis: {
        matched: keywordMatch.matched,
        missing: keywordMatch.missing,
        resumeKeywords: resumeKeywords.slice(0, 20), // Top 20
        jobKeywords: jobKeywords.slice(0, 20) // Top 20
      },
      structureAnalysis: {
        sections: structureAnalysis.sections,
        issues: structureAnalysis.issues,
        recommendations: structureAnalysis.recommendations
      },
      aiSuggestions: {
        general: aiSuggestions.general,
        specific: aiSuggestions.specific,
        actionVerbs: aiSuggestions.actionVerbs,
        powerPhrases: aiSuggestions.powerPhrases
      },
      feedback: feedback,
      metadata: {
        fileName,
        analysisDate: new Date().toISOString(),
        textLength: resumeText.length,
        wordCount: resumeText.split(/\s+/).length
      }
    };

  } catch (error) {
    console.error('Analysis service error:', error);
    throw new Error('Failed to analyze resume: ' + error.message);
  }
}

/**
 * Calculate keyword match between resume and job description
 */
function calculateKeywordMatch(resumeKeywords, jobKeywords) {
  const resumeSet = new Set(resumeKeywords.map(k => k.toLowerCase()));
  const jobSet = new Set(jobKeywords.map(k => k.toLowerCase()));
  
  const matched = jobKeywords.filter(keyword => 
    resumeSet.has(keyword.toLowerCase())
  );
  
  const missing = jobKeywords.filter(keyword => 
    !resumeSet.has(keyword.toLowerCase())
  );

  const score = (matched.length / jobKeywords.length) * 100;

  return {
    score: Math.min(score, 100),
    matched,
    missing,
    matchPercentage: Math.round((matched.length / jobKeywords.length) * 100)
  };
}

/**
 * Calculate overall score based on all analysis components
 */
function calculateOverallScore(components) {
  const weights = {
    atsCompatibility: 0.25,
    keywordMatch: 0.30,
    contentQuality: 0.20,
    sectionCompleteness: 0.15,
    overallReadability: 0.10
  };

  const scores = {
    atsCompatibility: components.structureAnalysis.score,
    keywordMatch: components.keywordMatch.score,
    contentQuality: components.aiSuggestions.contentQualityScore,
    sectionCompleteness: components.structureAnalysis.sectionScore,
    overallReadability: components.similarityScore * 100
  };

  let totalScore = 0;
  for (const [component, weight] of Object.entries(weights)) {
    totalScore += scores[component] * weight;
  }

  return Math.min(totalScore, 100);
}

/**
 * Generate AI-powered suggestions using OpenAI
 */
async function generateAISuggestions(resumeText, jobDescription, resumeKeywords, jobKeywords) {
  try {
    const prompt = `
As an expert resume writer and ATS specialist, analyze this resume against the job description and provide specific, actionable suggestions.

RESUME:
${resumeText.substring(0, 2000)}

JOB DESCRIPTION:
${jobDescription.substring(0, 2000)}

RESUME KEYWORDS: ${resumeKeywords.slice(0, 15).join(', ')}
JOB KEYWORDS: ${jobKeywords.slice(0, 15).join(', ')}

Please provide:
1. 3-5 general improvement suggestions
2. 3-5 specific suggestions for this job
3. 10 powerful action verbs to use
4. 5 impact phrases to incorporate
5. Content quality score (0-100)

Format as JSON:
{
  "general": ["suggestion1", "suggestion2"],
  "specific": ["suggestion1", "suggestion2"],
  "actionVerbs": ["verb1", "verb2"],
  "powerPhrases": ["phrase1", "phrase2"],
  "contentQualityScore": 85
}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1000
    });

    const response = completion.choices[0].message.content;
    
    try {
      return JSON.parse(response);
    } catch (parseError) {
      // Fallback if JSON parsing fails
      return {
        general: ["Focus on quantifiable achievements", "Use more action verbs"],
        specific: ["Add more relevant keywords from the job description"],
        actionVerbs: ["Implemented", "Developed", "Managed", "Created", "Optimized"],
        powerPhrases: ["Increased efficiency by", "Led team of", "Reduced costs by"],
        contentQualityScore: 75
      };
    }

  } catch (error) {
    console.error('AI suggestions error:', error);
    // Return fallback suggestions
    return {
      general: ["Focus on quantifiable achievements", "Use more action verbs"],
      specific: ["Add more relevant keywords from the job description"],
      actionVerbs: ["Implemented", "Developed", "Managed", "Created", "Optimized"],
      powerPhrases: ["Increased efficiency by", "Led team of", "Reduced costs by"],
      contentQualityScore: 75
    };
  }
}

/**
 * Generate detailed feedback based on analysis results
 */
function generateDetailedFeedback(analysis) {
  const feedback = {
    summary: '',
    strengths: [],
    weaknesses: [],
    recommendations: []
  };

  // Generate summary
  if (analysis.overallScore >= 80) {
    feedback.summary = "Excellent resume! Your resume is well-optimized for ATS systems and shows strong alignment with the job requirements.";
  } else if (analysis.overallScore >= 60) {
    feedback.summary = "Good resume with room for improvement. Focus on the suggestions below to increase your chances.";
  } else {
    feedback.summary = "Your resume needs significant improvements to pass ATS screening. Follow the recommendations below.";
  }

  // Identify strengths - add null checks
  if (analysis.keywordMatch && analysis.keywordMatch.matchPercentage >= 70) {
    feedback.strengths.push("Strong keyword alignment with job requirements");
  }
  if (analysis.structureAnalysis && analysis.structureAnalysis.score >= 80) {
    feedback.strengths.push("Good ATS-friendly formatting and structure");
  }
  if (analysis.aiSuggestions && analysis.aiSuggestions.contentQualityScore >= 80) {
    feedback.strengths.push("High-quality content with good impact statements");
  }

  // Identify weaknesses - add null checks
  if (analysis.keywordMatch && analysis.keywordMatch.missing && analysis.keywordMatch.missing.length > 5) {
    feedback.weaknesses.push(`Missing ${analysis.keywordMatch.missing.length} important keywords from the job description`);
  }
  if (analysis.structureAnalysis && analysis.structureAnalysis.issues && analysis.structureAnalysis.issues.length > 0) {
    feedback.weaknesses.push("Several formatting and structure issues detected");
  }
  if (analysis.aiSuggestions && analysis.aiSuggestions.contentQualityScore < 70) {
    feedback.weaknesses.push("Content could be more impactful and specific");
  }

  // Generate recommendations - add null checks
  const generalSuggestions = analysis.aiSuggestions && analysis.aiSuggestions.general ? analysis.aiSuggestions.general.slice(0, 3) : [];
  const specificSuggestions = analysis.aiSuggestions && analysis.aiSuggestions.specific ? analysis.aiSuggestions.specific.slice(0, 3) : [];
  const structureRecommendations = analysis.structureAnalysis && analysis.structureAnalysis.recommendations ? analysis.structureAnalysis.recommendations.slice(0, 2) : [];
  
  feedback.recommendations = [
    ...generalSuggestions,
    ...specificSuggestions,
    ...structureRecommendations
  ];

  return feedback;
}

module.exports = {
  analyzeResume
}; 