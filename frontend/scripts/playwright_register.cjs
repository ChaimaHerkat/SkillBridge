const { chromium } = require('playwright');

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
      if (url.includes('/api/auth/register')) {
        const status = res.status();
        const body = await res.text();
        console.log('[API RESPONSE]', status, url, body);
      }
    } catch (e) {
      console.log('[RESPONSE READ ERROR]', e);
    }
  });

  const base = process.env.BASE_URL || 'http://localhost:5173';
  console.log('Navigating to', `${base}/register`);
  await page.goto(`${base}/register`, { waitUntil: 'networkidle' });

  // Fill the register form
  await page.fill('#firstName', 'Play');
  await page.fill('#lastName', 'Wright');
  const testEmail = process.env.REGISTER_EMAIL || `pw_e2e_${Date.now()}@example.com`;
  console.log('Using test email:', testEmail);
  await page.fill('#register-email', testEmail);
  await page.fill('#register-password', 'password123');
  await page.fill('#confirm-password', 'password123');

  // Accept terms (required checkbox)
  await page.check('#terms');

  // Submit
  console.log('Submitting registration form...');
  await Promise.all([
    page.waitForResponse(r => r.url().includes('/api/auth/register') && r.request().method() === 'POST', { timeout: 10000 }).catch(e => console.log('[WAIT RESPONSE ERROR]', e.message)),
    page.click('button.register-submit')
  ]);

  // Give some time to capture logs
  await page.waitForTimeout(1000);

  await browser.close();
  // Print the email used so the caller can verify in DB
  console.log('REGISTERED_EMAIL:' + testEmail);
  console.log('Done');
})();
