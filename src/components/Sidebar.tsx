import React from 'react';
import { LayoutDashboard, ClipboardList, BookOpen, MessageSquare, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: '통합 대시보드', icon: LayoutDashboard },
    { id: 'tracker', label: '공정 가시성 추적', icon: ClipboardList },
    { id: 'logbook', label: '디지털 로그북', icon: BookOpen },
    { id: 'dictionary', label: '방산 용어 사전', icon: AlertCircle },
    { id: 'aichat', label: 'AI 어시스턴트', icon: MessageSquare },
  ];

  return (
    <div className="w-64 h-screen bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">O</div>
        <h1 className="text-xl font-bold text-white tracking-tight">Ops-Insight</h1>
      </div>
      
      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                activeTab === item.id 
                  ? "bg-blue-600/10 text-blue-400 border border-blue-600/20 shadow-[0_0_15px_rgba(37,99,235,0.1)]" 
                  : "hover:bg-slate-800 hover:text-white"
              )}
            >
              <Icon size={20} className={cn(
                "transition-colors",
                activeTab === item.id ? "text-blue-400" : "text-slate-400 group-hover:text-white"
              )} />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="p-4 mt-auto">
        <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
          <p className="text-xs text-slate-500 mb-1">Signed in as</p>
          <p className="text-sm font-semibold text-slate-200">김한화 (신입사원)</p>
          <p className="text-[10px] text-blue-500 font-mono mt-1 uppercase tracking-wider">Production Support</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
