import React, { useState, useRef, useEffect } from 'react';
import LandingPage from './LandingPage';
import { Sparkles, ArrowLeft, Mic, Upload, FileText, Image, Loader, History, Download, Trash2 } from 'lucide-react';

const SENTIMENT_CONFIG = {
  POS: {
    label: 'Positive',
    emoji: '😊',
    mainColor: 'text-green-400',
    bgGlow: 'from-green-500/10 to-green-400/5',
    border: 'border-green-500/30',
    progress: 'bg-green-400',
    shadow: '#4ade8077'
  },
  NEG: {
    label: 'Negative',
    emoji: '😢',
    mainColor: 'text-red-400',
    bgGlow: 'from-red-500/10 to-red-400/5',
    border: 'border-red-500/30',
    progress: 'bg-red-400',
    shadow: '#ef444477'
  },
  NEU: {
    label: 'Neutral',
    emoji: '😐',
    mainColor: 'text-gray-400',
    bgGlow: 'from-gray-500/10 to-gray-400/5',
    border: 'border-gray-500/30',
    progress: 'bg-gray-400',
    shadow: '#94a3b877'
  }
};

const HISTORY_KEY = 'sentiment_history';

// Helper function to get sentiment config
const getSentimentConfig = (label) => {
  return SENTIMENT_CONFIG[label] || SENTIMENT_CONFIG.NEU;
};

