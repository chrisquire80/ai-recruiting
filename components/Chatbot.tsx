
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, Sparkles } from 'lucide-react';
import { ChatMessage } from '../types';
import { chatWithAI } from '../services/geminiService';
import { useCandidateContext } from '../context/CandidateContext';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'assistant', text: 'Hi! I am your HR Assistant. How can I help you today?', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { currentCandidate } = useCandidateContext();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const responseText = await chatWithAI(input, currentCandidate);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: responseText,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
       // Silent fail
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-pink-200 ${isOpen ? 'bg-slate-800 rotate-90' : 'bg-gradient-to-tr from-pink-500 to-orange-500'}`}
        aria-label="Toggle Chat Assistant"
      >
        {isOpen ? <X className="text-white" /> : <MessageSquare className="text-white" />}
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-24 right-6 z-50 w-80 md:w-96 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-75 opacity-0 pointer-events-none'}`}
      >
        <div className="bg-gradient-to-r from-pink-500 to-orange-500 p-4 flex items-center gap-3">
           <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Sparkles className="text-white" size={16} />
           </div>
           <div>
              <h3 className="font-bold text-white text-sm">Scabbio Assistant</h3>
              <p className="text-[10px] text-pink-100 flex items-center gap-1">
                 <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span> Online
              </p>
           </div>
        </div>

        <div className="h-80 overflow-y-auto p-4 bg-slate-50 space-y-3" ref={scrollRef}>
           {messages.map(msg => (
             <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                    ? 'bg-slate-800 text-white rounded-tr-none' 
                    : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-tl-none'
                  }`}
                >
                   {msg.text}
                </div>
             </div>
           ))}
           {isTyping && (
             <div className="flex justify-start">
               <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-100">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                  </div>
               </div>
             </div>
           )}
        </div>

        <div className="p-3 bg-white border-t border-slate-100 flex gap-2">
           <input 
             type="text" 
             value={input}
             onChange={e => setInput(e.target.value)}
             onKeyDown={handleKeyDown}
             placeholder="Ask about your application..."
             className="flex-1 bg-slate-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
           />
           <button 
             onClick={handleSend}
             disabled={!input.trim()}
             className="p-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 disabled:opacity-50 transition-colors"
           >
              <Send size={18} />
           </button>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
