import React, { useEffect } from 'react';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-4 py-3 rounded-sm border shadow-lg min-w-[300px] animate-in slide-in-from-right ${
      type === 'success' 
        ? 'bg-[#1e2a1e] border-green-800 text-green-300' 
        : 'bg-[#2a1e1e] border-red-800 text-red-300'
    }`}>
      {type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
      <p className="text-xs font-medium flex-1">{message}</p>
      <button onClick={onClose} className="hover:text-white transition-colors">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}