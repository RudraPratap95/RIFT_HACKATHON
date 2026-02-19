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
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="w-[calc(100vw-2rem)] sm:w-[400px] h-[70vh] sm:h-[600px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-slide-up mb-4 glass-card">
          {/* Header */}
          <div className="bg-slate-900 p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-teal-500 p-2 rounded-xl">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-black text-sm tracking-tight">PharmaGuard AI</h3>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse"></div>
                  <span className="text-[10px] text-teal-400 font-bold uppercase tracking-widest">Clinical Assistant</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-grow overflow-y-auto p-5 space-y-4 bg-slate-50/30">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-[13px] font-medium leading-relaxed shadow-sm ${msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none'
                  : 'bg-white border border-slate-100 text-slate-700 rounded-bl-none'
                  }`}>
                  {msg.text}
                  <div className={`text-[9px] mt-2 opacity-60 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-teal-500 animate-spin" />
                  <span className="text-xs text-slate-400 font-bold italic">Synthesizing clinical response...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer */}
          <div className="p-4 bg-white border-t border-slate-100 space-y-4">
            {/* Suggestions */}
            {!isLoading && suggestedFollowUps.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {suggestedFollowUps.map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(suggestion)}
                    className="text-[11px] font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-100 px-3 py-1.5 rounded-full transition-all text-left"
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
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-4 pr-12 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-2 top-1.5 p-2 bg-slate-900 text-white rounded-xl disabled:opacity-30 transition-all hover:bg-teal-600 shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="flex items-start gap-2 px-1">
              <AlertCircle className="w-3 h-3 text-slate-300 shrink-0 mt-0.5" />
              <p className="text-[9px] text-slate-400 font-medium leading-tight">
                AI can make mistakes. Always consult your healthcare provider before changing medications.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`bg-slate-900 text-white p-4 rounded-full shadow-2xl shadow-slate-900/40 transform transition-all hover:scale-110 active:scale-95 group flex items-center gap-3 ${isOpen ? 'bg-teal-600' : ''}`}
      >
        {!isOpen && (
          <div className="overflow-hidden w-0 group-hover:w-32 transition-all duration-300 text-sm font-black uppercase tracking-widest whitespace-nowrap">
            Genome Chat
          </div>
        )}
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>
    </div>
  );
};
