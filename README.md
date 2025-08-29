# AI ATS Resume Score Checker

An intelligent resume analysis tool that evaluates resumes against job descriptions using AI-powered semantic matching and provides actionable improvement suggestions.

## 🚀 Features

### Core Functionality
- **Resume Upload**: Support for PDF, DOCX, and plain text files
- **Job Description Analysis**: Input job descriptions for comparison
- **ATS Compatibility Check**: Evaluates formatting and structure
- **Semantic Matching**: AI-powered keyword and skill matching
- **Score Breakdown**: Detailed scoring across multiple dimensions
- **Improvement Suggestions**: AI-generated tips for resume enhancement

### Advanced Features
- **Keyword Highlighting**: Visual comparison of resume vs JD keywords
- **Section Analysis**: Checks for essential resume sections
- **Formatting Validation**: ATS-friendly formatting recommendations
- **Export Options**: Download feedback and improved versions

## 🛠️ Tech Stack

### Frontend
- **React.js** - Modern UI framework
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **React Dropzone** - File upload handling

### Backend
- **Node.js + Express** - API server
- **OpenAI API** - Semantic analysis and suggestions
- **PDF/DOCX Parsers** - Document processing
- **CORS** - Cross-origin resource sharing

### AI & NLP
- **OpenAI Embeddings** - Semantic similarity matching
- **Keyword Extraction** - Smart keyword identification
- **Text Analysis** - Resume structure validation

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ats-resume-checker
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp env.example .env
   
   # Edit .env and add your OpenAI API key
   # Get your API key from: https://platform.openai.com/api-keys
   ```

4. **Add your OpenAI API key**
   - Go to [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create a new API key
   - Add it to your `.env` file:
   ```
   OPENAI_API_KEY=your_actual_api_key_here
   ```

5. **Start development servers**
   ```bash
   npm run dev
   ```

## 🔐 Security Notes

- **Never commit your `.env` file** - it contains sensitive API keys
- The `.env` file is already in `.gitignore` to prevent accidental commits
- Use `env.example` as a template for required environment variables
- For production, set environment variables securely on your hosting platform

## 🎯 Usage

1. **Upload Resume**: Drag and drop or select your resume file (PDF/DOCX/TXT)
2. **Input Job Description**: Paste the job description you're applying for
3. **Analyze**: Click "Analyze Resume" to get your score and feedback
4. **Review Results**: Check your ATS score, keyword matches, and suggestions
5. **Improve**: Follow the AI-generated suggestions to enhance your resume

## 📊 Scoring System

The tool evaluates resumes across multiple dimensions:

- **ATS Compatibility** (25%): Formatting, structure, and parsing
- **Keyword Match** (30%): Skills and terminology alignment
- **Content Quality** (20%): Action verbs, impact statements
- **Section Completeness** (15%): Essential resume sections
- **Overall Readability** (10%): Clarity and professional presentation

## 🔧 API Endpoints

- `POST /api/analyze` - Analyze resume against job description
- `POST /api/upload` - Upload and parse resume file
- `GET /api/health` - Health check endpoint

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd client
npm run build
```

### Backend (Railway/Heroku)
```bash
cd server
npm start
```

**Important**: Set your `OPENAI_API_KEY` environment variable in your hosting platform's dashboard.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- OpenAI for semantic analysis capabilities
- The open-source community for document parsing libraries
- Jobscan.co and similar platforms for inspiration 

     Made By Shubham Rakheja[Linkedln](https://www.linkedin.com/in/shubham-rakheja-8a514a289)