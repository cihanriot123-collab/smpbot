const express = require('express');
const mineflayer = require('mineflayer');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Bot aktif!'));
app.get('/health', (req, res) => res.status(200).json({ status: 'OK' }));
app.listen(PORT, () => console.log(`HTTP sunucusu ${PORT} portunda başlatıldı.`));

const BOT_PASSWORD = 'Sifren123!'; // Botun şifresi

function createBot() {
  const bot = mineflayer.createBot({
    host: 'agalarsmp2.falixsrv.me',
    port: 25565,
    username: 'AFK_Bot',
    version: '1.21.11',
    checkTimeoutInterval: 60 * 1000
  });

  bot.on('spawn', () => {
    console.log('Bot sunucuya katıldı. Ekran kapatılıp chat girişi denenecek...');

    // 1. Oyuna girdikten 1.5 saniye sonra ESC / Cancel niyetine pencereyi kapatır
    setTimeout(() => {
      try {
        if (bot.currentWindow) {
          bot.closeWindow(bot.currentWindow);
          console.log('Giriş ekranı kapatıldı (ESC atıldı).');
        }
      } catch (err) {
        console.log('Pencere kapatma deneniyor...');
      }
    }, 1500);

    // 2. Ekran kapandıktan sonra (3. saniyede) chat komutlarını gönderir
    setTimeout(() => {
      bot.chat(`/register ${BOT_PASSWORD} ${BOT_PASSWORD}`);
      bot.chat(`/login ${BOT_PASSWORD}`);
      console.log('Chat kayıt/giriş komutları atıldı.');
    }, 3000);
  });

  // Hataları yakala ve botun çökmesini engelle
  bot.on('error', (err) => {
    if (err.code === 'EPIPE') {
      console.log('EPIPE hatası yakalandı.');
    } else {
      console.log('Bot hatası:', err);
    }
  });

  bot.on('end', () => {
    console.log('Bağlantı koptu, 10 saniye sonra tekrar bağlanılıyor...');
    setTimeout(createBot, 10000);
  });
}

createBot();
