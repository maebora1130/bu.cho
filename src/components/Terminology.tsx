import React, { useState } from 'react';
import { Search, Book, Bookmark, Info } from 'lucide-react';
import { mockDictionary } from '../data/mockData';

const Terminology: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredTerms = mockDictionary.filter(t => 
    t.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">방산 용어 사전</h2>
        <p className="text-slate-500 text-sm mt-1">방산 및 항공 생산 현장에서 사용되는 전문 용어와 약어를 검색합니다.</p>
      </header>

      <div className="max-w-2xl mx-auto mb-10">
        <div className="relative">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="궁금한 용어를 검색해 보세요... (예: BOM, 재공품, MIL-SPEC)" 
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-[2rem] text-lg focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTerms.map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Book size={18} />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.category}</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{item.term}</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">{item.definition}</p>
            {item.synonyms.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-50">
                <Bookmark size={14} className="text-slate-300" />
                {item.synonyms.map((s, si) => (
                  <span key={si} className="text-[11px] font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md">
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}

        {filteredTerms.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-400">
            <Info size={48} className="mb-4 opacity-20" />
            <p className="text-lg font-medium">검색 결과가 없습니다.</p>
            <p className="text-sm mt-1">다른 키워드로 검색해 보세요.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Terminology;
