const OpenAI = require('openai');
const natural = require('natural');
const stopwords = require('stopword');

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize tokenizer
const tokenizer = new natural.WordTokenizer();

/**
 * Extract keywords from text using TF-IDF and OpenAI embeddings
 */
async function extractKeywords(text, maxKeywords = 30) {
  try {
    // Clean and tokenize text
    const cleanedText = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const tokens = tokenizer.tokenize(cleanedText);
    
    // Remove stopwords
    const filteredTokens = stopwords.removeStopwords(tokens);
    
    // Count word frequencies
    const wordFreq = {};
    filteredTokens.forEach(token => {
      if (token.length > 2) { // Only words longer than 2 characters
        wordFreq[token] = (wordFreq[token] || 0) + 1;
      }
    });

    // Sort by frequency and get top keywords
    const sortedKeywords = Object.entries(wordFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, maxKeywords)
      .map(([word]) => word);

    // Use OpenAI to enhance keyword extraction for important terms
    const enhancedKeywords = await enhanceKeywordsWithAI(text, sortedKeywords.slice(0, 15));

    return enhancedKeywords;

  } catch (error) {
    console.error('Keyword extraction error:', error);
    // Fallback to basic extraction
    return extractBasicKeywords(text, maxKeywords);
  }
}

/**
 * Enhance keywords using OpenAI for better relevance
 */
async function enhanceKeywordsWithAI(text, basicKeywords) {
  try {
    const prompt = `
Extract the most important professional keywords and skills from this text. Focus on:
- Technical skills and technologies
- Professional competencies
- Industry-specific terms
- Action verbs and achievements

Text: ${text.substring(0, 1500)}

Current keywords: ${basicKeywords.join(', ')}

Return only the most relevant keywords as a JSON array, maximum 20 items:
["keyword1", "keyword2", "keyword3"]
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 300
    });

    const response = completion.choices[0].message.content;
    
    try {
      const enhancedKeywords = JSON.parse(response);
      return Array.isArray(enhancedKeywords) ? enhancedKeywords : basicKeywords;
    } catch (parseError) {
      return basicKeywords;
    }

  } catch (error) {
    console.error('AI keyword enhancement error:', error);
    return basicKeywords;
  }
}

/**
 * Basic keyword extraction fallback
 */
function extractBasicKeywords(text, maxKeywords = 20) {
  const cleanedText = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const tokens = tokenizer.tokenize(cleanedText);
  const filteredTokens = stopwords.removeStopwords(tokens);
  
  const wordFreq = {};
  filteredTokens.forEach(token => {
    if (token.length > 2) {
      wordFreq[token] = (wordFreq[token] || 0) + 1;
    }
  });

  return Object.entries(wordFreq)
    .sort(([,a], [,b]) => b - a)
    .slice(0, maxKeywords)
    .map(([word]) => word);
}

/**
 * Calculate semantic similarity between two texts using OpenAI embeddings
 */
async function calculateSimilarity(text1, text2) {
  try {
    // Truncate texts to avoid token limits
    const truncatedText1 = text1.substring(0, 2000);
    const truncatedText2 = text2.substring(0, 2000);

    // Get embeddings for both texts
    const embedding1 = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: truncatedText1,
    });

    const embedding2 = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: truncatedText2,
    });

    // Calculate cosine similarity
    const similarity = cosineSimilarity(
      embedding1.data[0].embedding,
      embedding2.data[0].embedding
    );

    return Math.max(0, Math.min(1, similarity)); // Ensure between 0 and 1

  } catch (error) {
    console.error('Similarity calculation error:', error);
    // Fallback to basic text similarity
    return calculateBasicSimilarity(text1, text2);
  }
}

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(vecA, vecB) {
  if (vecA.length !== vecB.length) {
    throw new Error('Vectors must have the same length');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dotProduct / (normA * normB);
}

/**
 * Basic text similarity fallback using Jaccard similarity
 */
function calculateBasicSimilarity(text1, text2) {
  const words1 = new Set(text1.toLowerCase().split(/\s+/));
  const words2 = new Set(text2.toLowerCase().split(/\s+/));

  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);

  return intersection.size / union.size;
}

/**
 * Extract action verbs from text
 */
function extractActionVerbs(text) {
  const actionVerbs = [
    'managed', 'developed', 'created', 'implemented', 'designed',
    'led', 'coordinated', 'analyzed', 'improved', 'optimized',
    'increased', 'decreased', 'reduced', 'enhanced', 'streamlined',
    'facilitated', 'delivered', 'achieved', 'exceeded', 'maintained',
    'supervised', 'trained', 'mentored', 'collaborated', 'negotiated',
    'resolved', 'generated', 'produced', 'established', 'launched'
  ];

  const words = text.toLowerCase().split(/\s+/);
  const foundVerbs = actionVerbs.filter(verb => 
    words.some(word => word.includes(verb))
  );

  return [...new Set(foundVerbs)]; // Remove duplicates
}

/**
 * Calculate text readability score
 */
function calculateReadability(text) {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const syllables = countSyllables(text);

  if (sentences.length === 0 || words.length === 0) {
    return 0;
  }

  // Flesch Reading Ease formula
  const fleschScore = 206.835 - (1.015 * (words.length / sentences.length)) - (84.6 * (syllables / words.length));
  
  return Math.max(0, Math.min(100, fleschScore));
}

/**
 * Count syllables in text (simplified)
 */
function countSyllables(text) {
  const words = text.toLowerCase().split(/\s+/);
  let syllableCount = 0;

  words.forEach(word => {
    const cleanWord = word.replace(/[^a-z]/g, '');
    if (cleanWord.length <= 3) {
      syllableCount += 1;
    } else {
      // Simple syllable counting
      const vowels = cleanWord.match(/[aeiouy]+/g);
      syllableCount += vowels ? vowels.length : 1;
    }
  });

  return syllableCount;
}

module.exports = {
  extractKeywords,
  calculateSimilarity,
  extractActionVerbs,
  calculateReadability
}; 