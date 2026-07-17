import React, { useState } from 'react';
import { Plus, Camera, FileText, Search, User } from 'lucide-react';
import { mockLogs } from '../data/mockData';

const DigitalLogbook: React.FC = () => {
  const [logs] = useState(mockLogs);

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">디지털 로그북</h2>
          <p className="text-slate-500 text-sm mt-1">현장 작업 일지 및 검사 성적서를 디지털로 기록하고 관리합니다.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all">
            <Camera size={18} />
            <span>OCR 스캔</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-2xl text-sm font-bold text-white hover:bg-blue-700 shadow-sm transition-all">
            <Plus size={18} />
            <span>새 로그 작성</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Search size={16} />
              <span>로그 필터</span>
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Process</label>
                <select className="w-full bg-slate-50 border-none rounded-xl text-xs py-2 px-3 focus:ring-2 focus:ring-blue-500/20">
                  <option>전체 공정</option>
                  <option>Machining</option>
                  <option>Assembly</option>
                  <option>Inspection</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Operator</label>
                <input type="text" placeholder="작업자 이름..." className="w-full bg-slate-50 border-none rounded-xl text-xs py-2 px-3 focus:ring-2 focus:ring-blue-500/20" />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4">
          {logs.map((log) => (
            <div key={log.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{log.operator}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{log.timestamp} • {log.process}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg font-mono">
                  <FileText size={14} />
                  <span>{log.orderId}</span>
                </div>
              </div>
              <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                <p className="text-sm text-slate-700 leading-relaxed">
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
