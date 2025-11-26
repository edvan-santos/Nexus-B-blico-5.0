
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="border-b-2 border-cyan-500/30 p-4 text-center bg-gray-900/50 backdrop-blur-sm sticky top-0 z-20">
      <h1 className="text-3xl md:text-4xl font-bold text-cyan-400 tracking-widest uppercase font-mono">
        Nexus Bíblico 5.0
      </h1>
      <p className="text-sm text-gray-400 mt-1 font-sans">
        Protocolo de Interface Futurista para Gerenciamento de Conhecimento Sagrado
      </p>
    </header>
  );
};

export default Header;
