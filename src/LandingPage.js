import React from 'react';
import { ArrowRight, Sparkles, Shield, Zap, MessageSquare, Search, Database, BarChart3 } from 'lucide-react';
import './LandingPage.css';

function LandingPage({ onGetStarted }) {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden">
        {/* Ambient background effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-800/20 to-blue-900/20" />
          <div className="noise-bg"></div>
        </div>
        
        {/* Navigation */}
        <nav className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Sparkles className="h-8 w-8 text-purple-400" />
                <div className="absolute inset-0 animate-pulse bg-purple-500/20 rounded-full blur-xl"></div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Sentiment AI
              </span>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
              <a href="#docs" className="text-gray-300 hover:text-white transition-colors">Documentation</a>
              <a href="#about" className="text-gray-300 hover:text-white transition-colors">About</a>
            </div>
            <div className="flex items-center gap-4">
              <button className="hidden sm:block px-4 py-2 rounded-lg text-gray-300 hover:text-white transition-colors">
                Log in
              </button>
              <button
                className="px-5 py-2.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/10"
                onClick={onGetStarted}
              >
                Try Sentiment AI
              </button>
            </div>
          </div>
        </nav>

        {/* Hero content */}
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 flex flex-col items-center relative z-10">
          <div className="max-w-3xl text-center">
            <div className="glow-badge mb-8 mx-auto">
              <span>New: Sentiment AI 2.0 Released</span>
            </div>
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight bg-gradient-to-br from-white via-purple-300 to-blue-300 bg-clip-text text-transparent pb-4">
              Understand emotions through AI
            </h1>
            <p className="mt-6 text-lg sm:text-xl leading-8 text-gray-300">
              Our advanced sentiment analysis platform uses cutting-edge AI to extract emotions and context from text, images, and audio in real-time.
              <span className="block mt-2 text-purple-400">Helping businesses build better products with emotional intelligence.</span>
            </p>
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
              <button
                className="group relative w-full sm:w-auto px-8 py-4 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 transition-all duration-300 shadow-glow"
                onClick={onGetStarted}
              >
                <span className="flex items-center justify-center gap-2">
                  Get started free
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              <button className="group w-full sm:w-auto mt-4 sm:mt-0 px-8 py-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-all duration-300">
                <span className="flex items-center justify-center gap-2">
                  View demo
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 8L16 12L10 16V8Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </button>
            </div>
          </div>

          {/* Floating stats */}
          <div className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl mx-auto">
            <div className="stats-card">
              <h3 className="text-4xl font-bold text-white">97%</h3>
              <p className="text-gray-400 mt-2">Accuracy rating</p>
            </div>
            <div className="stats-card">
              <h3 className="text-4xl font-bold text-white">10M+</h3>
              <p className="text-gray-400 mt-2">Daily analyses</p>
            </div>
            <div className="stats-card">
              <h3 className="text-4xl font-bold text-white">5K+</h3>
              <p className="text-gray-400 mt-2">Enterprise clients</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trust banner */}
      <div className="relative py-16 bg-gradient-to-r from-black to-gray-900">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-center text-gray-400 mb-8">Trusted by industry leaders</p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8">
            {['Amazon', 'Microsoft', 'Spotify', 'Adobe', 'Twitter', 'Shopify'].map((company) => (
              <div key={company} className="text-gray-500 text-xl font-semibold opacity-70 hover:opacity-100 transition-opacity">
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features section */}
      <div id="features" className="relative mx-auto max-w-7xl px-6 py-32">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent pb-4">
            Powerful sentiment analysis tools
          </h2>
          <p className="mt-4 text-xl text-gray-400 max-w-2xl mx-auto">
            Our platform offers comprehensive tools to analyze emotions across multiple formats
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {/* Feature cards with hover effects */}
          <div className="feature-card group">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 rounded-xl bg-purple-500/20">
                <MessageSquare className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Text Analysis</h3>
            </div>
            <p className="text-gray-400 mb-6">
              Analyze sentiment from any text input with high accuracy. Detect emotions, sarcasm, and intention with our NLP engine.
            </p>
            <ul className="text-gray-500 space-y-2 mb-6">
              <li className="flex items-center gap-2">
                <svg className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Multiple language support
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Context awareness
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Emotion scoring
              </li>
            </ul>
            <a href="#text-analysis" className="text-purple-400 font-medium hover:text-purple-300 transition-colors flex items-center gap-2">
              Learn more
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="feature-card group">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 rounded-xl bg-purple-500/20">
                <Search className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Image Processing</h3>
            </div>
            <p className="text-gray-400 mb-6">
              Extract and analyze sentiment from images using computer vision. Detect facial expressions and environmental context.
            </p>
            <ul className="text-gray-500 space-y-2 mb-6">
              <li className="flex items-center gap-2">
                <svg className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Facial expression detection
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Scene context analysis
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Emotional heatmapping
              </li>
            </ul>
            <a href="#image-processing" className="text-purple-400 font-medium hover:text-purple-300 transition-colors flex items-center gap-2">
              Learn more
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="feature-card group">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 rounded-xl bg-purple-500/20">
                <Zap className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Audio Recognition</h3>
            </div>
            <p className="text-gray-400 mb-6">
              Convert speech to text and analyze sentiment in real-time. Detect tone, stress patterns, and emotional indicators.
            </p>
            <ul className="text-gray-500 space-y-2 mb-6">
              <li className="flex items-center gap-2">
                <svg className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Voice tone analysis
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Real-time transcription
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Emotional change tracking
              </li>
            </ul>
            <a href="#audio-recognition" className="text-purple-400 font-medium hover:text-purple-300 transition-colors flex items-center gap-2">
              Learn more
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Use cases section */}
      <div className="relative bg-gradient-to-b from-black via-gray-900 to-black py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent pb-4">
              Empowering businesses across industries
            </h2>
            <p className="mt-4 text-xl text-gray-400 max-w-2xl mx-auto">
              See how Sentiment AI is transforming how organizations understand their customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Customer Experience',
                icon: <MessageSquare className="h-6 w-6" />,
                description: 'Monitor customer feedback and support interactions to improve satisfaction and loyalty.'
              },
              {
                title: 'Market Research',
                icon: <Search className="h-6 w-6" />,
                description: 'Analyze consumer sentiment about products, brands, and campaigns in real-time.'
              },
              {
                title: 'Content Analysis',
                icon: <BarChart3 className="h-6 w-6" />,
                description: 'Evaluate how your content resonates emotionally with your target audience.'
              },
              {
                title: 'Social Listening',
                icon: <Database className="h-6 w-6" />,
                description: 'Track and respond to social media sentiment about your brand and products.'
              },
              {
                title: 'Healthcare',
                icon: <Shield className="h-6 w-6" />,
                description: 'Monitor patient feedback and emotional states to improve care and outcomes.'
              },
              {
                title: 'Financial Services',
                icon: <Zap className="h-6 w-6" />,
                description: 'Analyze market sentiment and customer reactions to financial products and services.'
              }
            ].map((item, index) => (
              <div key={index} className="use-case-card">
                <div className="icon-wrapper mb-6">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Demo Section */}
      <div className="relative py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent pb-4">
                See Sentiment AI in action
              </h2>
              <p className="mt-6 text-lg text-gray-300">
                Experience how our sentiment analysis platform works with this interactive demo. Try analyzing different types of content to see emotional insights in real-time.
              </p>
              <div className="mt-10 space-y-4">
                <div className="demo-feature">
                  <div className="feature-icon">
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Real-time Results</h4>
                    <p className="text-gray-400">Get immediate feedback on emotional content</p>
                  </div>
                </div>
                <div className="demo-feature">
                  <div className="feature-icon">
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Multi-format Analysis</h4>
                    <p className="text-gray-400">Test text, image, and audio analysis capabilities</p>
                  </div>
                </div>
                <div className="demo-feature">
                  <div className="feature-icon">
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Detailed Reporting</h4>
                    <p className="text-gray-400">View comprehensive emotional breakdowns</p>
                  </div>
                </div>
              </div>
              <button className="mt-10 px-8 py-4 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 transition-all duration-300 shadow-glow">
                Try the demo
              </button>
            </div>
            <div className="demo-container">
              <div className="demo-screen">
                <div className="demo-header">
                  <div className="demo-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <div className="demo-title">Sentiment Analysis</div>
                </div>
                <div className="demo-content">
                  <div className="demo-input">
                    <p className="text-gray-400 mb-2">Enter text to analyze:</p>
                    <div className="demo-textarea">I'm really excited about this new product launch!</div>
                  </div>
                  <div className="demo-results">
                    <div className="result-item">
                      <span className="label">Sentiment:</span>
                      <span className="value positive">Positive (0.92)</span>
                    </div>
                    <div className="result-item">
                      <span className="label">Emotions:</span>
                      <div className="emotions">
                        <span className="emotion" style={{ width: '85%', backgroundColor: '#4ade80' }}>Excitement</span>
                        <span className="emotion" style={{ width: '60%', backgroundColor: '#60a5fa' }}>Anticipation</span>
                        <span className="emotion" style={{ width: '45%', backgroundColor: '#f472b6' }}>Joy</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing section */}
      <div id="pricing" className="relative py-32 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent pb-4">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-xl text-gray-400 max-w-2xl mx-auto">
              Choose the plan that best fits your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Starter',
                price: '$29',
                description: 'Perfect for individuals and small teams',
                features: [
                  '1,000 text analyses per month',
                  '500 image analyses per month',
                  '250 audio analyses per month',
                  'Basic reporting dashboard',
                  'Email support'
                ],
                buttonText: 'Start free trial',
                highlighted: false
              },
              {
                name: 'Professional',
                price: '$99',
                description: 'For growing businesses and agencies',
                features: [
                  '10,000 text analyses per month',
                  '5,000 image analyses per month',
                  '2,500 audio analyses per month',
                  'Advanced reporting & analytics',
                  'API access',
                  'Priority support'
                ],
                buttonText: 'Start free trial',
                highlighted: true
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                description: 'For large organizations with specific needs',
                features: [
                  'Unlimited analyses',
                  'Custom integrations',
                  'Dedicated account manager',
                  'SLA guarantee',
                  'Advanced security features',
                  '24/7 phone & email support'
                ],
                buttonText: 'Contact sales',
                highlighted: false
              }
            ].map((plan, index) => (
              <div key={index} className={`pricing-card ${plan.highlighted ? 'highlighted' : ''}`}>
                <div className="inner">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="flex items-baseline mb-6">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    {plan.price !== 'Custom' && <span className="text-gray-400 ml-2">/month</span>}
                  </div>
                  <p className="text-gray-400 mb-6">{plan.description}</p>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-300">
                        <svg className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full py-3 rounded-lg ${plan.highlighted ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-glow' : 'bg-white/10 text-white border border-white/20'} transition-all duration-300`}>
                    {plan.buttonText}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

   {/* CTA section */}
   <div className="relative">
        <div className="mx-auto max-w-7xl px-6 py-32">
          <div className="cta-container">
            <div className="absolute inset-0 bg-grid-white/[0.02]"></div>
            <div className="cta-content text-center">
              <h2 className="text-4xl font-bold tracking-tight text-white">
                Transform your workflow with AI-powered emotional intelligence
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-300 max-w-3xl mx-auto">
                Join thousands of businesses using Sentiment AI to better understand customers, improve products, and make data-driven decisions.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
                <button
                  className="w-full sm:w-auto px-8 py-4 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 transition-all duration-300 shadow-glow"
                  onClick={onGetStarted}
                >
                  Get started free
                </button>
                <button className="w-full sm:w-auto px-8 py-4 rounded-lg bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all duration-300">
                  Contact sales
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
