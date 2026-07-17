import React, { useState, useRef } from 'react';
import { Search, AlertTriangle, ArrowRight, Upload, FileSpreadsheet, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import * as XLSX from 'xlsx';
import { ProductionOrder } from '../types';
import { useAppContext } from '../context';

const OrderTracker: React.FC = () => {
  const { orders, addOrders } = useAppContext();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const bstr = event.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws) as any[];

        // Map excel data to ProductionOrder type
        const newOrders: ProductionOrder[] = data.map((row, index) => ({
          id: row['오더번호'] || row['ID'] || `NEW-${Date.now()}-${index}`,
          itemName: row['품명'] || row['Item Name'] || 'Unknown Item',
          targetQuantity: Number(row['목표수량'] || row['Target']) || 0,
          completedQuantity: Number(row['실적수량'] || row['Completed']) || 0,
          startDate: row['시작일'] || row['Start Date'] || new Date().toISOString().split('T')[0],
          dueDate: row['납기일'] || row['Due Date'] || new Date().toISOString().split('T')[0],
          status: (row['상태'] || row['Status'] || 'Normal') as any,
          process: (row['현재공정'] || row['Process'] || 'Machining') as any,
          issue: row['이슈'] || row['Issue'],
          delayReason: row['지연사유'] || row['Delay Reason']
        }));

        addOrders(newOrders);
        alert(`${newOrders.length}개의 오더가 성공적으로 업로드되었습니다.`);
      } catch (error) {
        console.error('Excel parsing error:', error);
        alert('엑셀 파일 파싱 중 오류가 발생했습니다. 서식을 확인해주세요.');
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsBinaryString(file);
  };

  const downloadTemplate = () => {
    const templateData = [
      {
        '오더번호': 'PO-EXAMPLE-001',
        '품명': '예시 부품 A',
        '목표수량': 100,
        '실적수량': 50,
        '시작일': '2026-07-01',
        '납기일': '2026-08-01',
        '상태': 'Normal',
        '현재공정': 'Assembly',
        '이슈': '',
        '지연사유': ''
      }
    ];
    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "Ops_Insight_Order_Template.xlsx");
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-medium text-ink tracking-tight">공정 가시성 추적</h2>
          <p className="text-body text-sm mt-1">각 생산 오더별 상세 진행 상태 및 지연 사유를 확인합니다.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={downloadTemplate}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-ink/10 text-body-mid rounded-md text-xs font-bold hover:bg-canvas-soft transition-all"
          >
            <FileSpreadsheet size={16} />
            <span>양식 다운로드</span>
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary/90 shadow-sm transition-all disabled:opacity-50"
          >
            {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
            <span>엑셀 업로드</span>
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept=".xlsx, .xls" 
            className="hidden" 
          />
          <div className="relative ml-2">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-body-mid" />
            <input 
              type="text" 
              placeholder="오더 번호 검색..." 
              className="pl-10 pr-4 py-2 bg-white border border-ink/10 rounded-md text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all w-48 lg:w-64"
            />
          </div>
        </div>
      </header>

      <div className="bg-canvas-soft rounded-md border border-ink/5 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-ink/5 border-b border-ink/5">
              <th className="px-6 py-4 text-[10px] font-bold text-body-mid uppercase tracking-widest">오더 번호</th>
              <th className="px-6 py-4 text-[10px] font-bold text-body-mid uppercase tracking-widest">품명</th>
              <th className="px-6 py-4 text-[10px] font-bold text-body-mid uppercase tracking-widest">현재 공정</th>
              <th className="px-6 py-4 text-[10px] font-bold text-body-mid uppercase tracking-widest">진척도</th>
              <th className="px-6 py-4 text-[10px] font-bold text-body-mid uppercase tracking-widest">상태</th>
              <th className="px-6 py-4 text-[10px] font-bold text-body-mid uppercase tracking-widest">납기일</th>
              <th className="px-6 py-4 text-[10px] font-bold text-body-mid uppercase tracking-widest"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/5">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-canvas/50 transition-colors group">
                <td className="px-6 py-4 font-medium text-sm text-ink-mid">{order.id}</td>
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-ink">{order.itemName}</p>
                  {order.issue && (
                    <div className="flex items-center gap-1.5 mt-1 text-[11px] text-primary font-bold">
                      <AlertTriangle size={12} />
                      <span>{order.issue}</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-ink text-white rounded-md uppercase">
                    {order.process}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="w-full max-w-[120px]">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[10px] font-bold text-body-mid uppercase tracking-wider">
                        {order.completedQuantity} / {order.targetQuantity}
                      </span>
                      <span className="text-[10px] font-bold text-ink">
                        {Math.round((order.completedQuantity / order.targetQuantity) * 100)}%
                      </span>
                    </div>
                    <div className="h-1 w-full bg-ink/10 rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          order.status === 'Critical' ? 'bg-primary' : 
                          order.status === 'Delayed' ? 'bg-primary/60' : 'bg-ink'
                        )}
                        style={{ 
                          width: `${(order.completedQuantity / order.targetQuantity) * 100}%`,
                          opacity: 0.2 + ((order.completedQuantity / order.targetQuantity) * 0.8)
                        }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-widest",
                    order.status === 'Completed' ? 'bg-body-mid/10 text-body-mid' :
                    order.status === 'Critical' ? 'bg-primary text-white shadow-sm shadow-primary/20' :
                    order.status === 'Delayed' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-ink/5 text-ink'
                  )}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-body-mid font-medium">{order.dueDate}</td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 text-mute hover:text-primary transition-colors">
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
