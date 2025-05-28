import React, { useEffect, useState } from 'react';

export default function ListaAlunos({ token, onLogout }) {
  const [alunos, setAlunos] = useState([]);
  const [erro, setErro] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/api/alunos', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(async res => {
        if (!res.ok) {
          if (res.status === 401) {
            onLogout();
            return;
          }
          const data = await res.json();
          setErro(data.message || 'Erro ao buscar alunos.');
          return;
        }
        const data = await res.json();
        setAlunos(data.alunos);
      })
      .catch(() => setErro('Erro na conexão com o servidor.'));
  }, [token, onLogout]);

  return (
    <div>
      <h2>Lista de Alunos</h2>
      <button onClick={onLogout} style={{ marginBottom: 10 }}>Sair</button>
      {erro && <p style={{ color: 'red' }}>{erro}</p>}
      {!erro && (
        <table border="1" cellPadding="5" cellSpacing="0" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Usuário</th>
              <th>E-mail</th>
              <th>Observação</th>
              <th>Data Cadastro</th>
            </tr>
          </thead>
          <tbody>
            {alunos.map(aluno => (
              <tr key={aluno.id_aluno}>
                <td>{aluno.id_aluno}</td>
                <td>{aluno.nome_completo}</td>
                <td>{aluno.usuario_acesso}</td>
                <td>{aluno.email_aluno}</td>
                <td>{aluno.observacao || '-'}</td>
                <td>{new Date(aluno.data_cadastro).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
