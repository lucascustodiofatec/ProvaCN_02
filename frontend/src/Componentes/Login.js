import React, { useState } from 'react';

export default function Login({ onLogin, onIrCadastro }) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');

    if (!usuario.trim() || !senha.trim()) {
      setErro('Preencha usuário e senha.');
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ usuario_acesso: usuario, senha })
      });
      const data = await res.json();

      if (!res.ok) {
        setErro(data.message || 'Erro no login.');
        return;
      }

      onLogin(data.token); 
    } catch {
      setErro('Erro de conexão.');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Usuário"
        value={usuario}
        onChange={e => setUsuario(e.target.value)}
        required
        style={{ width: '100%', marginBottom: 10, padding: 8 }}
      />
      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={e => setSenha(e.target.value)}
        required
        style={{ width: '100%', marginBottom: 10, padding: 8 }}
      />
      <button type="submit" style={{ width: '100%', padding: 10 }}>Entrar</button>

      {erro && <p style={{ color: 'red' }}>{erro}</p>}

      <button type="button" onClick={onIrCadastro} style={{ marginTop: 20, width: '100%' }}>
        Ir para Cadastro
      </button>
    </form>
  );
}
