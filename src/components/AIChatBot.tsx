import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, FileText, Sparkles } from 'lucide-react';
import { mockStock } from '../data/mockData';
import { cn } from '../lib/utils';
import { useAppContext } from '../context';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AIChatBot: React.FC = () => {
  const { orders } = useAppContext();
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
          contextData: { orders: orders, stock: mockStock }
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
        body: JSON.stringify({ performanceData: { orders: orders } })
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
      <header className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-medium text-ink tracking-tight flex items-center gap-3">
            <Sparkles size={24} className="text-primary fill-primary/10" />
            <span>AI 어시스턴트</span>
          </h2>
          <p className="text-body text-sm mt-1">현장 데이터를 분석하여 의사결정을 돕는 스마트 비서입니다.</p>
        </div>
        <button 
          onClick={generateReport}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-3 bg-ink text-white rounded-md text-sm font-semibold hover:bg-ink-soft transition-all disabled:opacity-50"
        >
          <FileText size={18} />
          <span>일일 보고서 자동 생성</span>
        </button>
      </header>

      <div className="flex-1 bg-canvas-soft rounded-md border border-ink/5 shadow-sm overflow-hidden flex flex-col">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={cn("flex gap-4 max-w-[85%]", msg.role === 'user' ? "ml-auto flex-row-reverse" : "")}>
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                msg.role === 'assistant' ? "bg-primary text-white" : "bg-ink text-white"
              )}>
                {msg.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
              </div>
              <div className={cn(
                "p-5 rounded-md text-sm leading-relaxed",
                msg.role === 'assistant' 
                  ? "bg-white text-ink border border-ink/5 shadow-sm" 
                  : "bg-primary text-white shadow-lg shadow-primary/20"
              )}>
                <div className="prose prose-sm prose-slate prose-p:my-0 prose-headings:mb-2 prose-headings:mt-4">
                  {msg.content.split('\n').map((line, li) => <p key={li}>{line}</p>)}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center animate-pulse">
                <Bot size={20} />
              </div>
              <div className="p-5 rounded-md bg-white border border-ink/5 flex items-center gap-3">
                <Loader2 size={18} className="animate-spin text-primary" />
                <span className="text-xs text-body font-bold tracking-tight uppercase">AI가 데이터를 분석 중입니다...</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-white border-t border-ink/5">
          <div className="relative">
            <input 
              type="text" 
              placeholder="궁금한 사항을 물어보세요..." 
              className="w-full pl-6 pr-14 py-4 bg-canvas-soft border border-ink/10 rounded-md text-sm focus:outline-none focus:ring-8 focus:ring-primary/5 focus:border-primary transition-all shadow-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={handleSend}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-primary text-white rounded-md hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatBot;