function App() {
  const [showApp, setShowApp] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // State for text input
  const [textInput, setTextInput] = useState('');

  // State for file inputs (image or audio)
  const [fileInput, setFileInput] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Additional state for audio recording
  const [recordMode, setRecordMode] = useState('upload'); // "upload" or "record"
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const recordedChunksRef = useRef([]);

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem(HISTORY_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center p-4">
      <Loader className="w-6 h-6 text-purple-400 animate-spin" />
      <span className="ml-2 text-white/80">Processing...</span>
    </div>
  );

  // Add history management functions
  const addToHistory = (result) => {
    const newEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...result
    };
    const updatedHistory = [newEntry, ...history];
    setHistory(updatedHistory);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  };

  const downloadHistory = () => {
    const data = JSON.stringify(history, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sentiment-history.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setResult(null); // clear previous result
    setTextInput('');
    setFileInput(null);
    setPreviewUrl(null);
    setRecordMode('upload');
    setRecording(false);
    recordedChunksRef.current = [];
    setTabIndex(newValue);
  };

  // Add new function to handle back navigation
  const handleBack = () => {
    // Reset all states
    setShowHistory(false);
    setResult(null);
    setTextInput('');
    setFileInput(null);
    setPreviewUrl(null);
    setTabIndex(0);
    setRecordMode('upload');
    setRecording(false);
    // Return to landing page
    setShowApp(false);
  };

  // Helper: call API and update result
  const callApi = async (url, formData) => {
    try {
      setLoading(true);
      setResult(null); // Clear previous results while loading
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setResult(data);
      addToHistory(data); // Add to history when successful
      // Smooth scroll to results
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 100);
    } catch (error) {
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileInput(file);
      // Clean up previous preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      // Create new preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // Clean up preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Submit handlers
  const handleTextSubmit = (e) => {
    e.preventDefault();
    const formData = new URLSearchParams();
    formData.append('text', textInput);
    callApi('http://localhost:8000/submit-text/', formData);
  };

  const handleFileSubmit = (e) => {
    e.preventDefault();
    if (!fileInput) return;
    const formData = new FormData();
    formData.append('file', fileInput);
    const endpoint =
      tabIndex === 1
        ? 'http://localhost:8000/submit-image/'
        : 'http://localhost:8000/submit-audio/';
    callApi(endpoint, formData);
  };

  // Audio recording functions using MediaRecorder and a ref for chunks
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recordedChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      
      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'audio/wav' });
        const recordedFile = new File([blob], 'recording.wav', { type: 'audio/wav' });
        setFileInput(recordedFile);
        const url = URL.createObjectURL(recordedFile);
        setPreviewUrl(url);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
    } catch (err) {
      console.error('Error starting recording:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  // Update HistoryPanel component
  const HistoryPanel = () => (
    <div className="fixed right-0 top-0 h-screen bg-black/90 border-l border-white/10 transform transition-all duration-300" 
         style={{ width: '320px' }}>
      <div className="flex flex-col h-full pt-14"> {/* Add padding-top to account for main header */}
        <div className="flex flex-col p-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-white">History</h3>
          </div>
          <div className="flex gap-2">
            <button
              onClick={downloadHistory}
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/10 rounded-lg transition-colors group flex-1"
              title="Download History"
            >
              <Download className="h-4 w-4 text-gray-400 group-hover:text-white" />
              <span className="text-sm text-gray-400 group-hover:text-white">Download</span>
            </button>
            <button
              onClick={clearHistory}
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/10 rounded-lg transition-colors group flex-1"
              title="Clear History"
            >
              <Trash2 className="h-4 w-4 text-gray-400 group-hover:text-white" />
              <span className="text-sm text-gray-400 group-hover:text-white">Clear all</span>
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {history.length === 0 ? (
            <div className="text-center text-gray-400 mt-8">
              <p>No history yet</p>
            </div>
          ) : (
            history.map((entry) => (
              <div
                key={entry.id}
                onClick={() => setResult(entry)}
                className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer border border-white/5 hover:border-white/20"
              >
                <div className="flex items-center gap-2 mb-2">
                  {getSentimentConfig(entry.label)?.emoji}
                  <span className={`text-sm font-medium ${getSentimentConfig(entry.label)?.mainColor}`}>
                    {getSentimentConfig(entry.label)?.label}
                  </span>
                  <span className="text-xs text-gray-500 ml-auto">
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm text-gray-400 truncate">
                  {entry.text || entry.extracted_text || entry.transcribed_text}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  if (!showApp) {
    return <LandingPage onGetStarted={() => setShowApp(true)} />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="fixed top-0 left-0 right-0 z-10 bg-black/80 backdrop-blur-sm border-b border-white/10">
        <div className="px-4">
          <div className="flex justify-between items-center h-14">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="text-sm">Back</span>
            </button>
            
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-400" />
              <span className="text-base font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Sentiment AI
              </span>
            </div>
            
            <button
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setShowHistory(!showHistory)}
              title="View History"
            >
              <History className="h-5 w-5 text-gray-400 hover:text-white" />
            </button>
          </div>
        </div>
      </nav>

      <div className={`flex transition-all duration-300 ${showHistory ? 'mr-80' : ''}`}>
        {/* Sidebar for history */}
        <div className={`fixed right-0 top-0 h-screen transform transition-transform duration-300 ${
          showHistory ? 'translate-x-0' : 'translate-x-full'
        }`}>
          {showHistory && <HistoryPanel />}
        </div>

        {/* Main content - update top padding */}
        <main className={`flex-1 max-w-4xl mx-auto px-4 transition-all duration-300 pt-20`}>
          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-lg border border-white/10 p-1 bg-white/5 backdrop-blur-sm">
              {[
                { icon: <FileText className="h-5 w-5" />, label: 'Text' },
                { icon: <Image className="h-5 w-5" />, label: 'Image' },
                { icon: <Mic className="h-5 w-5" />, label: 'Audio' },
              ].map((tab, index) => (
                <button
                  key={tab.label}
                  onClick={(e) => handleTabChange(e, index)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                    tabIndex === index
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input Container */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-8">
            {tabIndex === 0 && (
              <form onSubmit={handleTextSubmit} className="space-y-4">
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Enter text to analyze..."
                  className="w-full h-32 bg-black/50 border border-white/10 rounded-lg p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-4 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium transition-all ${
                    loading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
                  }`}
                >
                  {loading ? 'Analyzing...' : 'Analyze Text'}
                </button>
              </form>
            )}

            {tabIndex === 1 && (
              <form onSubmit={handleFileSubmit} className="space-y-4">
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
                  {!fileInput ? (
                    <>
                      <Upload className="h-12 w-12 text-gray-400 mb-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileInput}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors"
                      >
                        Choose Image
                      </label>
                    </>
                  ) : (
                    <div className="w-full">
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="max-h-64 mx-auto rounded-lg object-contain mb-4 border border-white/10"
                      />
                      <p className="text-sm text-gray-400 mb-2">{fileInput.name}</p>
                      <button
                        type="button"
                        onClick={() => {
                          setFileInput(null);
                          setPreviewUrl(null);
                        }}
                        className="text-sm text-gray-400 hover:text-white"
                      >
                        Remove image
                      </button>
                    </div>
                  )}
                </div>
                {fileInput && (
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 px-4 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium transition-all ${
                      loading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
                    }`}
                  >
                    {loading ? 'Processing...' : 'Analyze Image'}
                  </button>
                )}
              </form>
            )}

            {tabIndex === 2 && (
              <div className="space-y-6">
                <div className="flex justify-center gap-4">
                  {['upload', 'record'].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => {
                        setRecordMode(mode);
                        setFileInput(null);
                        setPreviewUrl(null);
                      }}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        recordMode === mode
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                          : 'bg-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      {mode === 'upload' ? 'Upload Audio' : 'Record Audio'}
                    </button>
                  ))}
                </div>

                {recordMode === 'upload' && (
                  <form onSubmit={handleFileSubmit} className="space-y-4">
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
                      {!fileInput ? (
                        <>
                          <Upload className="h-12 w-12 text-gray-400 mb-4" />
                          <input
                            type="file"
                            accept="audio/*"
                            onChange={handleFileInput}
                            className="hidden"
                            id="audio-upload"
                          />
                          <label
                            htmlFor="audio-upload"
                            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors"
                          >
                            Choose Audio File
                          </label>
                        </>
                      ) : (
                        <div className="w-full">
                          <audio 
                            src={previewUrl} 
                            controls 
                            className="w-full mb-4 h-12 rounded-lg bg-white/5"
                          />
                          <div className="w-full h-24 bg-black/30 rounded-lg overflow-hidden mb-4">
                            <div className="w-full h-full bg-gradient-to-b from-purple-500/20 to-transparent animate-pulse" />
                          </div>
                          <p className="text-sm text-gray-400 mb-2">{fileInput.name}</p>
                          <button
                            type="button"
                            onClick={() => {
                              setFileInput(null);
                              setPreviewUrl(null);
                            }}
                            className="text-sm text-gray-400 hover:text-white"
                          >
                            Remove audio
                          </button>
                        </div>
                      )}
                    </div>
                    {fileInput && (
                      <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 px-4 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium transition-all ${
                          loading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
                        }`}
                      >
                        {loading ? 'Processing...' : 'Analyze Audio'}
                      </button>
                    )}
                  </form>
                )}

                {recordMode === 'record' && (
                  <div className="text-center space-y-4">
                    <button
                      onClick={recording ? stopRecording : startRecording}
                      className={`px-8 py-4 rounded-full transition-all ${
                        recording
                          ? 'bg-red-500 hover:bg-red-600'
                          : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Mic className="h-5 w-5" />
                        {recording ? 'Stop Recording' : 'Start Recording'}
                      </div>
                    </button>
                    {fileInput && (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-400">Recorded Successfully</p>
                        <button
                          onClick={handleFileSubmit}
                          disabled={loading}
                          className={`w-full py-3 px-4 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium transition-all ${
                            loading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
                          }`}
                        >
                          {loading ? 'Processing...' : 'Analyze Recording'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Results Display */}
          {loading ? (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <LoadingSpinner />
            </div>
          ) : (result && (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 animate-gentle-float">
              <div className="space-y-6">
                {result.error ? (
                  <div className="flex items-center gap-3 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400">
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p>{result.error}</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 gap-4">
                      {/* Sentiment Score Card */}
                      <div className="col-span-1">
                        <div className={`p-6 rounded-xl bg-gradient-to-br ${
                          getSentimentConfig(result.label)?.bgGlow
                        } border ${
                          getSentimentConfig(result.label)?.border
                        } backdrop-blur-md relative overflow-hidden`}>
                          {/* Large Emoji Display */}
                          <div className="absolute -right-6 -top-6 text-8xl opacity-10 rotate-12">
                            {getSentimentConfig(result.label)?.emoji}
                          </div>
                          
                          <div className="relative flex flex-col items-center space-y-4">
                            <div className="text-4xl mb-4 animate-gentle-float">
                              {getSentimentConfig(result.label)?.emoji}
                            </div>
                            <span className="text-sm font-medium text-gray-400">Sentiment Analysis</span>
                            <div className="flex items-center gap-4">
                              <span className={`text-4xl font-bold ${getSentimentConfig(result.label)?.mainColor}`}>
                                {getSentimentConfig(result.label)?.label}
                              </span>
                              <div className="h-10 w-px bg-white/20"></div>
                              <div className={`text-3xl font-medium ${getSentimentConfig(result.label)?.mainColor}`}>
                                {(result.score * 100).toFixed(1)}%
                              </div>
                            </div>
                            
                            {/* Enhanced Progress bar */}
                            <div className="w-full mt-4">
                              <div className="h-2 rounded-full bg-black/30 overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-1000 ease-out ${
                                    getSentimentConfig(result.label)?.progress
                                  }`}
                                  style={{ 
                                    width: `${result.score * 100}%`,
                                    boxShadow: `0 0 20px ${getSentimentConfig(result.label)?.shadow}`
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Text Results */}
                      <div className="space-y-4">
                        {result.text && (
                          <div className="p-4 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm">
                            <h3 className="text-sm font-medium text-gray-400 mb-2">Original Text</h3>
                            <p className="text-white/90 text-sm leading-relaxed">{result.text}</p>
                          </div>
                        )}
                        {result.extracted_text && (
                          <div className="p-4 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm">
                            <h3 className="text-sm font-medium text-gray-400 mb-2">Extracted Text</h3>
                            <p className="text-white/90 text-sm leading-relaxed">{result.extracted_text}</p>
                          </div>
                        )}
                        {result.transcribed_text && (
                          <div className="p-4 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm">
                            <h3 className="text-sm font-medium text-gray-400 mb-2">Transcribed Text</h3>
                            <p className="text-white/90 text-sm leading-relaxed">{result.transcribed_text}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}

export default App;
