
import React from 'react';
import { ICONS } from '../constants';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onConfirm, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 transition-opacity" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg shadow-2xl shadow-cyan-500/20 border border-gray-700 w-full max-w-md m-4 p-6 transform transition-all" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-cyan-400 font-mono">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <span className="w-6 h-6 block">{ICONS.close}</span>
          </button>
        </div>
        <div className="text-gray-300 mb-6">
          {children}
        </div>
        <div className="flex justify-end space-x-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition">
            Cancelar
          </button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 transition">
            Confirmar Exclusão
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
