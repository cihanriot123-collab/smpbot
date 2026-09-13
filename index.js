const express = require('express');
const mineflayer = require('mineflayer');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Bot aktif!'));
app.get('/health', (req, res) => res.status(200).json({ status: 'OK' }));
app.listen(PORT, () => console.log(`HTTP sunucusu ${PORT} portunda başlatıldı.`));

const BOT_PASSWORD = 'Sifren123!'; // <<< Botun şifresi

function createBot() {
  const bot = mineflayer.createBot({
    host: 'agalarsmp2.falixsrv.me',
    port: 25565,
    username: 'AFK_Bot_724',
    version: '1.21.11',
    checkTimeoutInterval: 60 * 1000
  });

  bot.on('spawn', () => {
    console.log('Bot sunucuya başarıyla katıldı.');

    // 1. Ekran / Menü gelirse 1.5 saniye sonra otomatik kapatır (ESC basar)
    setTimeout(() => {
      try {
        if (bot.currentWindow) {
          bot.closeWindow(bot.currentWindow);
          console.log('Açılan menü/GUI kapatıldı (ESC atıldı).');
        }
      } catch (e) {
        // Ekran yoksa hatayı yut
      }
    }, 1500);

    // 2. Menü kapandıktan sonra (3. saniyede) chatten kayıt ve giriş yapar
    setTimeout(() => {
      bot.chat(`/register ${BOT_PASSWORD} ${BOT_PASSWORD}`);
      bot.chat(`/login ${BOT_PASSWORD}`);
      console.log('Chat kayıt/giriş komutları gönderildi.');
    }, 3000);
  });

  // Eğer ekrana yeni bir pencere/menü düşerse anında kapat
  bot.on('windowOpen', (window) => {
    console.log(`Menü açıldı (${window.title}), kapatılıyor...`);
    setTimeout(() => {
      try {
        bot.closeWindow(window);
      } catch (e) {}
    }, 500);
  });

  bot.on('error', (err) => {
    console.log('Bot bağlantı hatası:', err.message);
  });

  bot.on('end', (reason) => {
    console.log(`Bağlantı koptu (${reason}), 10 saniye sonra tekrar bağlanılıyor...`);
    setTimeout(createBot, 10000);
  });
}

createBot();
