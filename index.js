const express = require('express');
const mineflayer = require('mineflayer');

// --- 1. HTTP SUNUCUSU (Platformların kapanmaması için) ---
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Bot aktif ve 7/24 çalısıyor!');
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.listen(PORT, () => {
  console.log(`HTTP sunucusu ${PORT} portunda baslatildi.`);
});

// --- 2. MINEFLAYER BOT YAPILANDIRMASI ---
function createBot() {
  const bot = mineflayer.createBot({
    host: 'agalarsmp2.falixsrv.me', // Minecraft sunucu IP adresi
    port: 25565,                     // Sunucu portu
    username: 'AFK_Bot',         // Botun kullanıcı adı
  });

  bot.on('spawn', () => {
    console.log('Bot sunucuya basariyla bağlandi!');
  });

  bot.on('end', () => {
    console.log('Bağlantı koptu, 10 saniye sonra tekrar bağlanılıyor...');
    setTimeout(createBot, 10000); // Kapanırsa otomatik yeniden başla
  });

  bot.on('error', (err) => {
    console.log('Bot hatasi:', err);
  });
}

createBot();
