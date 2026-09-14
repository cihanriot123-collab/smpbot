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
    checkTimeoutInterval: 90 * 1000
  });

  // GrimAC veya korumalara takılmaması için fiziği baştan kapatıyoruz
  bot.physicsEnabled = false;

  bot.on('spawn', () => {
    console.log('Bot sunucuya katıldı. Giriş bekleniyor...');

    // 1. Varsa açık pencereyi/GUI'yi kapat
    setTimeout(() => {
      try {
        if (bot.currentWindow) {
          bot.closeWindow(bot.currentWindow);
        }
      } catch (e) {}
    }, 1000);

    // 2. Chatten giriş yap
    setTimeout(() => {
      bot.chat(`/register ${BOT_PASSWORD} ${BOT_PASSWORD}`);
      bot.chat(`/login ${BOT_PASSWORD}`);
      console.log('Chat kayıt/giriş komutları gönderildi.');
    }, 2500);

    // 3. Giriş yaptıktan sonra fiziği tekrar aç
    setTimeout(() => {
      bot.physicsEnabled = true;
      console.log('Bot fiziği aktifleştirildi.');
    }, 5000);
  });

  bot.on('windowOpen', (window) => {
    setTimeout(() => {
      try {
        bot.closeWindow(window);
      } catch (e) {}
    }, 500);
  });

  bot.on('error', (err) => {
    console.log('Bot hatası:', err.message);
  });

  bot.on('end', (reason) => {
    console.log(`Bağlantı koptu (${reason}), 10 saniye sonra tekrar bağlanılıyor...`);
    setTimeout(createBot, 10000);
  });
}

createBot();
