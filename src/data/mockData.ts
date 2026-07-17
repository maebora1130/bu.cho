import { ProductionOrder, StockItem, Terminology, LogEntry } from '../types';

export const mockOrders: ProductionOrder[] = [
  {
    id: 'PO-2026-001',
    itemName: 'K2A1 조종수 해치 조립체',
    targetQuantity: 10,
    completedQuantity: 4,
    startDate: '2026-07-01',
    dueDate: '2026-07-20',
    status: 'Delayed',
    process: 'Assembly',
    issue: '구성품 결합용 볼트 수급 지연',
    delayReason: 'B 부품 열처리 공격 지연'
  },
  {
    id: 'PO-2026-002',
    itemName: 'K9 자주포 포신 가공품',
    targetQuantity: 5,
    completedQuantity: 5,
    startDate: '2026-06-15',
    dueDate: '2026-07-10',
    status: 'Completed',
    process: 'Machining'
  },
  {
    id: 'PO-2026-003',
    itemName: '전차용 변속기 하우징',
    targetQuantity: 8,
    completedQuantity: 2,
    startDate: '2026-07-10',
    dueDate: '2026-07-25',
    status: 'Normal',
    process: 'Machining'
  },
  {
    id: 'PO-2026-004',
    itemName: '주무장 제어 컨트롤러',
    targetQuantity: 20,
    completedQuantity: 2,
    startDate: '2026-07-12',
    dueDate: '2026-07-18',
    status: 'Critical',
    process: 'Inspection',
    issue: '회로 기판 불량률 급증 (15% 초과)',
    delayReason: '품질 검사 장비 보정 필요'
  }
];

export const mockStock: StockItem[] = [
  { id: 'S001', name: '고장력 육각 볼트 (M12)', category: 'Fastener', currentStock: 120, requiredStock: 500, unit: 'EA', location: 'Rack A-04' },
  { id: 'S002', name: '특수강 열연판 (12T)', category: 'Material', currentStock: 45, requiredStock: 30, unit: 'Ton', location: 'Yard B' },
  { id: 'S003', name: '사격통제장치 PCB', category: 'Electronic', currentStock: 8, requiredStock: 50, unit: 'EA', location: 'CleanRoom C' }
];

export const mockDictionary: Terminology[] = [
  { term: 'BOM', definition: 'Bill of Materials. 제품을 생산하는 데 필요한 모든 부품의 목록과 계층 구조.', category: 'Common', synonyms: ['부품구조도'] },
  { term: 'WIP', definition: 'Work In Process. 재공품. 공정 중간 단계에 있는 반제품.', category: 'Production', synonyms: ['재공'] },
  { term: 'MIL-SPEC', definition: 'Military Specification. 군용 규격. 가혹한 환경에서의 성능과 신뢰성을 보장하는 국방 표준.', category: 'Defense', synonyms: ['군규격'] },
  { term: 'LOT', definition: '동일한 공정 조건 하에서 생산된 제품의 단위 집합.', category: 'Production', synonyms: ['배치'] }
];

export const mockLogs: LogEntry[] = [
  { id: 'L001', timestamp: '2026-07-15 09:30', operator: '강작업', process: 'Machining', content: '절삭유 보충 및 툴 교체 완료', orderId: 'PO-2026-003' },
  { id: 'L002', timestamp: '2026-07-15 14:20', operator: '이품질', process: 'Inspection', content: 'PCB 외관 검사 중 크랙 발견. 해당 로트 격리 조치.', orderId: 'PO-2026-004' }
];
