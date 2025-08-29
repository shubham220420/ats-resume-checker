/**
 * Analyze resume structure and ATS compatibility
 */
function validateResumeStructure(resumeText) {
  const analysis = {
    sections: {},
    issues: [],
    recommendations: [],
    score: 0,
    sectionScore: 0
  };

  // Define essential resume sections
  const essentialSections = [
    { name: 'contact', patterns: ['contact', 'email', 'phone', 'address'] },
    { name: 'summary', patterns: ['summary', 'objective', 'profile', 'about'] },
    { name: 'experience', patterns: ['experience', 'work history', 'employment', 'career'] },
    { name: 'education', patterns: ['education', 'academic', 'degree', 'university', 'college'] },
    { name: 'skills', patterns: ['skills', 'competencies', 'technologies', 'tools'] }
  ];

  // Check for each section
  let foundSections = 0;
  essentialSections.forEach(section => {
    const found = checkSection(resumeText, section.patterns);
    analysis.sections[section.name] = found;
    if (found) foundSections++;
  });

  // Calculate section completeness score
  analysis.sectionScore = (foundSections / essentialSections.length) * 100;

  // Check for ATS compatibility issues
  const atsIssues = checkATSCompatibility(resumeText);
  analysis.issues = [...atsIssues];

  // Generate recommendations
  analysis.recommendations = generateRecommendations(analysis.sections, atsIssues);

  // Calculate overall structure score
  analysis.score = calculateStructureScore(analysis.sectionScore, atsIssues.length);

  return analysis;
}

/**
 * Check if a section exists in the resume
 */
function checkSection(text, patterns) {
  const lowerText = text.toLowerCase();
  return patterns.some(pattern => lowerText.includes(pattern));
}

/**
 * Check for ATS compatibility issues
 */
