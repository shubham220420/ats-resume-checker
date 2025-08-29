import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { 
  Upload, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  Loader2,
  ArrowRight,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const AnalysisPage = () => {
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileName, setFileName] = useState('');

  // File upload handling
  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploadedFile(file);
    setFileName(file.name);

    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        setResumeText(response.data.data.text);
        toast.success('Resume uploaded and parsed successfully!');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload resume');
      setUploadedFile(null);
      setFileName('');
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  // Remove uploaded file
  const removeFile = () => {
    setUploadedFile(null);
    setFileName('');
    setResumeText('');
  };

  // Handle analysis
  const handleAnalysis = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      toast.error('Please provide both resume text and job description');
      return;
    }

    setIsAnalyzing(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/analyze`,
        {
          resumeText: resumeText.trim(),
          jobDescription: jobDescription.trim(),
          fileName: fileName || 'Resume'
        }
      );

      if (response.data.success) {
        // Store results in localStorage for the results page
        localStorage.setItem('analysisResults', JSON.stringify(response.data.data));
        navigate('/results');
        toast.success('Analysis completed successfully!');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error(error.response?.data?.message || 'Failed to analyze resume');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Analyze Your Resume
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Upload your resume and provide a job description to get AI-powered analysis and improvement suggestions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Resume Upload Section */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Resume Upload
              </h2>

              {!uploadedFile ? (
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragActive
                      ? 'border-primary-400 bg-primary-50'
                      : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  {isDragActive ? (
                    <p className="text-primary-600 font-medium">Drop your resume here...</p>
                  ) : (
                    <div>
                      <p className="text-gray-600 mb-2">
                        Drag & drop your resume here, or <span className="text-primary-600">browse</span>
                      </p>
                      <p className="text-sm text-gray-500">
                        Supports PDF, DOCX, and TXT files (max 10MB)
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-success-600 mr-2" />
                      <span className="font-medium text-gray-900">{fileName}</span>
                    </div>
                    <button
                      onClick={removeFile}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    File uploaded successfully
                  </p>
                </div>
              )}

              {/* Manual Resume Input */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Or paste your resume text:
                </label>
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your resume content here..."
                  className="input-field h-32 resize-none"
                  disabled={isAnalyzing}
                />
              </div>
            </div>

            {/* Job Description Section */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Job Description
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Paste the job description you're applying for:
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here..."
                  className="input-field h-64 resize-none"
                  disabled={isAnalyzing}
                />
              </div>

              {/* Tips */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-blue-900 mb-1">
                      Tips for better analysis:
                    </h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Include the complete job description</li>
                      <li>• Make sure your resume is in text format</li>
                      <li>• The more detailed the job description, the better the analysis</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Analysis Button */}
          <div className="text-center mt-8">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAnalysis}
              disabled={isAnalyzing || !resumeText.trim() || !jobDescription.trim()}
              className={`btn-primary text-lg px-8 py-3 flex items-center space-x-2 mx-auto ${
                (!resumeText.trim() || !jobDescription.trim()) && 'opacity-50 cursor-not-allowed'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <span>Analyze Resume</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalysisPage; 