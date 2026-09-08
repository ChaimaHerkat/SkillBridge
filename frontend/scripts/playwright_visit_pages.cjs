const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', msg => console.log('[PAGE CONSOLE]', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('[PAGE ERROR]', err));
  page.on('requestfailed', req => console.log('[REQUEST FAILED]', req.url(), req.failure() && req.failure().errorText));
  page.on('request', req => console.log('[REQUEST]', req.method(), req.url()));
  page.on('requestfinished', req => console.log('[REQUEST FINISHED]', req.method(), req.url()));
  page.on('response', async res => {
    try {
      const url = res.url();
      if (url.includes('/api/')) {
        const status = res.status();
        const body = await res.text();
        console.log('[API RESPONSE]', status, url, body.substring(0, 300));
      }
    } catch (e) {
      console.log('[RESPONSE READ ERROR]', e);
    }
  });

  const base = process.env.BASE_URL || 'http://localhost:5174';
  const pages = [
    '/',
    '/marketplace',
    '/dashboard',
    '/messages',
    '/profile',
    '/login',
    '/register'
  ];

  if (!fs.existsSync('tmp')) fs.mkdirSync('tmp');

  for (const p of pages) {
    const url = base + p;
    console.log('Visiting', url);
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
      await page.waitForTimeout(500);
      const filename = `tmp/screenshot_${p.replace(/\//g, '_') || 'home'}.png`;
      await page.screenshot({ path: filename, fullPage: true });
      console.log('Saved', filename);
    } catch (e) {
      console.log('Error visiting', url, e.message);
    }
  }

  await browser.close();
  console.log('Done visiting pages');
})();
