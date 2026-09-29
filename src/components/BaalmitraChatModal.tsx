import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Volume2,
  Trash2,
  BookOpen,
  Compass,
  Smile,
  RefreshCw,
  MessageSquare
} from 'lucide-react';
import { Language } from '../types';
import { speakText, stopSpeech, playPopSound } from '../utils/soundEffects';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface BaalmitraChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  soundEnabled: boolean;
}

const DEFAULT_SUGGESTIONS_HI = [
  '🌟 कच्छ के सफेद रण के बारे में बताओ',
  '📖 अकबर और बीरबल की एक मजेदार कहानी सुनाओ',
  '🏰 ताजमहल का इतिहास क्या है?',
  '🦁 पंचतंत्र की कोई नैतिक कहानी सुनाओ',
  '🪐 हमारे सौरमंडल में कितने ग्रह हैं?',
  '🇮🇳 भारत के कुल कितने राज्य और केंद्र शासित प्रदेश हैं?'
];

const DEFAULT_SUGGESTIONS_EN = [
  '🌟 Tell me about Great Rann of Kutch',
  '📖 Tell me a funny Akbar-Birbal story',
  '🏰 What is the history of Taj Mahal?',
  '🦁 Tell me a Panchatantra moral story',
  '🪐 How many planets are in our Solar System?',
  '🇮🇳 How many states and UTs are in India?'
];

