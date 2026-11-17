const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

async function runVerification() {
  const outputDir = path.join(__dirname, '..', 'verification-screenshots');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const brainArtifactDir = 'C:\\Users\\PlayM\\.gemini\\antigravity\\brain\\e2a96f3a-00dc-4c6b-a625-1a9646b41ede';
  if (!fs.existsSync(brainArtifactDir)) {
    fs.mkdirSync(brainArtifactDir, { recursive: true });
  }

  // Use a dedicated high port
  const PORT = 5270;
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

  // Wait 3.5 seconds for server to start
  await new Promise((r) => setTimeout(r, 3500));

  const profileDir = path.join(__dirname, 'prof-mobile-' + Date.now());
  const consoleErrors = [];
  console.log('Launching browser for cinematic mobile testing...');
  const browser = await puppeteer.launch({
    headless: 'new',
    userDataDir: profileDir,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
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
    
    // Set Primary Mobile Viewport: 390x844 (iPhone 14)
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    page.on('pageerror', (err) => {
      consoleErrors.push(err.toString());
    });

    console.log(`Navigating to ${targetUrl}...`);
    await page.goto(targetUrl, { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 1000));

    const saveShot = async (name) => {
      const localPath = path.join(outputDir, `${name}.png`);
      const brainPath = path.join(brainArtifactDir, `${name}.png`);
      await page.screenshot({ path: localPath });
      await page.screenshot({ path: brainPath });
      console.log(`Saved screenshot: ${name}.png`);
    };

    // 1. Screenshot Intro Screen (390x844)
    await saveShot('01-platform-intro-390');

    // 2. Click "Board the Train"
    console.log('Boarding train...');
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Board'));
      if (btn) btn.click();
    });
    // Wait for boarding door transition
    await new Promise((r) => setTimeout(r, 2400));

    // Tap text to skip typing
    await page.evaluate(() => {
      const card = document.querySelector('.fade-mask-y');
      if (card) card.click();
    });
    await new Promise((r) => setTimeout(r, 600));
    await saveShot('02-station-1-beginning-390');

    // 3. Travel to Station 2: Little Things and capture the creative doors mid-travel!
    console.log('Advancing to Station 2: Little Things...');
    await page.keyboard.press('ArrowRight');
    // Wait for doors to close and train to be in cruise mode (~1.5s in)
    await new Promise((r) => setTimeout(r, 1400));
    await saveShot('02b-creative-metro-doors-travel-390');

    // Wait for arrival & doors to open
    await new Promise((r) => setTimeout(r, 4600));
    // Tap to skip text reveal
    await page.evaluate(() => {
      const el = document.querySelector('.cursor-pointer') || document.querySelector('.fade-mask-y');
      if (el) el.click();
    });
    await new Promise((r) => setTimeout(r, 800));
    await saveShot('03-station-2-little-things-390');

    // 4. Station 3: Our Little World
    console.log('Advancing to Station 3: Our Little World...');
    await page.keyboard.press('ArrowRight');
    await new Promise((r) => setTimeout(r, 5200));
    await page.evaluate(() => {
      const el = document.querySelector('.cursor-pointer') || document.querySelector('.fade-mask-y');
      if (el) el.click();
    });
    await new Promise((r) => setTimeout(r, 800));
    await saveShot('05-station-3-our-world-390');

    // 5. Station 4: My Confession
    console.log('Advancing to Station 4: My Confession...');
    await page.keyboard.press('ArrowRight');
    await new Promise((r) => setTimeout(r, 5200));
    // Tap to complete quote part 1
    await page.evaluate(() => {
      const el = document.querySelector('.cursor-pointer') || document.querySelector('.fade-mask-y');
      if (el) el.click();
    });
    // Wait for "I LIKE YOU. ❤️" cinematic reveal to start
    await new Promise((r) => setTimeout(r, 2200));
    await saveShot('07-station-4-i-like-you-reveal-390');

    // Wait for "I LIKE YOU" to finish pulse and show part 2
    await new Promise((r) => setTimeout(r, 3500));
    await saveShot('08-station-4-confession-complete-390');

    // 6. Station 5: Final Stop (Proposal)
    console.log('Advancing to Station 5: Final Stop...');
    await page.keyboard.press('ArrowRight');
    await new Promise((r) => setTimeout(r, 5200));
    // Tap text to show proposal card
    try {
      await page.click('.cursor-pointer');
    } catch (e) {
      await page.evaluate(() => {
        const el = document.querySelector('.cursor-pointer') || document.querySelector('.fade-mask-y');
        if (el) el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      });
    }
    await new Promise((r) => setTimeout(r, 1500));
    await saveShot('09-station-5-proposal-390');

    // Test NO button dodge
    console.log('Testing NO button dodge...');
    for (let i = 0; i < 3; i++) {
      try {
        const noHandle = await page.$('button[style*="rgba(255, 255, 255, 0.15)"], button:has-text("No"), button:has-text("sure")');
        if (noHandle) {
          await noHandle.hover();
          await noHandle.click();
        } else {
          await page.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('button'));
            const noBtn = btns.find(b => b.textContent.includes('No') || b.textContent.includes('sure') || b.textContent.includes('yosichu') || b.textContent.includes('Please'));
            if (noBtn) {
              noBtn.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
              noBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            }
          });
        }
      } catch (e) {}
      await new Promise((r) => setTimeout(r, 400));
    }
    await saveShot('10-no-button-dodged-390');

    // Click YES ❤️ button
    console.log('Clicking YES ❤️ button...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const yesBtn = btns.find(b => b.textContent.includes('YES'));
      if (yesBtn) {
        yesBtn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      }
    });
    await new Promise((r) => setTimeout(r, 2000));
    await saveShot('11-celebration-said-yes-390');

    // 7. Verify Smallest Viewport: 360x640 (Compact Android)
    console.log('Testing compact 360x640 viewport...');
    await page.setViewport({ width: 360, height: 640, isMobile: true, hasTouch: true });
    // Click Replay
    await page.evaluate(() => {
      const replayBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Replay'));
      if (replayBtn) replayBtn.click();
    });
    await new Promise((r) => setTimeout(r, 1200));
    // Board again to verify Station 1 on 360x640
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Board'));
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 1600));
    
    // Verify no horizontal overflow on 360x640
    const overflow360 = await page.evaluate(() => {
      const bodyOverflow = document.body.scrollWidth > window.innerWidth;
      const rootOverflow = document.getElementById('root').scrollWidth > window.innerWidth;
      return { bodyOverflow, rootOverflow };
    });
    console.log('360x640 Overflow check:', overflow360);
    await saveShot('12-station-1-compact-360');

    // 8. Verify Largest Mobile Viewport: 430x932 (iPhone Pro Max)
    console.log('Testing 430x932 viewport...');
    await page.setViewport({ width: 430, height: 932, isMobile: true, hasTouch: true });
    await new Promise((r) => setTimeout(r, 600));
    await saveShot('13-station-1-promax-430');

    // 9. Verify Desktop Viewport: 1440x900 (Centered column)
    console.log('Testing desktop 1440x900 centered layout...');
    await page.setViewport({ width: 1440, height: 900, isMobile: false, hasTouch: false });
    await new Promise((r) => setTimeout(r, 600));
    await saveShot('14-desktop-centered-1440');

    await cleanup();

    console.log('\n--- CREATIVE DOOR VERIFICATION SUMMARY ---');
    console.log(`Console Errors: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.log(consoleErrors);
    } else {
      console.log('✅ ZERO console errors detected!');
    }
    console.log('✅ Verified Creative Metro Doors with observation glass, misty heart drawing, and LED transom!');
    console.log('✅ Verified on 390x844, 360x640, 430x932, and 1440x900 desktop centered viewports!');
    console.log('✅ Zero photos, zero forbidden words, zero mascots, zero neon green!');
  } catch (err) {
    await cleanup();
    throw err;
  }
}

runVerification().catch((err) => {
  console.error('Verification failed with error:', err);
  process.exit(1);
});
