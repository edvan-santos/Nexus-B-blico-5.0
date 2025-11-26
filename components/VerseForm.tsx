
import React, { useState, useEffect } from 'react';
import { Verse } from '../types';
import { ICONS } from '../constants';
import { fetchVerseText } from '../services/geminiService';

interface VerseFormProps {
  onAddVerse: (verse: Omit<Verse, 'id'>) => void;
  onUpdateVerse: (verse: Verse) => void;
  editingVerse: Verse | null;
  clearEditing: () => void;
  allThemes: string[];
}

const VerseForm: React.FC<VerseFormProps> = ({ onAddVerse, onUpdateVerse, editingVerse, clearEditing, allThemes }) => {
  const [referencia, setReferencia] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tema, setTema] = useState('');
  const [isFetchingVerse, setIsFetchingVerse] = useState(false);
  const [error, setError] = useState('');

  const isEditing = !!editingVerse;

  const resetForm = () => {
    setReferencia('');
    setDescricao('');
    setTema('');
    setError('');
  };

  useEffect(() => {
    if (editingVerse) {
      setReferencia(editingVerse.referencia);
      setDescricao(editingVerse.descricao);
      setTema(editingVerse.tema);
      setError('');
    } else {
      resetForm();
    }
  }, [editingVerse]);
  
  const handleFetchVerse = async () => {
    if (!referencia) {
      setError('Por favor, insira uma referência bíblica para buscar com a IA.');
      return;
    }
    setError('');
    setIsFetchingVerse(true);
    try {
      const verseText = await fetchVerseText(referencia);
      setDescricao(verseText);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('Ocorreu um erro desconhecido ao buscar o versículo.');
      }
    } finally {
      setIsFetchingVerse(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!referencia || !descricao || !tema) {
      setError('Todos os campos (Referência, Descrição e Tema) são obrigatórios.');
      return;
    }

    const verseData = { referencia, descricao, tema };
    if (isEditing && editingVerse) {
      onUpdateVerse({ ...verseData, id: editingVerse.id });
    } else {
      onAddVerse(verseData);
      resetForm();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 shadow-lg mb-8">
      <h2 className="text-2xl font-bold text-cyan-400 mb-4 font-mono">{isEditing ? '// MODO DE EDIÇÃO' : '// CADASTRAR NOVO VERSÍCULO'}</h2>
      
      {error && <p className="text-red-400 bg-red-900/50 p-2 rounded-md mb-4 text-sm">{error}</p>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="referencia" className="block text-sm font-medium text-gray-300 mb-1">
            Referência <span className="text-gray-500 font-normal ml-1">(Ex: João 3:16)</span>
          </label>
          <div className="flex">
            <input
              type="text"
              id="referencia"
              value={referencia}
              onChange={(e) => setReferencia(e.target.value)}
              placeholder="Digite a referência..."
              className="w-full bg-gray-900 border border-gray-600 rounded-l-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition placeholder-gray-500 text-white"
            />
            <button
              type="button"
              onClick={handleFetchVerse}
              disabled={isFetchingVerse || !referencia}
              title="Buscar texto do versículo com IA"
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-r-md flex items-center justify-center gap-2 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors flex-shrink-0 min-w-[140px]"
            >
              {isFetchingVerse ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-sm">BUSCANDO...</span>
                </>
              ) : (
                <>
                  <span className="w-5 h-5 block">{ICONS.ai}</span>
                  <span className="text-sm font-bold uppercase tracking-wider">BUSCAR TEXTO</span>
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-cyan-400/90 mt-2 flex items-start gap-1">
            <span className="mt-0.5 font-bold">💡 DICA:</span>
            <span>Após digitar a referência, clique no botão <strong>BUSCAR TEXTO</strong> para que a IA preencha a descrição automaticamente.</span>
          </p>
        </div>
        <div>
          <label htmlFor="tema" className="block text-sm font-medium text-gray-300 mb-1">Tema</label>
          <input
            type="text"
            id="tema"
            value={tema}
            onChange={(e) => setTema(e.target.value)}
            placeholder="Ex: Amor, Fé, Esperança"
            className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition placeholder-gray-500 text-white"
            list="themes-datalist"
          />
          <datalist id="themes-datalist">
            {allThemes.map(t => <option key={t} value={t} />)}
          </datalist>
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="descricao" className="block text-sm font-medium text-gray-300 mb-1">
          Descrição <span className="text-cyan-400 text-xs ml-1">(Gerada automaticamente ou manual)</span>
        </label>
        <textarea
          id="descricao"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          rows={4}
          placeholder="O texto do versículo aparecerá aqui automaticamente..."
          className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition placeholder-gray-500 text-white"
        />
      </div>
      <div className="flex justify-end space-x-4">
        {isEditing && (
          <button type="button" onClick={clearEditing} className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition">
            Cancelar Edição
          </button>
        )}
        <button type="submit" className="px-6 py-2 bg-cyan-600 text-white font-bold rounded-md hover:bg-cyan-500 transition flex items-center gap-2">
          {isEditing ? 'Salvar Alterações' : 'Adicionar Versículo'}
          {!isEditing && <span className="w-5 h-5 block">{ICONS.add}</span>}
        </button>
      </div>
    </form>
  );
};

export default VerseForm;
