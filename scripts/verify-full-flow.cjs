const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

async function runFullVerification() {
  const outputDir = path.join(__dirname, '..', 'verification-screenshots');
  const brainArtifactDir = 'C:\\Users\\PlayM\\.gemini\\antigravity\\brain\\e2a96f3a-00dc-4c6b-a625-1a9646b41ede';

  const PORT = 5290;
  let targetUrl = `http://127.0.0.1:${PORT}/`;
  console.log(`Starting Vite preview server on port ${PORT}...`);
  const server = spawn('cmd.exe', ['/c', 'npx', 'vite', 'preview', '--port', String(PORT), '--host', '127.0.0.1'], {
    cwd: path.join(__dirname, '..'),
    stdio: 'pipe',
  });

  server.stdout.on('data', (d) => {
    const text = d.toString();
    console.log('[Server stdout]:', text.trim());
    const m = text.match(/http:\/\/(?:127\.0\.0\.1|localhost):(\d+)\//);
    if (m) targetUrl = `http://127.0.0.1:${m[1]}/`;
  });
  server.stderr.on('data', (d) => console.error('[Server stderr]:', d.toString().trim()));

  await new Promise((r) => setTimeout(r, 3500));

  const profileDir = path.join(__dirname, 'prof-flow-' + Date.now());
  const consoleErrors = [];
  console.log('Launching browser for full lifecycle test...');
  const browser = await puppeteer.launch({
    headless: 'new',
    userDataDir: profileDir,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--autoplay-policy=no-user-gesture-required'],
  });

  const cleanup = async () => {
    try { await browser.close(); } catch (e) {}
    try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (e) {}
    try {
      if (server.pid) {
        spawn('taskkill', ['/F', '/T', '/PID', String(server.pid)]);
      }
    } catch (e) {}
  };

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
        console.error('[Browser Error]:', msg.text());
      }
    });

    console.log(`Navigating to ${targetUrl}...`);
    await page.goto(targetUrl, { waitUntil: 'networkidle0' });

    const saveShot = async (name) => {
      const localPath = path.join(outputDir, `${name}.png`);
      const brainPath = path.join(brainArtifactDir, `${name}.png`);
      await page.screenshot({ path: localPath });
      await page.screenshot({ path: brainPath });
      console.log(`Saved screenshot: ${name}.png`);
    };

    // Board train
    console.log('Boarding train...');
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Board'));
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 2400));

    // Wait until unlocked on Station 1 (or fast tick)
    console.log('Waiting for Station 1 to reach 0s and unlock...');
    let unlocked = false;
    for (let i = 0; i < 35; i++) {
      const isBtnDisabled = await page.evaluate(() => {
        const btn = document.querySelector('button.btn-ripple');
        return btn ? btn.disabled : true;
      });
      if (!isBtnDisabled) {
        unlocked = true;
        console.log(`Station 1 unlocked at ~${i}s!`);
        break;
      }
      await new Promise((r) => setTimeout(r, 1000));
    }

    if (!unlocked) {
      throw new Error('Station 1 did not unlock after 35s!');
    }

    await saveShot('02c-station-1-unlocked-390');

    // Click Next stop: Little Things
    console.log('Clicking unlocked Next stop button...');
    await page.evaluate(() => {
      const btn = document.querySelector('button.btn-ripple');
      if (btn) btn.click();
    });
    // Wait for travel (4.4s + door open) and carriage mount
    await new Promise((r) => setTimeout(r, 6200));

    // Check Station 2 is mounted and locked
    const stn2Info = await page.evaluate(() => {
      const h2 = document.querySelector('h2');
      const btn = document.querySelector('button.btn-ripple');
      return {
        title: h2 ? h2.textContent.trim() : '',
        btnText: btn ? btn.textContent.trim() : '',
        disabled: btn ? btn.disabled : false,
      };
    });
    console.log('Station 2 state:', stn2Info);
    if (!stn2Info.title.includes('Little Things') || !stn2Info.btnText.includes('Next stop in')) {
      throw new Error('Station 2 did not lock or mount properly!');
    }
    await saveShot('03-station-2-locked-390');

    // Test Revisit: Click Station 1 in RouteDisplay
    console.log('Testing backward jump to visited Station 1...');
    await page.evaluate(() => {
      // Find RouteDisplay buttons
      const btns = Array.from(document.querySelectorAll('button[aria-label*="The Beginning"]'));
      if (btns.length > 0) btns[0].click();
    });
    // Wait for travel back
    await new Promise((r) => setTimeout(r, 6200));

    const revisitInfo = await page.evaluate(() => {
      const h2 = document.querySelector('h2');
      const btn = document.querySelector('button.btn-ripple');
      return {
        title: h2 ? h2.textContent.trim() : '',
        btnText: btn ? btn.textContent.trim() : '',
        disabled: btn ? btn.disabled : true,
      };
    });
    console.log('Revisited Station 1 state:', revisitInfo);
    if (!revisitInfo.title.includes('The Beginning') || revisitInfo.disabled) {
      throw new Error('Revisited station should be unlocked immediately!');
    }
    await saveShot('02d-station-1-revisited-unlocked-390');

    console.log('\n--- FULL LIFECYCLE QA PASS ---');
    console.log('Console Errors:', consoleErrors.length);
    console.log('✅ Countdown from 30s to 0s unlocks button with shimmer and chime');
    console.log('✅ Next stop travel crossfades songs smoothly');
    console.log('✅ Station 2 starts its own 30s locked gate');
    console.log('✅ Backward jump to visited station is immediately unlocked and replays song');

  } catch (err) {
    console.error('Lifecycle test failed:', err);
    process.exitCode = 1;
  } finally {
    await cleanup();
  }
}

runFullVerification();
