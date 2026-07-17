import React from 'react';
import { Search, AlertTriangle, ArrowRight } from 'lucide-react';
import { mockOrders } from '../data/mockData';
import { cn } from '../lib/utils';

const OrderTracker: React.FC = () => {
  return (
    <div className="space-y-6">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">공정 가시성 추적</h2>
          <p className="text-slate-500 text-sm mt-1">각 생산 오더별 상세 진행 상태 및 지연 사유를 확인합니다.</p>
        </div>
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="오더 번호 또는 품명 검색..." 
            className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-64"
          />
        </div>
      </header>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">오더 번호</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">품명</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">현재 공정</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">진척도</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">상태</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">납기일</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {mockOrders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50/30 transition-colors group">
                <td className="px-6 py-4 font-mono text-sm text-slate-600 font-medium">{order.id}</td>
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-slate-900">{order.itemName}</p>
                  {order.issue && (
                    <div className="flex items-center gap-1.5 mt-1 text-[11px] text-red-500 font-medium">
                      <AlertTriangle size={12} />
                      <span>{order.issue}</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-medium px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">
                    {order.process}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="w-full max-w-[120px]">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[10px] font-bold text-slate-500">
                        {order.completedQuantity} / {order.targetQuantity}
                      </span>
                      <span className="text-[10px] font-bold text-slate-900">
                        {Math.round((order.completedQuantity / order.targetQuantity) * 100)}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          order.status === 'Critical' ? 'bg-red-500' : 
                          order.status === 'Delayed' ? 'bg-amber-500' : 'bg-blue-500'
                        )}
                        style={{ width: `${(order.completedQuantity / order.targetQuantity) * 100}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "text-[11px] font-bold px-2 py-1 rounded-lg uppercase tracking-tight",
                    order.status === 'Completed' ? 'bg-green-50 text-green-600' :
                    order.status === 'Critical' ? 'bg-red-50 text-red-600' :
                    order.status === 'Delayed' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                  )}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500 font-medium">{order.dueDate}</td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                    <ArrowRight size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderTracker;
