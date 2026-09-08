const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const logs = { requests: [], console: [] };

  page.on('request', req => {
    logs.requests.push({ url: req.url(), method: req.method(), headers: req.headers(), postData: req.postData() });
  });

  page.on('response', async res => {
    try {
      const ct = res.headers()['content-type'] || '';
      let body = null;
      if (ct.includes('application/json')) body = await res.json();
      else body = await res.text();
      logs.requests.push({ url: res.url(), status: res.status(), body });
    } catch (e) {
      // ignore
    }
  });

  page.on('console', msg => {
    logs.console.push({ type: msg.type(), text: msg.text() });
  });

  // Navigate to local frontend (adjust if your Vite server runs elsewhere)
  const url = 'http://localhost:4173/register';
  console.log('Opening', url);
  try {
    await page.goto(url, { waitUntil: 'networkidle' });
  } catch (e) {
    console.error('Error loading page:', e.message);
  }

  // Fill register form fields — selectors based on Register.tsx
  try {
    await page.fill('input#firstName', 'E2E');
    await page.fill('input#lastName', 'Runner');
    await page.fill('input#register-email', 'e2e_ui_test@example.com');
    await page.fill('input#register-password', 'password123');
    await page.fill('input#confirm-password', 'password123');

    // click client role (first role button)
    await page.click('button.role-option');

    // accept terms
    await page.check('input#terms');

    // submit
    await Promise.all([
      page.waitForResponse(resp => resp.url().includes('/api/auth/register') && resp.request().method() === 'POST', { timeout: 10000 }).catch(e => null),
      page.click('button.register-submit')
    ]);

  } catch (e) {
    console.error('Form interaction error:', e.message);
  }

  // wait a bit and save logs
  await page.waitForTimeout(1000);

  fs.writeFileSync('e2e/register-logs.json', JSON.stringify(logs, null, 2));
  console.log('Logs written to e2e/register-logs.json');

  await browser.close();
})();
