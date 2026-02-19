import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare, Send, X, Bot, User,
  Sparkles, AlertCircle, ArrowRight, Loader2,
  RefreshCcw, Info
} from 'lucide-react';
import { chatGenome } from '../services/api';
import { AnalysisResult } from '../types';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface GenomeChatProps {
  analysisResults: AnalysisResult[];
}

export const GenomeChat: React.FC<GenomeChatProps> = ({ analysisResults }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your PharmaGuard AI assistant. I've analyzed your genomic results. You can ask me follow-up questions about your medication risks or what these findings mean for you.",
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedFollowUps, setSuggestedFollowUps] = useState<string[]>([
    "Why is my risk level high?",
    "What should I tell my doctor?",
    "Are there safer alternatives?"
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const data = await chatGenome(text, analysisResults);

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMsg]);
      if (data.suggested_follow_ups?.length > 0) {
        setSuggestedFollowUps(data.suggested_follow_ups);
      }
    } catch (error) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble connecting to my knowledge base right now. Please try again in a moment.",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end pointer-events-none">
      {/* Chat Window */}
      {isOpen && (
        <div className="w-[calc(100vw-2rem)] sm:w-[380px] h-[65vh] sm:h-[550px] max-h-[80vh] bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/20 flex flex-col overflow-hidden animate-slide-up mb-4 pointer-events-auto">
          {/* Header */}
          <div className="bg-slate-900 p-4 sm:p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-teal-500 p-2 rounded-xl shadow-lg shadow-teal-500/20">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-black text-sm tracking-tight leading-none">PharmaGuard AI</h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse"></div>
                  <span className="text-[9px] text-teal-400 font-bold uppercase tracking-widest">Clinical Assistant</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-grow overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3.5 sm:p-4 rounded-2xl text-[13px] font-medium leading-relaxed shadow-sm ${msg.sender === 'user'
                  ? 'bg-slate-900 text-white rounded-br-none'
                  : 'bg-white border border-slate-100 text-slate-700 rounded-bl-none'
                  }`}>
                  {msg.text}
                  <div className={`text-[8px] mt-2 font-bold opacity-40 uppercase tracking-widest ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-3">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer */}
          <div className="p-4 bg-white border-t border-slate-100 space-y-3">
            {/* Suggestions */}
            {!isLoading && suggestedFollowUps.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {suggestedFollowUps.map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(suggestion)}
                    className="text-[10px] font-black text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-100 px-3 py-2 rounded-xl transition-all text-left uppercase tracking-tight active:scale-95"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {/* Input Area */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="relative"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your results..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-4 pr-12 text-sm font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all shadow-inner"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-1.5 top-1.5 p-2 bg-slate-900 text-white rounded-lg disabled:opacity-30 transition-all hover:bg-teal-600 shadow-xl shadow-slate-900/10 active:scale-90"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="flex items-center gap-2 px-1">
              <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
              <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">
                Clinical Decision Support Assistant
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`bg-slate-900 text-white p-3.5 sm:p-4 rounded-2xl shadow-2xl shadow-slate-900/30 transform transition-all hover:scale-105 active:scale-90 group flex items-center gap-3 pointer-events-auto border border-white/10 ${isOpen ? 'bg-teal-600 rotate-0' : ''}`}
      >
        {!isOpen && (
          <div className="overflow-hidden w-0 group-hover:w-28 transition-all duration-500 text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap">
            Genome AI
          </div>
        )}
        {isOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />}
      </button>
    </div>
  );
};
