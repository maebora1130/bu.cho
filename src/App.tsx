import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import OrderTracker from './components/OrderTracker';
import DigitalLogbook from './components/DigitalLogbook';
import Terminology from './components/Terminology';
import AIChatBot from './components/AIChatBot';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'tracker':
        return <OrderTracker />;
      case 'logbook':
        return <DigitalLogbook />;
      case 'dictionary':
        return <Terminology />;
      case 'aichat':
        return <AIChatBot />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans selection:bg-blue-100 selection:text-blue-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 h-screen overflow-y-auto overflow-x-hidden p-8">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
