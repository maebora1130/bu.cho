import React, { useState } from 'react';
import { Plus, Camera, FileText, Search, User } from 'lucide-react';
import { mockLogs } from '../data/mockData';

const DigitalLogbook: React.FC = () => {
  const [logs] = useState(mockLogs);

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-medium text-ink tracking-tight">디지털 로그북</h2>
          <p className="text-body text-sm mt-1">현장 작업 일지 및 검사 성적서를 디지털로 기록하고 관리합니다.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-canvas border border-ink text-ink rounded-md text-sm font-semibold hover:bg-canvas-soft transition-all">
            <Camera size={18} />
            <span>OCR 스캔</span>
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary/90 shadow-sm transition-all">
            <Plus size={18} />
            <span>새 로그 작성</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-canvas-soft p-6 rounded-md border border-ink/5 shadow-sm">
            <h3 className="text-[10px] font-bold text-body-mid uppercase tracking-widest mb-6 flex items-center gap-2">
              <Search size={14} />
              <span>로그 필터</span>
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-body-mid uppercase tracking-widest block mb-2">Process</label>
                <select className="w-full bg-white border border-ink/10 rounded-md text-sm py-2.5 px-3 focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none">
                  <option>전체 공정</option>
                  <option>Machining</option>
                  <option>Assembly</option>
                  <option>Inspection</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-body-mid uppercase tracking-widest block mb-2">Operator</label>
                <input type="text" placeholder="작업자 이름..." className="w-full bg-white border border-ink/10 rounded-md text-sm py-2.5 px-3 focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none" />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4">
          {logs.map((log) => (
            <div key={log.id} className="bg-canvas-soft p-8 rounded-md border border-ink/5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-ink text-white rounded-full flex items-center justify-center">
                    <User size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-ink">{log.operator}</p>
                    <p className="text-[10px] text-body-mid font-bold uppercase tracking-wider">{log.timestamp} • {log.process}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-primary bg-primary/5 px-2.5 py-1 rounded-md border border-primary/10">
                  <FileText size={14} />
                  <span>{log.orderId}</span>
                </div>
              </div>
              <div className="bg-white p-5 rounded-md border border-ink/5">
                <p className="text-sm text-ink-soft leading-relaxed">
                  {log.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DigitalLogbook;