function checkATSCompatibility(text) {
  const issues = [];

  // Check for images or graphics
  if (text.includes('image') || text.includes('graphic') || text.includes('photo')) {
    issues.push('Contains images or graphics that may not be parsed by ATS');
  }

  // Check for tables
  if (text.includes('table') || text.includes('grid')) {
    issues.push('Contains tables that may not be parsed correctly by ATS');
  }

  // Check for excessive formatting
  const formattingPatterns = [
    /\*\*.*?\*\*/g, // Bold
    /\*.*?\*/g,     // Italic
    /_.*?_/g,       // Underline
    /`.*?`/g        // Code blocks
  ];

  formattingPatterns.forEach(pattern => {
    if (pattern.test(text)) {
      issues.push('Contains formatting that may not be preserved by ATS');
      return;
    }
  });

  // Check for headers and footers
  if (text.includes('header') || text.includes('footer')) {
    issues.push('Contains headers or footers that may interfere with ATS parsing');
  }

  // Check for page numbers
  if (/\bpage\s+\d+\b/i.test(text)) {
    issues.push('Contains page numbers that may interfere with ATS parsing');
  }

  // Check for excessive whitespace
  if (/\n\s*\n\s*\n/.test(text)) {
    issues.push('Contains excessive line breaks that may affect ATS parsing');
  }

  // Check for special characters
  const specialChars = /[^\w\s\.\,\;\:\!\?\-\(\)\[\]\{\}\@\#\$\%\&\+\=\/]/g;
  const matches = text.match(specialChars);
  if (matches && matches.length > text.length * 0.1) {
    issues.push('Contains excessive special characters that may affect ATS parsing');
  }

  // Check for font specifications
  if (text.includes('font') || text.includes('size') || text.includes('pt')) {
    issues.push('Contains font specifications that may not be preserved by ATS');
  }

  return issues;
}

/**
 * Generate recommendations based on analysis
 */
function generateRecommendations(sections, issues) {
  const recommendations = [];

  // Section-based recommendations
  if (!sections.contact) {
    recommendations.push('Add a clear contact information section with email and phone number');
  }

  if (!sections.summary) {
    recommendations.push('Include a professional summary or objective statement');
  }

  if (!sections.experience) {
    recommendations.push('Add a detailed work experience section with quantifiable achievements');
  }

  if (!sections.education) {
    recommendations.push('Include your educational background and relevant certifications');
  }

  if (!sections.skills) {
    recommendations.push('Add a skills section highlighting relevant technical and soft skills');
  }

  // ATS compatibility recommendations
  if (issues.length > 0) {
    recommendations.push('Use simple, clean formatting without images, tables, or excessive styling');
    recommendations.push('Avoid headers, footers, and page numbers');
    recommendations.push('Use standard fonts and avoid special formatting characters');
  }

  // General recommendations
  recommendations.push('Use bullet points for better readability');
  recommendations.push('Include quantifiable achievements (e.g., "Increased sales by 25%")');
  recommendations.push('Use action verbs to start bullet points');
  recommendations.push('Keep the resume to 1-2 pages maximum');

  return recommendations.slice(0, 8); // Limit to top 8 recommendations
}

/**
 * Calculate overall structure score
 */
function calculateStructureScore(sectionScore, issueCount) {
  // Base score from section completeness
  let score = sectionScore;

  // Deduct points for ATS issues
  const issuePenalty = issueCount * 10;
  score = Math.max(0, score - issuePenalty);

  // Bonus for good structure
  if (sectionScore >= 80 && issueCount === 0) {
    score = Math.min(100, score + 10);
  }

  return Math.round(score);
}

/**
 * Extract section content
 */
function extractSectionContent(text, sectionName) {
  const sectionPatterns = {
    contact: /(?:contact|email|phone|address)[:\s]*([^\n]+)/gi,
    summary: /(?:summary|objective|profile|about)[:\s]*([^\n]+)/gi,
    experience: /(?:experience|work history|employment)[:\s]*([^\n]+)/gi,
    education: /(?:education|academic|degree)[:\s]*([^\n]+)/gi,
    skills: /(?:skills|competencies|technologies)[:\s]*([^\n]+)/gi
  };

  const pattern = sectionPatterns[sectionName];
  if (!pattern) return null;

  const matches = [];
  let match;
  while ((match = pattern.exec(text)) !== null) {
    matches.push(match[1].trim());
  }

  return matches.length > 0 ? matches : null;
}

/**
 * Check for action verbs in experience section
 */
function checkActionVerbs(text) {
  const actionVerbs = [
    'managed', 'developed', 'created', 'implemented', 'designed',
    'led', 'coordinated', 'analyzed', 'improved', 'optimized',
    'increased', 'decreased', 'reduced', 'enhanced', 'streamlined',
    'facilitated', 'delivered', 'achieved', 'exceeded', 'maintained'
  ];

  const foundVerbs = actionVerbs.filter(verb => 
    text.toLowerCase().includes(verb)
  );

  return {
    found: foundVerbs,
    count: foundVerbs.length,
    score: Math.min(100, (foundVerbs.length / 10) * 100)
  };
}

/**
 * Check for quantifiable achievements
 */
function checkQuantifiableAchievements(text) {
  const patterns = [
    /\d+%/g,                    // Percentages
    /\$\d+[,\d]*/g,            // Dollar amounts
    /\d+\s*(?:people|employees|team members)/gi,  // Team sizes
    /\d+\s*(?:years|months)/gi, // Time periods
    /increased\s+by\s+\d+/gi,   // Increase statements
    /decreased\s+by\s+\d+/gi,   // Decrease statements
    /reduced\s+by\s+\d+/gi      // Reduction statements
  ];

  const matches = [];
  patterns.forEach(pattern => {
    const found = text.match(pattern);
    if (found) matches.push(...found);
  });

  return {
    found: matches,
    count: matches.length,
    score: Math.min(100, (matches.length / 5) * 100)
  };
}

module.exports = {
  validateResumeStructure,
  extractSectionContent,
  checkActionVerbs,
  checkQuantifiableAchievements
}; 