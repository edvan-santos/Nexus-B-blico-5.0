import React, { useState, useMemo, useEffect } from 'react';
import { Verse, Notification, NotificationType } from './types';
import { INITIAL_VERSES, ICONS } from './constants';
import Header from './components/Header';
import VerseForm from './components/VerseForm';
import VerseList from './components/VerseList';
import Modal from './components/Modal';
import Toast from './components/Toast';

const App: React.FC = () => {
  const [verses, setVerses] = useState<Verse[]>(INITIAL_VERSES);
  const [editingVerse, setEditingVerse] = useState<Verse | null>(null);
  const [deletingVerseId, setDeletingVerseId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState<Notification | null>(null);
  const [showAllThemes, setShowAllThemes] = useState(false);
  
  const addNotification = (message: string, type: NotificationType) => {
    const newNotification: Notification = { id: Date.now(), message, type };
    setNotification(newNotification);
  };
  
  const handleCloseNotification = (id: number) => {
    if (notification && notification.id === id) {
      setNotification(null);
    }
  };

  const handleAddVerse = (verse: Omit<Verse, 'id'>) => {
    const maxId = verses.reduce((max, v) => (v.id > max ? v.id : max), 0);
    const newVerse = { ...verse, id: maxId + 1 };
    setVerses(prev => [newVerse, ...prev]);
    addNotification(`CADASTRO realizado com SUCESSO! 🎉\n\n📖 ID: ${newVerse.id}\n📜 Referência: ${newVerse.referencia}\n🏷️ Tema: ${newVerse.tema}`, NotificationType.SUCCESS);
  };

  const handleUpdateVerse = (updatedVerse: Verse) => {
    setVerses(prev => prev.map(v => (v.id === updatedVerse.id ? updatedVerse : v)));
    addNotification(`✅ Versículo ID ${updatedVerse.id} ALTERADO com sucesso.`, NotificationType.INFO);
    setEditingVerse(null);
  };

  const handleSelectVerseForEdit = (verse: Verse) => {
    setEditingVerse(verse);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleClearEditing = () => {
    setEditingVerse(null);
  };

  const handleDeleteRequest = (id: number) => {
    setDeletingVerseId(id);
  };

  const handleConfirmDelete = () => {
    if (deletingVerseId !== null) {
      setVerses(prev => prev.filter(v => v.id !== deletingVerseId));
      addNotification(`🚨 Versículo ID ${deletingVerseId} EXCLUÍDO com sucesso.`, NotificationType.ERROR);
      setDeletingVerseId(null);
    }
  };

  const uniqueThemes = useMemo(() => {
    const themes = new Set(verses.map(v => v.tema.trim()).filter(Boolean) as string[]);
    return Array.from(themes).sort((a, b) => a.localeCompare(b));
  }, [verses]);
  
  const handleThemeTagClick = (theme: string) => {
    setSearchTerm(theme);
  };

  const filteredVerses = useMemo(() => {
    if (!searchTerm) return verses;
    return verses.filter(verse => 
      verse.referencia.toLowerCase().includes(searchTerm.toLowerCase()) ||
      verse.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      verse.tema.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [verses, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-900 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-6">
        <VerseForm 
          onAddVerse={handleAddVerse}
          onUpdateVerse={handleUpdateVerse}
          editingVerse={editingVerse}
          clearEditing={handleClearEditing}
          allThemes={uniqueThemes}
        />

        <div className="my-8 border-t border-gray-700"></div>
        
        <div className="relative mb-6">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                {ICONS.search}
            </span>
            <input
              type="text"
              placeholder="Consultar por referência, descrição ou tema..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-md pl-10 pr-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition placeholder-gray-500"
            />
        </div>

        <div className="mb-6">
          <button 
            onClick={() => setShowAllThemes(prev => !prev)}
            className="w-full flex items-center justify-center gap-2 bg-gray-700/50 text-cyan-300 border border-gray-600 px-4 py-2 rounded-md hover:bg-gray-700 transition-all duration-300"
            aria-expanded={showAllThemes}
          >
            Consultar Temas Cadastrados
            <span className={`transform transition-transform duration-200 ${showAllThemes ? 'rotate-180' : ''}`}>▼</span>
          </button>
          {showAllThemes && (
            <div className="mt-4 p-4 bg-gray-800/50 border border-gray-700 rounded-lg flex flex-wrap gap-2 animate-fade-in">
              {uniqueThemes.length > 0 ? uniqueThemes.map(theme => (
                <button 
                  key={theme} 
                  onClick={() => handleThemeTagClick(theme)}
                  className="bg-gray-700 text-cyan-300 text-sm font-semibold px-3 py-1 rounded-full hover:bg-cyan-500 hover:text-gray-900 transition-colors"
                >
                  {theme}
                </button>
              )) : <p className="text-gray-500">// Nenhum tema cadastrado ainda.</p>}
            </div>
          )}
        </div>

        <VerseList 
          verses={filteredVerses}
          onEdit={handleSelectVerseForEdit}
          onDelete={handleDeleteRequest}
        />
      </main>
      
      <Modal
        isOpen={deletingVerseId !== null}
        onClose={() => setDeletingVerseId(null)}
        onConfirm={handleConfirmDelete}
        title="// CONFIRMAR EXCLUSÃO"
      >
        <p>Você tem certeza que deseja excluir permanentemente o versículo com ID: {deletingVerseId}?</p>
        <p className="mt-2 text-sm text-red-400">Esta ação não pode ser desfeita.</p>
      </Modal>

      <Toast notification={notification} onClose={handleCloseNotification} />
    </div>
  );
};

export default App;