import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, FileText, Sparkles } from 'lucide-react';
import { mockOrders, mockStock } from '../data/mockData';
import { cn } from '../lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AIChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '안녕하세요! 생산관리 어시스턴트입니다. 현재 생산 현황 분석이나 리포트 작성을 도와드릴까요?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: userMsg,
          contextData: { orders: mockOrders, stock: mockStock }
        })
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.answer || data.error }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: '죄송합니다. 오류가 발생했습니다.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateReport = async () => {
    setIsLoading(true);
    setMessages(prev => [...prev, { role: 'user', content: '어제 실적 기반 일일 생산 보고서 생성해줘.' }]);
    
    try {
      const response = await fetch('/api/ai/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ performanceData: { orders: mockOrders } })
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.report || data.error }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: '보고서 생성 중 오류가 발생했습니다.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] max-w-4xl mx-auto">
      <header className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles size={24} className="text-blue-500 fill-blue-500/20" />
            <span>AI 어시스턴트</span>
          </h2>
          <p className="text-slate-500 text-sm mt-1">현장 데이터를 분석하여 의사결정을 돕는 스마트 비서입니다.</p>
        </div>
        <button 
          onClick={generateReport}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all disabled:opacity-50"
        >
          <FileText size={18} />
          <span>일일 보고서 자동 생성</span>
        </button>
      </header>

      <div className="flex-1 bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={cn("flex gap-3 max-w-[85%]", msg.role === 'user' ? "ml-auto flex-row-reverse" : "")}>
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                msg.role === 'assistant' ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600"
              )}>
                {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
              </div>
              <div className={cn(
                "p-4 rounded-2xl text-sm leading-relaxed",
                msg.role === 'assistant' 
                  ? "bg-slate-50 text-slate-800 border border-slate-100" 
                  : "bg-blue-600 text-white shadow-lg shadow-blue-600/10"
              )}>
                <div className="prose prose-sm prose-slate">
                  {msg.content.split('\n').map((line, li) => <p key={li}>{line}</p>)}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center animate-pulse">
                <Bot size={16} />
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-blue-600" />
                <span className="text-xs text-slate-500 font-medium tracking-tight">AI가 데이터를 분석 중입니다...</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-50/50 border-t border-slate-100">
          <div className="relative">
            <input 
              type="text" 
              placeholder="궁금한 사항을 물어보세요... (예: 3일 이상 지연된 오더만 골라줘)" 
              className="w-full pl-6 pr-12 py-4 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={handleSend}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatBot;
