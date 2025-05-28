const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(cors({
  origin: 'https://provacn02-qyz3c3hsw-lucas-projects-9b01cfe1.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

function autenticaToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'Token não fornecido' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token mal formatado' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(401).json({ message: 'Token inválido' });
    req.user = user;
    next();
  });
}

app.post('/api/alunos', async (req, res) => {
  try {
    const { nome_completo, usuario_acesso, senha, email_aluno, observacao } = req.body;

    if (!nome_completo || !usuario_acesso || !senha || !email_aluno) {
      return res.status(400).json({ message: 'Campos obrigatórios faltando' });
    }

    const [exists] = await pool.execute(
      'SELECT id_aluno FROM alunos WHERE usuario_acesso = ? OR email_aluno = ?',
      [usuario_acesso, email_aluno]
    );

    if (exists.length > 0) {
      return res.status(409).json({ message: 'Usuário ou email já cadastrado' });
    }

    const hashSenha = await bcrypt.hash(senha, 10);

    await pool.execute(
      `INSERT INTO alunos (nome_completo, usuario_acesso, senha_hash, email_aluno, observacao, data_cadastro) 
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [nome_completo, usuario_acesso, hashSenha, email_aluno, observacao || null]
    );

    return res.status(201).json({ message: 'Aluno cadastrado com sucesso' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { usuario_acesso, senha } = req.body;

    if (!usuario_acesso || !senha) {
      return res.status(400).json({ message: 'Usuário e senha obrigatórios' });
    }

    const [rows] = await pool.execute('SELECT * FROM alunos WHERE usuario_acesso = ?', [usuario_acesso]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Usuário ou senha incorretos' });
    }

    const aluno = rows[0];

    const senhaValida = await bcrypt.compare(senha, aluno.senha_hash);
    if (!senhaValida) {
      return res.status(401).json({ message: 'Usuário ou senha incorretos' });
    }

    const token = jwt.sign({ id_aluno: aluno.id_aluno, usuario_acesso: aluno.usuario_acesso }, JWT_SECRET, {
      expiresIn: '2h'
    });

    return res.json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

app.get('/api/alunos', autenticaToken, async (req, res) => {
  try {
    const [alunos] = await pool.execute(
      'SELECT id_aluno, nome_completo, usuario_acesso, email_aluno, observacao, data_cadastro FROM alunos'
    );

    return res.json({ alunos });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
