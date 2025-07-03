const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto('https://www.mystockalgo.com', { waitUntil: 'networkidle2' });

  const date = new Date().toISOString().split('T')[0];
  const filename = `archive_${date}.png`;
  const archiveDir = path.join(__dirname, '..', 'archives');
  const hashLogPath = path.join(archiveDir, 'hashlog.csv');

  if (!fs.existsSync(archiveDir)) fs.mkdirSync(archiveDir);

  const filepath = path.join(archiveDir, filename);
  await page.screenshot({ path: filepath, fullPage: true });

  const hash = crypto.createHash('sha256').update(fs.readFileSync(filepath)).digest('hex');
  const logLine = `${date},${filename},${hash}\n`;

  fs.appendFileSync(hashLogPath, logLine);

  console.log(`Screenshot saved and logged: ${filename}`);
  await browser.close();
})();
