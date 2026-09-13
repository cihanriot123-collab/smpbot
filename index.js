const express = require('express');
const mineflayer = require('mineflayer');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Bot aktif!'));
app.get('/health', (req, res) => res.status(200).json({ status: 'OK' }));
app.listen(PORT, () => console.log(`HTTP sunucusu ${PORT} portunda başlatıldı.`));

const GUI_PIN_SLOTS = [10, 11, 12, 13]; // Slot indekslerin

function createBot() {
  const bot = mineflayer.createBot({
    host: 'agalarsmp2.falixsrv.me',
    port: 25565,
    username: 'AFK_Bot',
    version: '1.21.11',
    checkTimeoutInterval: 60 * 1000 // Zaman aşımı süresini artır
  });

  bot.on('spawn', () => {
    console.log('Bot sunucuya katıldı, paketler bekleniyor...');
  });

  // GUI ekranı açıldığında hemen değil, 1 saniye bekleyip tıklatıyoruz (EPIPE önleyici)
  bot.on('windowOpen', async (window) => {
    console.log(`GUI Menüsü algılandı: ${window.title}`);

    // Sunucunun soketi kapatmaması için 1 saniye gecikme koyuyoruz
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      for (const slotIndex of GUI_PIN_SLOTS) {
        if (bot.currentWindow) { // Pencere hâlâ açık mı kontrol et
          await bot.clickWindow(slotIndex, 0, 0);
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }
      console.log('GUI şifresi basıldı!');
    } catch (err) {
      console.log('GUI tıklama hatası önlendi:', err.message);
    }
  });

  // EPIPE hatalarını yakalayıp botun çökmesini önler
  bot.on('error', (err) => {
    if (err.code === 'EPIPE') {
      console.log('Soket bağlantısı sunucu tarafından kapatıldı (EPIPE).');
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
