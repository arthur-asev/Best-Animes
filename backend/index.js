const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Rota para consumir a API Jikan
app.get('/api/anime/:title', async (req, res) => {
  const { title } = req.params;

  try {
    const response = await axios.get(`https://api.jikan.moe/v4/anime?q=${title}`);
    res.json(response.data);
  } catch (error) {
    console.error('Erro ao buscar dados da API Jikan:', error.message);
    res.status(500).json({ error: 'Erro ao buscar dados da API Jikan' });
  }
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
