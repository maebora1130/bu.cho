import React, { useState } from 'react';
import { Search, Book, Bookmark, Info, Plus, X } from 'lucide-react';
import { useAppContext } from '../context';
import { motion, AnimatePresence } from 'motion/react';

const Terminology: React.FC = () => {
  const { dictionary, addTerm } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form state
  const [newTerm, setNewTerm] = useState({
    term: '',
    definition: '',
    category: 'General',
    synonyms: ''
  });

  const filteredTerms = dictionary.filter(t => 
    t.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTerm.term || !newTerm.definition) return;

    addTerm({
      ...newTerm,
      synonyms: newTerm.synonyms.split(',').map(s => s.trim()).filter(s => s !== '')
    });

    setNewTerm({ term: '', definition: '', category: 'General', synonyms: '' });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-3xl font-medium text-ink tracking-tight">방산 용어 사전</h2>
        <p className="text-body text-sm mt-1">방산 및 항공 생산 현장에서 사용되는 전문 용어와 약어를 검색합니다.</p>
      </header>

      <div className="max-w-2xl mx-auto mb-12 flex gap-4">
        <div className="relative flex-1">
          <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-body-mid" />
          <input 
            type="text" 
            placeholder="궁금한 용어를 검색해 보세요..." 
            className="w-full pl-14 pr-6 py-5 bg-white border border-ink/10 rounded-md text-lg focus:outline-none focus:ring-8 focus:ring-primary/5 focus:border-primary transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-6 bg-ink text-white rounded-md flex items-center gap-2 hover:bg-ink-soft transition-all shadow-sm"
        >
          <Plus size={20} />
          <span className="font-bold whitespace-nowrap">용어 추가</span>
        </button>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-md border border-ink/5 shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-ink/5 flex justify-between items-center">
                <h3 className="text-xl font-bold text-ink">새 용어 추가</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-body-mid hover:text-ink">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-body-mid uppercase tracking-widest block mb-2">용어 (Term)</label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-canvas-soft border border-ink/10 rounded-md py-3 px-4 focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none"
                    value={newTerm.term}
                    onChange={e => setNewTerm({...newTerm, term: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-body-mid uppercase tracking-widest block mb-2">카테고리 (Category)</label>
                  <select 
                    className="w-full bg-canvas-soft border border-ink/10 rounded-md py-3 px-4 focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none"
                    value={newTerm.category}
                    onChange={e => setNewTerm({...newTerm, category: e.target.value})}
                  >
                    <option value="General">일반</option>
                    <option value="Production">생산</option>
                    <option value="Military">군사/방산</option>
                    <option value="Technical">기술</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-body-mid uppercase tracking-widest block mb-2">정의 (Definition)</label>
                  <textarea 
                    required
                    rows={3}
                    className="w-full bg-canvas-soft border border-ink/10 rounded-md py-3 px-4 focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none resize-none"
                    value={newTerm.definition}
                    onChange={e => setNewTerm({...newTerm, definition: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-body-mid uppercase tracking-widest block mb-2">동의어 (Synonyms, 콤마로 구분)</label>
                  <input 
                    type="text" 
                    placeholder="예: BOM, 자재명세서"
                    className="w-full bg-canvas-soft border border-ink/10 rounded-md py-3 px-4 focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none"
                    value={newTerm.synonyms}
                    onChange={e => setNewTerm({...newTerm, synonyms: e.target.value})}
                  />
                </div>
                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-3 border border-ink/10 text-body-mid font-bold rounded-md hover:bg-canvas-soft transition-all"
                  >
                    취소
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-6 py-3 bg-primary text-white font-bold rounded-md hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
                  >
                    저장하기
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTerms.map((item, i) => (
          <div key={i} className="bg-canvas-soft p-8 rounded-md border border-ink/5 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-6">
              <div className="p-2.5 bg-ink text-white rounded-md group-hover:bg-primary transition-colors">
                <Book size={20} />
              </div>
              <span className="text-[10px] font-bold text-body-mid uppercase tracking-widest">{item.category}</span>
            </div>
            <h3 className="text-xl font-bold text-ink mb-3 tracking-tight">{item.term}</h3>
            <p className="text-sm text-body leading-relaxed mb-6">{item.definition}</p>
            {item.synonyms.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-5 border-t border-ink/5">
                <Bookmark size={14} className="text-mute" />
                {item.synonyms.map((s, si) => (
                  <span key={si} className="text-[11px] font-bold text-body-mid bg-white px-2 py-0.5 rounded border border-ink/5">
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}

        {filteredTerms.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-mute">
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