export const BaalmitraChatModal: React.FC<BaalmitraChatModalProps> = ({
  isOpen,
  onClose,
  language,
  soundEnabled,
}) => {
  const isHi = language === 'hi';
  const [messages, setMessages] = useState<Message[]>(() => {
    const initialGreeting = isHi
      ? 'नमस्ते नन्हे दोस्त! 🙏 मैं हूँ आपका AI बालमित्र। आप मुझसे भारत के राज्यों, ऐतिहासिक स्थलों, पंचतंत्र की कहानियों, या विज्ञान के किसी भी विषय पर पूछ सकते हैं। आप आज क्या जानना चाहते हैं? 🌟'
      : 'Hello young friend! 🙏 I am your AI Baalmitra. You can ask me about Indian states, moral stories, Akbar-Birbal tales, or science facts. What would you like to explore today? 🌟';
    return [
      {
        id: 'welcome-1',
        role: 'assistant',
        content: initialGreeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const [inputQuery, setInputQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    } else {
      stopSpeech();
      setSpeakingMessageId(null);
    }
  }, [isOpen]);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputQuery).trim();
    if (!textToSend || isLoading) return;

    if (soundEnabled) playPopSound();

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputQuery('');
    setIsLoading(true);

    try {
      // Send conversation history to server proxy endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          language,
        }),
      });

      const data = await response.json();
      const replyContent =
        data.reply ||
        (isHi
          ? 'माफ कीजिए नन्हे दोस्त, मुझे आपका उत्तर ढूंढने में समय लगा। कृपया दोबारा पूछें! 🌟'
          : 'Sorry little friend, please ask again! 🌟');

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMessage: Message = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: isHi
          ? 'माफ कीजिए, बालमित्र से संपर्क करने में समस्या आई। कृपया थोड़ी देर बाद प्रयास करें! 🌟'
          : 'Sorry, could not connect to Baalmitra. Please try again! 🌟',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeakMessage = (msg: Message) => {
    if (speakingMessageId === msg.id) {
      stopSpeech();
      setSpeakingMessageId(null);
      return;
    }

    if (soundEnabled) playPopSound();
    stopSpeech();
    setSpeakingMessageId(msg.id);

    speakText(
      msg.content,
      isHi ? 'hi' : 'en',
      0.85,
      () => setSpeakingMessageId(msg.id),
      () => setSpeakingMessageId(null),
      () => setSpeakingMessageId(null)
    );
  };

  const handleClearChat = () => {
    if (soundEnabled) playPopSound();
    stopSpeech();
    setSpeakingMessageId(null);
    const initialGreeting = isHi
      ? 'नमस्ते नन्हे दोस्त! 🙏 चैट रीसेट हो गई है। आप मुझसे कोई भी नई कहानी या सवाल पूछ सकते हैं! 🌟'
      : 'Hello friend! 🙏 Chat has been reset. What new story or question would you like to explore? 🌟';
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: initialGreeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const suggestions = isHi ? DEFAULT_SUGGESTIONS_HI : DEFAULT_SUGGESTIONS_EN;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn font-sans">
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        onClick={() => {
          if (soundEnabled) playPopSound();
          stopSpeech();
          onClose();
        }}
      />

      {/* Main Chat Modal Card */}
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl border-3 border-slate-900 shadow-2xl overflow-hidden flex flex-col h-[90vh] max-h-[720px] z-10 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. TOP HEADER */}
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white p-3.5 sm:p-4 border-b-2 border-slate-900 flex items-center justify-between gap-2 shrink-0 shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white/20 backdrop-blur-md text-amber-300 flex items-center justify-center text-2xl shadow-inner border border-white/30 shrink-0 font-bold">
              🤖
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-black text-sm sm:text-lg tracking-tight text-white flex items-center gap-1.5 truncate">
                  <span>{isHi ? 'AI बालमित्र' : 'AI Baalmitra'}</span>
                  <span className="text-amber-200 text-xs font-bold hidden sm:inline">
                    ({isHi ? 'ज्ञान साथी' : 'Kids Smart Guide'})
                  </span>
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] sm:text-[10px] font-black uppercase tracking-wider animate-pulse">
                  Online
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-blue-100 font-medium truncate mt-0.5">
                {isHi
                  ? 'कहानियाँ, सामान्य ज्ञान, और नैतिक शिक्षा का मजेदार साथी'
                  : 'Your joyful buddy for stories, GK & learning'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Clear Chat Button */}
            <button
              onClick={handleClearChat}
              className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-all border border-white/20"
              title={isHi ? 'चैट साफ़ करें' : 'Clear Chat'}
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {/* Close Button */}
            <button
              onClick={() => {
                if (soundEnabled) playPopSound();
                stopSpeech();
                onClose();
              }}
              className="w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-all border border-white/20 active:scale-95"
              title={isHi ? 'बंद करें (Esc)' : 'Close (Esc)'}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. CHAT THREAD (SCROLLABLE) */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3.5 bg-gradient-to-b from-slate-50 via-white to-purple-50/20 scrollbar-thin scrollbar-thumb-slate-300">
          {messages.map((msg) => {
            const isBot = msg.role === 'assistant';
            const isSpeakingThis = speakingMessageId === msg.id;

            return (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 ${isBot ? 'justify-start' : 'justify-end'}`}
              >
                {/* Bot Avatar */}
                {isBot && (
                  <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center text-base shadow-xs shrink-0 mt-0.5">
                    🤖
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3 sm:p-3.5 shadow-2xs border-2 ${
                    isBot
                      ? 'bg-white border-slate-200 text-slate-800 rounded-tl-sm'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 border-blue-700 text-white rounded-tr-sm'
                  }`}
                >
                  <p className="text-xs sm:text-sm font-medium whitespace-pre-wrap leading-relaxed">
                    {(() => {
                      const parts = msg.content.split(/(\*\*.*?\*\*)/g);
                      return parts.map((part, i) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                          return (
                            <strong key={i} className={isBot ? "font-black text-slate-950" : "font-black text-white"}>
                              {part.slice(2, -2)}
                            </strong>
                          );
                        }
                        return <React.Fragment key={i}>{part}</React.Fragment>;
                      });
                    })()}
                  </p>

                  <div
                    className={`flex items-center justify-between gap-2 mt-2 pt-1 border-t text-[10px] ${
                      isBot ? 'border-slate-100 text-slate-400' : 'border-blue-400/40 text-blue-100'
                    }`}
                  >
                    <span>{msg.timestamp}</span>

                    {/* Audio Voice button for Bot Messages */}
                    {isBot && (
                      <button
                        onClick={() => handleSpeakMessage(msg)}
                        className={`p-1 rounded-md transition-all flex items-center gap-1 ${
                          isSpeakingThis
                            ? 'bg-rose-500 text-white font-bold'
                            : 'hover:bg-slate-100 text-blue-600'
                        }`}
                        title={isHi ? 'बोलकर सुनो' : 'Listen with Audio'}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold">
                          {isSpeakingThis ? (isHi ? 'रोकें' : 'Stop') : isHi ? 'सुनें 🔊' : 'Listen 🔊'}
                        </span>
                      </button>
                    )}
                  </div>
                </div>

                {/* User Avatar */}
                {!isBot && (
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center text-sm shadow-xs shrink-0 mt-0.5 font-bold">
                    👦
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold p-2 bg-purple-50 rounded-2xl w-fit border border-purple-200 animate-pulse">
              <span className="text-base">🤖</span>
              <span>{isHi ? 'बालमित्र सोच रहा है...' : 'Baalmitra is thinking...'}</span>
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 3. QUICK SUGGESTION CHIPS */}
        <div className="px-3 py-2 bg-slate-50 border-t border-slate-200 overflow-x-auto scrollbar-none flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] font-black text-slate-400 uppercase shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            {isHi ? 'सुझाव:' : 'Ideas:'}
          </span>
          {suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(suggestion.replace(/^[^\w\s\u0900-\u097F]+/, '').trim())}
              disabled={isLoading}
              className="px-2.5 py-1 rounded-xl bg-white hover:bg-purple-50 border border-slate-200 hover:border-purple-300 text-slate-700 text-[11px] font-bold whitespace-nowrap transition-all shrink-0 active:scale-95 shadow-2xs"
            >
              {suggestion}
            </button>
          ))}
        </div>

        {/* 4. INPUT BAR */}
        <div className="p-3 sm:p-4 bg-white border-t-2 border-slate-900 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={
                isHi
                  ? 'बालमित्र से कोई भी सवाल पूछें या कहानी कहें...'
                  : 'Ask Baalmitra any question or story...'
              }
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-50 border-2 border-slate-200 focus:border-purple-500 focus:bg-white focus:outline-none text-xs sm:text-sm text-slate-900 font-semibold placeholder:text-slate-400 transition-all"
            />

            <button
              type="submit"
              disabled={!inputQuery.trim() || isLoading}
              className={`p-2.5 sm:px-4 sm:py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-xs shrink-0 ${
                inputQuery.trim() && !isLoading
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-2 border-purple-700 active:scale-95'
                  : 'bg-slate-100 text-slate-400 border-2 border-slate-200 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">{isHi ? 'भेजें' : 'Send'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
