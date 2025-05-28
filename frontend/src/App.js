import React, { useState, useEffect } from 'react';
import Login from './Componentes/Login';
import AlunoForm from './Componentes/AlunoForms';
import ListaAlunos from './Componentes/ListaAlunos';

export default function App() {
  const [pagina, setPagina] = useState('login'); 
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (!token) setPagina('login');
  }, [token]);

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      {pagina === 'login' && <Login onLogin={(token) => { setToken(token); setPagina('lista'); }} onIrCadastro={() => setPagina('cadastro')} />}
      {pagina === 'cadastro' && <AlunoForm onVoltarLogin={() => setPagina('login')} />}
      {pagina === 'lista' && <ListaAlunos token={token} onLogout={() => setToken(null)} />}
    </div>
  );
}


