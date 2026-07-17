export interface ProductionOrder {
  id: string;
  itemName: string;
  targetQuantity: number;
  completedQuantity: number;
  startDate: string;
  dueDate: string;
  status: 'Normal' | 'Delayed' | 'Critical' | 'Completed';
  process: 'Machining' | 'HeatTreatment' | 'Assembly' | 'Inspection' | 'Painting';
  issue?: string;
  delayReason?: string;
}

export interface StockItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  requiredStock: number;
  unit: string;
  location: string;
}

export interface Terminology {
  term: string;
  definition: string;
  category: string;
  synonyms: string[];
}

export interface LogEntry {
  id: string;
  timestamp: string;
  operator: string;
  process: string;
  content: string;
  orderId: string;
}
