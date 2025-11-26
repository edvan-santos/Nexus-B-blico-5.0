
import React from 'react';
import { Verse } from '../types';
import { ICONS } from '../constants';

interface VerseListProps {
  verses: Verse[];
  onEdit: (verse: Verse) => void;
  onDelete: (id: number) => void;
}

const VerseItem: React.FC<{ verse: Verse; onEdit: (verse: Verse) => void; onDelete: (id: number) => void; }> = ({ verse, onEdit, onDelete }) => {
  return (
    <div className="bg-gray-800/60 border border-gray-700 p-4 rounded-lg shadow-md transition-all duration-300 hover:border-cyan-500/50 hover:shadow-cyan-500/10">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-cyan-400 font-mono">ID: {verse.id}</p>
          <h3 className="text-lg font-bold text-gray-100">{verse.referencia}</h3>
        </div>
        <div className="flex space-x-2">
          <button onClick={() => onEdit(verse)} className="p-2 text-gray-400 hover:text-yellow-400 transition">
            <span className="w-5 h-5 block">{ICONS.edit}</span>
          </button>
          <button onClick={() => onDelete(verse.id)} className="p-2 text-gray-400 hover:text-red-400 transition">
             <span className="w-5 h-5 block">{ICONS.delete}</span>
          </button>
        </div>
      </div>
      <p className="mt-2 text-gray-300">{verse.descricao}</p>
      <div className="mt-4">
        <span className="inline-block bg-gray-700 text-cyan-300 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">
          🏷️ {verse.tema}
        </span>
      </div>
    </div>
  );
};


const VerseList: React.FC<VerseListProps> = ({ verses, onEdit, onDelete }) => {
  if (verses.length === 0) {
    return (
        <div className="text-center py-10 px-4 border-2 border-dashed border-gray-700 rounded-lg">
            <p className="text-gray-500">
                // NENHUM REGISTRO ENCONTRADO
            </p>
            <p className="text-gray-600 mt-1 text-sm">
                Use o formulário acima para cadastrar um novo versículo.
            </p>
        </div>
    );
  }

  return (
    <div className="space-y-4">
      {verses.map(verse => (
        <VerseItem key={verse.id} verse={verse} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default VerseList;
