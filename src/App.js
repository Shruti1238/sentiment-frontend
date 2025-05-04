import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import LandingPage from './LandingPage';
import { Sparkles, ArrowLeft, Mic, Upload, FileText, Image, Loader, History, Download, Trash2, Send } from 'lucide-react';

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

const HISTORY_KEY = 'sentiment_chats';

// Helper to generate chat name
function generateChatName(messages) {
  const firstUserMsg = messages.find(m => m.role === 'user' && m.type === 'text');
  if (firstUserMsg && firstUserMsg.content) {
    return firstUserMsg.content.length > 32
      ? firstUserMsg.content.slice(0, 32) + '...'
      : firstUserMsg.content;
  }
  // fallback for image/audio
  const firstFileMsg = messages.find(m => m.role === 'user' && (m.type === 'image' || m.type === 'audio'));
  if (firstFileMsg && firstFileMsg.file && firstFileMsg.file.name) {
    return firstFileMsg.file.name;
  }
  return 'New Chat';
}

// --- ChatApp component (moved from App) ---
function ChatApp() {
  const navigate = useNavigate();

  // --- Chat state ---
  const [chats, setChats] = React.useState(() => {
    const saved = localStorage.getItem(HISTORY_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [activeChatId, setActiveChatId] = React.useState(() => {
    const saved = localStorage.getItem(HISTORY_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.length > 0 ? parsed[0].id : null;
    }
    return null;
  });

  // Find active chat
  const activeChat = chats.find(c => c.id === activeChatId);

  // If no chat, create one on mount
  React.useEffect(() => {
    if (!activeChatId) {
      handleNewChat();
    }
    // eslint-disable-next-line
  }, []);

  // --- Chat messages state (bound to active chat) ---
  const [messages, setMessages] = React.useState(activeChat ? activeChat.messages : []);
  const [loading, setLoading] = React.useState(false);
  const [showHistory, setShowHistory] = React.useState(true); // <--- initially open
  const [inputValue, setInputValue] = React.useState('');
  const [fileInput, setFileInput] = React.useState(null);
  const [previewUrl, setPreviewUrl] = React.useState(null);
  const [recordMode, setRecordMode] = React.useState(null); // null|'recording'
  const [recording, setRecording] = React.useState(false);
  const [mediaRecorder, setMediaRecorder] = React.useState(null);
  const recordedChunksRef = React.useRef([]);
  const [suggestions, setSuggestions] = React.useState([]);
  const [showSuggestions, setShowSuggestions] = React.useState(false);

  // Keep messages in sync with active chat
  React.useEffect(() => {
    setMessages(activeChat ? activeChat.messages : []);
  // eslint-disable-next-line
  }, [activeChatId]);

  // Save chats to localStorage whenever chats change
  React.useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(chats));
  }, [chats]);

  // Save messages to chats and localStorage whenever messages change
  React.useEffect(() => {
    if (!activeChatId) return;
    setChats(prevChats => {
      const idx = prevChats.findIndex(c => c.id === activeChatId);
      if (idx === -1) return prevChats;
      const updated = [...prevChats];
      // Update chat name if first user message changes
      const newName = generateChatName(messages);
      updated[idx] = {
        ...updated[idx],
        messages,
        name: newName,
      };
      return updated;
    });
    // eslint-disable-next-line
  }, [messages]);

  // --- Suggestion logic unchanged ---
  React.useEffect(() => {
    if (!inputValue) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const filtered = SUGGESTION_LIST.filter(s =>
      s.toLowerCase().includes(inputValue.toLowerCase())
    );
    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
  }, [inputValue]);

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center p-4">
      <Loader className="w-6 h-6 text-purple-400 animate-spin" />
      <span className="ml-2 text-white/80">Processing...</span>
    </div>
  );

  // Add new chat
  function handleNewChat() {
    const newId = Date.now().toString();
    const newChat = {
      id: newId,
      name: 'New Chat',
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      messages: [],
    };
    setChats(prev => [
      // Remove any empty "New Chat" entries before adding a new one
      ...prev.filter(
        c => !(c.name === 'New Chat' && (!c.messages || c.messages.length === 0))
      ),
      newChat
    ]);
    setActiveChatId(newId);
    setMessages([]);
    setInputValue('');
    setFileInput(null);
    setPreviewUrl(null);
    setRecordMode(null);
    setShowSuggestions(false);
  }

  // Delete all chats
  const clearHistory = () => {
    setChats([]);
    setActiveChatId(null);
    setMessages([]);
    localStorage.removeItem(HISTORY_KEY);
    // Immediately create a new chat after clearing all
    setTimeout(() => {
      handleNewChat();
    }, 0);
  };

  // Download all chats
  const downloadHistory = () => {
    const data = JSON.stringify(chats, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sentiment-chats.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Helper: call API and update result & chat
  const callApi = async (url, formData, type, userMsg) => {
    try {
      setLoading(true);
      // Add user message to chat
      setMessages(msgs => [
        ...msgs,
        { role: 'user', content: userMsg, type, file: fileInput ? fileInput : null, previewUrl }
      ]);
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      // Add AI response to chat
      setMessages(msgs => [
        ...msgs,
        { role: 'ai', content: data, type }
      ]);
      setInputValue('');
      setFileInput(null);
      setPreviewUrl(null);
      setRecordMode(null);
      setShowSuggestions(false);
      // Scroll to bottom
      setTimeout(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      setMessages(msgs => [
        ...msgs,
        { role: 'ai', content: { error: error.message }, type }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Chat input handlers
  const handleSend = (e) => {
    e.preventDefault();
    if (loading) return;
    if (fileInput) {
      // Image or audio
      const formData = new FormData();
      formData.append('file', fileInput);
      const isImage = fileInput.type.startsWith('image/');
      const endpoint = isImage
        ? 'http://localhost:8000/submit-image/'
        : 'http://localhost:8000/submit-audio/';
      callApi(endpoint, formData, isImage ? 'image' : 'audio', fileInput.name);
    } else if (inputValue.trim()) {
      // Text
      const formData = new URLSearchParams();
      formData.append('text', inputValue);
      callApi('http://localhost:8000/submit-text/', formData, 'text', inputValue);
    }
  };

  // File/image/audio input
  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Always revoke previous preview URL if exists
      if (previewUrl) {
        try {
          URL.revokeObjectURL(previewUrl);
        } catch {}
      }
      setFileInput(file);
      setPreviewUrl(URL.createObjectURL(file));
      setInputValue('');
      setShowSuggestions(false);
    }
  };

  // Audio recording
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
        setPreviewUrl(URL.createObjectURL(recordedFile));
        setRecordMode(null);
      };
      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
      setRecordMode('recording');
    } catch (err) {
      setRecording(false);
      setRecordMode(null);
    }
  };
  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  // Clean up preview URL
  React.useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // Chat scroll ref
  const chatBottomRef = React.useRef(null);

  // --- HistoryPanel updated for ChatGPT-style sidebar ---
  const HistoryPanel = () => (
    <div
      className="fixed left-0 top-0 h-screen bg-[#202123] border-r border-white/10 shadow-lg z-30 flex flex-col transition-all duration-300"
      style={{ width: '260px' }}
    >
      <div className="flex flex-col h-full pt-4">
        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-2">
          <span className="text-lg font-bold text-white">Chats</span>
          <div className="flex items-center gap-1">
            <button
              onClick={handleNewChat}
              className="flex items-center gap-1 px-3 py-1 bg-[#343541] hover:bg-[#444654] text-white rounded-md text-sm font-semibold transition"
              title="New Chat"
            >
              <span className="text-xl leading-none">+</span>
            </button>
            {/* Close sidebar button */}
            <button
              onClick={() => setShowHistory(false)}
              className="ml-2 p-2 rounded-md hover:bg-white/10 transition"
              title="Hide Sidebar"
            >
              <svg className="h-5 w-5 text-gray-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>
        </div>
        {/* Chat list */}
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
          {chats.length === 0 ? (
            <div className="text-center text-gray-400 mt-8">
              <p>No chats yet</p>
            </div>
          ) : (
            chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => {
                  setActiveChatId(chat.id);
                }}
                className={`flex items-center px-3 py-2 rounded-md cursor-pointer transition-colors ${
                  chat.id === activeChatId
                    ? 'bg-[#343541] border border-[#565869]'
                    : 'hover:bg-[#2a2b32]'
                }`}
              >
                <span className="truncate text-white font-medium">{chat.name || 'New Chat'}</span>
                <span className="ml-auto text-xs text-gray-400 pl-2">
                  {new Date(chat.updated || chat.created).toLocaleTimeString()}
                </span>
              </div>
            ))
          )}
        </div>
        {/* Footer actions */}
        <div className="flex flex-col gap-2 p-4 border-t border-white/10">
          <button
            onClick={downloadHistory}
            className="flex items-center gap-2 px-3 py-2 bg-[#343541] hover:bg-[#444654] text-gray-300 rounded-md text-sm transition"
            title="Download Chats"
          >
            <Download className="h-4 w-4" />
            Download
          </button>
          <button
            onClick={clearHistory}
            className="flex items-center gap-2 px-3 py-2 bg-[#343541] hover:bg-[#444654] text-gray-300 rounded-md text-sm transition"
            title="Clear All"
          >
            <Trash2 className="h-4 w-4" />
            Clear all
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-10 bg-black/80 backdrop-blur-sm border-b border-white/10">
        <div className="px-4">
          <div className="flex justify-between items-center h-14 relative">
            {/* Centered header, always matches chat area center */}
            <div
              className="absolute"
              style={{
                left: showHistory
                  ? 'calc(50vw - 384px + 130px + 384px)' // chat area center when sidebar open
                  : '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: 'max-content',
                pointerEvents: 'none',
              }}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-400" />
                <span className="text-base font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Sentiment AI
                </span>
              </div>
            </div>
            {/* Go Home button on the right */}
            <button
              style={{ marginRight: showHistory ? '12px' : '0' }}
              onClick={() => {
                setShowHistory(false);
                setActiveChatId(null);
                setMessages([]);
                setInputValue('');
                setFileInput(null);
                setPreviewUrl(null);
                setRecordMode(null);
                setShowSuggestions(false);
                navigate('/');
              }}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors absolute right-0 top-1/2 -translate-y-1/2"
            >
            
              <span className="text-sm">Go Home</span>
              <ArrowLeft className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main chat area */}
      <div
        className="flex-1 flex flex-row transition-all duration-300 pt-14"
        style={{
          backgroundColor: '#000',
          minHeight: 0,
          height: 'calc(100vh - 56px)',
          overflow: 'hidden',
        }}
      >
        {/* Sidebar for history (left, fixed style) */}
        <div
          className={`fixed left-0 top-0 h-screen z-30 transition-transform duration-300 ${
            showHistory ? 'translate-x-0' : '-translate-x-full'
          }`}
          style={{ width: '260px' }}
        >
          <HistoryPanel />
        </div>
        {/* Show sidebar open button when hidden */}
        {!showHistory && (
          <button
            className="fixed left-2 top-20 z-40 bg-[#202123] border border-white/10 shadow-lg rounded-full p-2 hover:bg-[#343541] transition"
            style={{ width: '40px', height: '40px' }}
            onClick={() => setShowHistory(true)}
            title="Show Chats"
          >
            <svg className="h-6 w-6 text-gray-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
        {/* Chat area */}
        <main
          className="flex-1 flex flex-col w-full relative transition-all duration-300"
          style={{
            backgroundColor: '#000',
            minHeight: 0,
            height: '100%',
            overflow: 'hidden',
            maxWidth: '768px',
            marginLeft: showHistory ? 'calc(50vw - 384px + 130px)' : 'auto',
            marginRight: showHistory ? 'auto' : 'auto',
            transition: 'margin-left 0.3s, max-width 0.3s',
          }}
        >
          {/* Chat messages */}
          <div
            className="flex-1 overflow-y-auto px-2 py-6 space-y-4"
            style={{
              // Remove paddingBottom, let input area push content up
              backgroundColor: '#000',
              minHeight: 0,
              height: '100%',
            }}
          >
            {(!messages || messages.length === 0) && (
              <div className="flex flex-col items-center justify-center h-full opacity-60 pt-16">
                <Sparkles className="h-10 w-10 text-purple-400 mb-2" />
                <h2 className="text-xl font-semibold mb-2">Welcome to Sentiment AI</h2>
                <p className="text-gray-400 text-center max-w-md">
                  Ask anything about sentiment, upload an image or audio, or just type your text below!
                </p>
              </div>
            )}
            {messages && messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-xl px-4 py-3 mb-2 ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white self-end'
                    : 'bg-white/5 border border-white/10 text-white self-start'
                }`}>
                  {/* User message */}
                  {msg.role === 'user' && msg.type === 'text' && (
                    <span className="whitespace-pre-line">{msg.content}</span>
                  )}
                  {msg.role === 'user' && msg.type === 'image' && msg.file && (
                    <div>
                      <img src={msg.previewUrl} alt="preview" className="max-h-48 rounded-lg mb-2" />
                      <div className="text-xs text-gray-300">{msg.file.name}</div>
                    </div>
                  )}
                  {msg.role === 'user' && msg.type === 'audio' && msg.file && (
                    <div>
                      <audio src={msg.previewUrl} controls className="w-full mb-2" />
                      <div className="text-xs text-gray-300">{msg.file.name}</div>
                    </div>
                  )}
                  {/* AI response */}
                  {msg.role === 'ai' && (
                    <AIMessageContent content={msg.content} />
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-2">
                  <Loader className="w-5 h-5 text-purple-400 animate-spin" />
                  <span className="text-white/80">Processing...</span>
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* ChatGPT-style input box */}
          <form
            onSubmit={handleSend}
            // Remove 'fixed' and use 'w-full' and 'bg-gradient-to-t ...'
            className="w-full bg-gradient-to-t from-black/90 via-black/80 to-transparent px-2 py-4"
            style={{ zIndex: 20 }}
          >
            <div className="max-w-2xl mx-auto flex items-end gap-2">
              {/* Image upload */}
              <label className="cursor-pointer p-2 rounded-lg hover:bg-white/10 transition-colors">
                <Image className="h-5 w-5 text-gray-400" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileInput}
                  disabled={loading}
                />
              </label>
              {/* Audio upload */}
              <label className="cursor-pointer p-2 rounded-lg hover:bg-white/10 transition-colors">
                <Upload className="h-5 w-5 text-gray-400" />
                <input
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={handleFileInput}
                  disabled={loading}
                />
              </label>
              {/* Mic record */}
              <button
                type="button"
                className={`p-2 rounded-lg transition-colors ${
                  recordMode === 'recording'
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'hover:bg-white/10'
                }`}
                onClick={() => {
                  if (recordMode === 'recording') {
                    stopRecording();
                  } else {
                    startRecording();
                  }
                }}
                disabled={loading}
                title={recordMode === 'recording' ? 'Stop Recording' : 'Record Audio'}
              >
                <Mic className={`h-5 w-5 ${recordMode === 'recording' ? 'text-white' : 'text-gray-400'}`} />
              </button>
              {/* Input box */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  className="w-full py-3 px-4 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 pr-12"
                  placeholder={
                    fileInput
                      ? fileInput.type.startsWith('image/')
                        ? 'Ready to send image...'
                        : 'Ready to send audio...'
                      : recording
                        ? 'Recording...'
                        : 'Type your message...'
                  }
                  value={inputValue}
                  onChange={e => {
                    setInputValue(e.target.value);
                    setFileInput(null);
                    setPreviewUrl(null);
                  }}
                  disabled={loading || !!fileInput || recording}
                  onFocus={() => setShowSuggestions(true)}
                  autoComplete="off"
                />
                {/* Suggestions dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 mt-1 bg-black border border-white/10 rounded-lg shadow-lg z-30">
                    {suggestions.map((s, i) => (
                      <div
                        key={i}
                        className="px-4 py-2 hover:bg-white/10 cursor-pointer text-sm text-gray-300"
                        onClick={() => {
                          setInputValue(s);
                          setShowSuggestions(false);
                        }}
                      >
                        {s}
                      </div>
                    ))}
                  </div>
                )}
                {/* File preview (image/audio) */}
                {fileInput && (
                  <div className="absolute left-0 bottom-full mb-2 w-full flex flex-col items-start">
                    {fileInput.type.startsWith('image/') && (
                      <img src={previewUrl} alt="preview" className="max-h-24 rounded-lg border border-white/10 mb-1" />
                    )}
                    {fileInput.type.startsWith('audio/') && (
                      <audio src={previewUrl} controls className="w-full mb-1" />
                    )}
                    <button
                      type="button"
                      className="text-xs text-gray-400 hover:text-white"
                      onClick={() => {
                        setFileInput(null);
                        setPreviewUrl(null);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
              <button
                type="submit"
                className={`ml-2 p-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold transition-all ${
                  loading || (!inputValue.trim() && !fileInput) ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
                }`}
                disabled={loading || (!inputValue.trim() && !fileInput)}
                title="Send"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

// AIMessageContent unchanged...
function AIMessageContent({ content }) {
  if (!content || typeof content !== 'object') return null;
  if (content.error) {
    return (
      <div className="flex items-center gap-2 text-red-400">
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
        <span>{content.error}</span>
      </div>
    );
  }
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{getSentimentConfig(content.label)?.emoji}</span>
        <span className={`font-bold ${getSentimentConfig(content.label)?.mainColor}`}>
          {getSentimentConfig(content.label)?.label}
        </span>
        <span className="ml-2 text-sm text-gray-400">
          {(content.score * 100).toFixed(1)}%
        </span>
      </div>
      {content.text && (
        <div className="text-sm text-gray-300 mb-1">
          <span className="font-medium">Text:</span> {content.text}
        </div>
      )}
      {content.extracted_text && (
        <div className="text-sm text-gray-300 mb-1">
          <span className="font-medium">Extracted:</span> {content.extracted_text}
        </div>
      )}
      {content.transcribed_text && (
        <div className="text-sm text-gray-300 mb-1">
          <span className="font-medium">Transcribed:</span> {content.transcribed_text}
        </div>
      )}
    </div>
  );
}

// Helper function to get sentiment config
function getSentimentConfig(label) {
  return SENTIMENT_CONFIG[label] || SENTIMENT_CONFIG.NEU;
}

// Example suggestions (could be dynamic)
const SUGGESTION_LIST = [
  "How is the sentiment of this text?",
  "Analyze this image for sentiment.",
  "What is the mood of this audio?",
  "Is this positive or negative?",
  "Summarize the sentiment."
];

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <LandingPage
              onGetStarted={() => {
                window.location.href = '/chat';
              }}
            />
          }
        />
        <Route path="/chat" element={<ChatApp />} />
      </Routes>
    </Router>
  );
}

export default App;
