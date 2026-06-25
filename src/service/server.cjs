const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const PORT = 8000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

const pool = new Pool({
  user: 'postgres',       
  host: 'localhost',        
  database: 'flowerDataBase',
  password: '1234', 
  port: 5432,                
});

app.get('/api/test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ message: "PostgreSQL bağlantısı başarılı!", time: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Veritabanı bağlantı hatası!" });
  }
});

app.get('/api/flowers/:englishName', async (req, res) => {
  const { englishName } = req.params;

  try {
   
    const query = 'SELECT * FROM flowers WHERE TRIM(LOWER(english_name)) = TRIM(LOWER($1))';
    const result = await pool.query(query, [englishName]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Bitki veritabanında bulunamadı.' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("SQL Hatası:", err);
    res.status(500).json({ error: 'Sunucu hatası oluştu.' });
  }
});

app.listen(PORT, () => {
  console.log(`JavaScript Sunucusu http://localhost:${PORT} adresinde çalışıyor!`);
});