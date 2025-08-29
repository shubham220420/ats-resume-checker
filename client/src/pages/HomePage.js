import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Search, 
  BarChart3, 
  Lightbulb, 
  CheckCircle, 
  Zap,
  ArrowRight,
  Star,
  Users,
  TrendingUp
} from 'lucide-react';

const HomePage = () => {
  const features = [
    {
      icon: Search,
      title: 'Smart Keyword Matching',
      description: 'AI-powered semantic analysis to identify relevant keywords and skills from job descriptions.'
    },
    {
      icon: BarChart3,
      title: 'Detailed Score Breakdown',
      description: 'Get comprehensive scoring across ATS compatibility, keyword match, and content quality.'
    },
    {
      icon: Lightbulb,
      title: 'AI-Powered Suggestions',
      description: 'Receive personalized improvement recommendations and action verbs to enhance your resume.'
    },
    {
      icon: CheckCircle,
      title: 'ATS Compatibility Check',
      description: 'Ensure your resume passes through Applicant Tracking Systems with proper formatting.'
    }
  ];

  const stats = [
    { icon: Users, value: '100+', label: 'Resumes Analyzed' },
    { icon: Star, value: '4.0/5', label: 'User Rating' },
    { icon: TrendingUp, value: '80%', label: 'Success Rate' },
    { icon: Zap, value: '< 15s', label: 'Analysis Time' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Optimize Your Resume for
                <span className="text-gradient"> ATS Systems</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Get AI-powered analysis of your resume against job descriptions. 
                Improve your chances of getting past Applicant Tracking Systems with intelligent keyword matching and personalized suggestions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/analyze">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary text-lg px-8 py-3 flex items-center space-x-2"
                  >
                    <span>Start Analysis</span>
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
                <button className="btn-secondary text-lg px-8 py-3">
                  Learn More
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Resume Optimization
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our AI-powered platform provides comprehensive analysis and actionable insights to help you land your dream job.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="card hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Optimize Your Resume?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join thousands of job seekers who have improved their resume with our AI-powered analysis tool.
            </p>
            <Link to="/analyze">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-primary-600 font-semibold py-3 px-8 rounded-lg text-lg hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2 mx-auto"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 