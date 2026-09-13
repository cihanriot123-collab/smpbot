const express = require('express');
const mineflayer = require('mineflayer');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Bot aktif!'));
app.get('/health', (req, res) => res.status(200).json({ status: 'OK' }));
app.listen(PORT, () => console.log(`HTTP sunucusu ${PORT} portunda başlatıldı.`));

const BOT_PASSWORD = 'Sifren123!'; // <<< Botun girmesini istediğin şifre

function createBot() {
  const bot = mineflayer.createBot({
    host: 'agalarsmp2.falixsrv.me',
    port: 25565,
    username: 'afk_Yiz_gardas',
    version: '1.21.11',
    checkTimeoutInterval: 60 * 1000
  });

  bot.on('spawn', () => {
    console.log('Bot sunucuya katıldı. Giriş komutları gönderiliyor...');

    // Sunucu dünyayı yüklesin diye 2.5 saniye bekleyip kayıt/giriş komutunu atar
    setTimeout(() => {
      bot.chat(`/register ${BOT_PASSWORD} ${BOT_PASSWORD}`);
      bot.chat(`/login ${BOT_PASSWORD}`);
      console.log('Kayıt/Giriş komutları chatten iletildi.');
    }, 2500);
  });

  // Chatte login/register uyarısı çıkarsa otomatik tekrar dener
  bot.on('messagestr', (message) => {
    const msg = message.toLowerCase();
    if (msg.includes('/login') || msg.includes('şifre') || msg.includes('password')) {
      setTimeout(() => {
        bot.chat(`/login ${BOT_PASSWORD}`);
      }, 1000);
    }
  });

  bot.on('error', (err) => {
    console.log('Bot hatası:', err.message);
  });

  bot.on('end', () => {
    console.log('Bağlantı koptu, 10 saniye sonra tekrar bağlanılıyor...');
    setTimeout(createBot, 10000);
  });
}

createBot();
