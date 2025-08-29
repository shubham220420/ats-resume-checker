# ATS Resume Checker - Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd ats-resume-checker

# Install all dependencies
npm run install-all
```

### 2. Environment Setup

```bash
# Copy environment file
cp env.example .env

# Edit .env and add your OpenAI API key
# OPENAI_API_KEY=your_actual_openai_api_key_here
```

### 3. Get OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and paste it in your `.env` file

### 4. Start Development Servers

```bash
# Start both frontend and backend
npm run dev
```

This will start:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 📁 Project Structure

```
ats-resume-checker/
├── client/                 # React frontend
│   ├── public/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── App.js         # Main app component
│   │   └── index.js       # Entry point
│   ├── package.json
│   └── tailwind.config.js
├── server/                 # Node.js backend
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── middleware/        # Express middleware
│   ├── index.js           # Server entry point
│   └── package.json
├── package.json           # Root package.json
├── README.md
└── .env                   # Environment variables
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key | Yes |
| `PORT` | Server port (default: 5000) | No |
| `NODE_ENV` | Environment (development/production) | No |
| `CLIENT_URL` | Frontend URL for CORS | No |

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/upload` | POST | Upload resume file |
| `/api/analyze` | POST | Analyze resume vs job description |
| `/api/upload/supported-formats` | GET | Get supported file formats |

## 🛠️ Development

### Available Scripts

```bash
# Root level
npm run dev              # Start both frontend and backend
npm run server           # Start only backend
npm run client           # Start only frontend
npm run install-all      # Install all dependencies
npm run build            # Build frontend for production

# Backend only
cd server
npm run dev              # Start with nodemon
npm start                # Start production server

# Frontend only
cd client
npm start                # Start development server
npm run build            # Build for production
```

### Adding New Features

1. **Backend Services**: Add new services in `server/services/`
2. **API Routes**: Add new routes in `server/routes/`
3. **Frontend Components**: Add components in `client/src/components/`
4. **Pages**: Add pages in `client/src/pages/`

## 🧪 Testing

```bash
# Test backend
cd server
npm test

# Test frontend
cd client
npm test
```

## 📦 Deployment

### Frontend (Vercel/Netlify)

```bash
cd client
npm run build
# Deploy the build folder
```

### Backend (Railway/Heroku)

```bash
cd server
npm start
# Deploy to your preferred platform
```

### Environment Variables for Production

Make sure to set these in your production environment:
- `OPENAI_API_KEY`
- `NODE_ENV=production`
- `CLIENT_URL` (your frontend URL)

## 🔍 Troubleshooting

### Common Issues

1. **OpenAI API Error**
   - Check your API key is correct
   - Ensure you have sufficient credits
   - Verify the API key has the right permissions

2. **File Upload Issues**
   - Check file size (max 10MB)
   - Verify file format (PDF, DOCX, TXT)
   - Ensure file contains readable text

3. **CORS Errors**
   - Check `CLIENT_URL` in environment variables
   - Verify frontend and backend URLs match

4. **Port Conflicts**
   - Change `PORT` in `.env` file
   - Ensure ports 3000 and 5000 are available

### Debug Mode

```bash
# Enable debug logging
NODE_ENV=development DEBUG=* npm run dev
```

## 📚 API Documentation

### Analyze Resume

**POST** `/api/analyze`

Request body:
```json
{
  "resumeText": "Your resume content...",
  "jobDescription": "Job description content...",
  "fileName": "resume.pdf"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "overallScore": 85,
    "breakdown": {
      "atsCompatibility": 90,
      "keywordMatch": 85,
      "contentQuality": 80,
      "sectionCompleteness": 95,
      "overallReadability": 88
    },
    "keywordAnalysis": {
      "matched": ["javascript", "react"],
      "missing": ["python", "django"]
    },
    "structureAnalysis": {
      "sections": {
        "contact": true,
        "summary": true,
        "experience": true,
        "education": true,
        "skills": true
      },
      "issues": [],
      "recommendations": []
    },
    "aiSuggestions": {
      "general": ["Add more quantifiable achievements"],
      "specific": ["Include Python experience"],
      "actionVerbs": ["Implemented", "Developed"],
      "powerPhrases": ["Increased efficiency by 25%"]
    }
  }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details 