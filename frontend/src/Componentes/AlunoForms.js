import React, { useState } from 'react';

export default function AlunoForm({ onVoltarLogin }) {
  const [form, setForm] = useState({
    nome_completo: '',
    usuario_acesso: '',
    senha: '',
    email_aluno: '',
    observacao: ''
  });
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  function validaEmail(email) {
    return /^\S+@\S+\.\S+$/.test(email);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErro('');
    setSucesso('');
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.nome_completo.trim() ||
        !form.usuario_acesso.trim() ||
        !form.senha.trim() ||
        !form.email_aluno.trim()) {
      setErro('Preencha todos os campos obrigatórios.');
      return;
    }

    if (!validaEmail(form.email_aluno)) {
      setErro('E-mail inválido.');
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/api/alunos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();

      if (!res.ok) {
        setErro(data.message || 'Erro ao cadastrar.');
        setSucesso('');
        return;
      }

      setSucesso(data.message || 'Cadastro realizado com sucesso.');
      setErro('');
      setForm({
        nome_completo: '',
        usuario_acesso: '',
        senha: '',
        email_aluno: '',
        observacao: ''
      });
    } catch {
      setErro('Erro de conexão com o servidor.');
      setSucesso('');
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: 'auto' }}>
      <h2>Cadastro de Aluno</h2>
      
      <input
        type="text"
        name="nome_completo"
        placeholder="Nome Completo*"
        maxLength={100}
        value={form.nome_completo}
        onChange={handleChange}
        required
        style={{ width: '100%', marginBottom: 10, padding: 8 }}
      />
      
      <input
        type="text"
        name="usuario_acesso"
        placeholder="Usuário*"
        maxLength={50}
        value={form.usuario_acesso}
        onChange={handleChange}
        required
        style={{ width: '100%', marginBottom: 10, padding: 8 }}
      />
      
      <input
        type="password"
        name="senha"
        placeholder="Senha*"
        value={form.senha}
        onChange={handleChange}
        required
        style={{ width: '100%', marginBottom: 10, padding: 8 }}
      />
      
      <input
        type="email"
        name="email_aluno"
        placeholder="E-mail*"
        maxLength={100}
        value={form.email_aluno}
        onChange={handleChange}
        required
        style={{ width: '100%', marginBottom: 10, padding: 8 }}
      />
      
      <textarea
        name="observacao"
        placeholder="Observação"
        maxLength={500}
        value={form.observacao}
        onChange={handleChange}
        style={{ width: '100%', marginBottom: 10, padding: 8, resize: 'vertical' }}
      />
      
      <button type="submit" style={{ padding: 10, width: '100%' }}>Cadastrar</button>

      <button type="button" onClick={onVoltarLogin} style={{ marginTop: 10, width: '100%' }}>
        Voltar para Login
      </button>

      {erro && <p style={{ color: 'red' }}>{erro}</p>}
      {sucesso && <p style={{ color: 'green' }}>{sucesso}</p>}
    </form>
  );
}
