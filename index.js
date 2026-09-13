const express = require('express');
const mineflayer = require('mineflayer');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Bot aktif!'));
app.get('/health', (req, res) => res.status(200).json({ status: 'OK' }));
app.listen(PORT, () => console.log(`HTTP sunucusu ${PORT} portunda başlatıldı.`));

// BOT ŞİFRENİN ENVENTAR SLOT SIRALAMASI
// ÖRNEK: Şifren "1 2 3 4" ise GUI menüsündeki rakamların slot numaralarını buraya sırayla yaz.
// Genelde GUI menüsünde rakamlar 10, 11, 12... slotlarında olur.
const GUI_PIN_SLOTS = [10, 11, 12, 13]; // Buraya basılacak slot sırasını gir

function createBot() {
  const bot = mineflayer.createBot({
    host: 'agalarsmp2.falixsrv.me',
    port: 25565,
    username: 'AFK_Bot',
    version: '1.21.11'
  });

  bot.on('spawn', () => {
    console.log('Bot sunucuya başarıyla bağlandı!');
  });

  // GUI ekranı (Login Menüsü) açıldığında tetiklenir
  bot.on('windowOpen', async (window) => {
    console.log(`GUI Menüsü açıldı: ${window.title}`);

    // Slotlara sırayla tıklama işlemi (her tık arası 300ms bekler)
    for (const slotIndex of GUI_PIN_SLOTS) {
      await bot.clickWindow(slotIndex, 0, 0);
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
    console.log('GUI şifresi başarıyla girildi!');
  });

  bot.on('end', () => {
    console.log('Bağlantı koptu, 10 saniye sonra tekrar bağlanılıyor...');
    setTimeout(createBot, 10000);
  });

  bot.on('error', (err) => {
    console.log('Bot hatası:', err);
  });
}

createBot();
