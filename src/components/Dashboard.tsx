import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { AlertTriangle, CheckCircle, Clock, Package } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAppContext } from '../context';

const Dashboard: React.FC = () => {
  const { orders } = useAppContext();
  
  const statusCounts = [
    { name: 'Delayed', value: orders.filter(o => o.status === 'Delayed' || o.status === 'Critical').length, color: '#ff4f00' },
    { name: 'Normal', value: orders.filter(o => o.status === 'Normal').length, color: '#201515' },
    { name: 'Completed', value: orders.filter(o => o.status === 'Completed').length, color: '#939084' },
  ];

  const processProgress = orders.map(o => ({
    name: o.id.split('-').pop(),
    progress: Math.round((o.completedQuantity / o.targetQuantity) * 100),
  }));

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-3xl font-medium text-ink tracking-tight">생산 현황 대시보드</h2>
        <p className="text-body text-sm mt-1">오늘의 주요 생산 지표 및 위험 오더 현황입니다.</p>
        
        {statusCounts[0].value > 0 && (
          <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-md flex items-center gap-3 animate-pulse">
            <AlertTriangle className="text-primary" size={20} />
            <p className="text-sm text-ink">
              현재 <span className="text-primary font-bold text-lg">{statusCounts[0].value}</span>건의 작업이 <span className="text-primary font-bold">지연 위험</span> 상태입니다. 즉각적인 조치가 필요합니다.
            </p>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: '전체 오더', value: orders.length, icon: Package, color: 'ink' },
          { label: '지연 위험', value: statusCounts[0].value, icon: AlertTriangle, color: 'primary' },
          { label: '진행 중', value: orders.filter(o => o.status !== 'Completed').length, icon: Clock, color: 'ink-mid' },
          { label: '완료 건수', value: statusCounts[2].value, icon: CheckCircle, color: 'body-mid' },
        ].map((stat, i) => (
          <div key={i} className="bg-canvas-soft p-6 rounded-md border border-ink/5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-bold text-body-mid uppercase tracking-widest">{stat.label}</p>
                <p className="text-3xl font-medium text-ink mt-2">{stat.value}</p>
              </div>
              <div className={cn(
                "p-2 rounded-md",
                stat.color === 'primary' ? 'bg-primary/10 text-primary' : 'bg-ink/5 text-ink'
              )}>
                <stat.icon size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-canvas-soft p-8 rounded-md border border-ink/5 shadow-sm">
          <h3 className="text-lg font-medium text-ink mb-8">주요 오더 진행률 (%)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={processProgress}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#939084' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#939084' }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(32, 21, 21, 0.02)' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(32 21 21 / 0.1)', backgroundColor: '#fffefb' }}
                />
                <Bar dataKey="progress" radius={[4, 4, 0, 0]} barSize={32}>
                  {processProgress.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill="#ff4f00" 
                      fillOpacity={0.2 + (entry.progress / 100) * 0.8} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-canvas-soft p-8 rounded-md border border-ink/5 shadow-sm">
          <h3 className="text-lg font-medium text-ink mb-8">오더 상태 분포</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusCounts}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusCounts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {statusCounts.map((s, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-body">{s.name}</span>
                </div>
                <span className="font-bold text-ink">{s.value}건</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
