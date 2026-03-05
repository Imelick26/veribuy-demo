import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEMO_URL = 'https://veribuy-demo.vercel.app/';
const VIDEO_DIR = path.join(__dirname, 'recordings');
const AUDIO_DURATION = 394; // 6:34

// Helper: wait until a specific timestamp (seconds from start)
function waitUntil(startTime, targetSec) {
  const elapsed = (Date.now() - startTime) / 1000;
  const remaining = Math.max(0, targetSec - elapsed);
  console.log(`  ⏳ waiting ${remaining.toFixed(1)}s to reach ${Math.floor(targetSec/60)}:${String(Math.floor(targetSec%60)).padStart(2,'0')}...`);
  return new Promise(r => setTimeout(r, remaining * 1000));
}

// Helper: smooth scroll the main content area
async function smoothScroll(page, distance, duration = 2000) {
  await page.evaluate(({ dist, dur }) => {
    const el = document.querySelector('main')?.parentElement || document.scrollingElement || document.documentElement;
    const target = el.scrollTop + dist;
    const start = el.scrollTop;
    const startTime = performance.now();
    function step(now) {
      const t = Math.min((now - startTime) / dur, 1);
      const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      el.scrollTop = start + (target - start) * ease;
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }, { dist: distance, dur: duration });
  await page.waitForTimeout(duration + 300);
}

// Helper: scroll the risk list panel
async function scrollRiskPanel(page, top) {
  await page.evaluate((scrollTop) => {
    const riskPanel = document.querySelectorAll('main > div > div > div')[1];
    if (riskPanel) riskPanel.scrollTo({ top: scrollTop, behavior: 'smooth' });
  }, top);
  await page.waitForTimeout(2500);
}

(async () => {
  console.log('🎬 Launching browser...');
  const browser = await chromium.launch({
    headless: false,
    args: ['--disable-gpu-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: {
      dir: VIDEO_DIR,
      size: { width: 1920, height: 1080 }
    }
  });

  const page = await context.newPage();
  console.log('🌐 Navigating to demo...');
  await page.goto(DEMO_URL, { waitUntil: 'networkidle', timeout: 30000 });

  const T0 = Date.now();
  const at = (sec) => waitUntil(T0, sec);
  console.log('🔴 Recording started — syncing to 6:34 audio track\n');

  // ═══════════════════════════════════════════════════════════════
  // 0:00 – 1:25  INTRO / PROBLEM STATEMENT
  // Audio: "Every dealership has been there..."
  //    ... "Let's walk through how it works."
  // Demo: Login animation auto-plays (~3.5s), welcome page sits
  // ═══════════════════════════════════════════════════════════════

  await at(77); // 1:17 — narrator says "Let's walk through how it works"
  console.log('[1:17] Clicking "Begin Verification"...');
  await page.locator('text=Begin Verification').click();
  await page.waitForTimeout(800);

  // ═══════════════════════════════════════════════════════════════
  // 1:17 – 1:49  VIN PAGE
  // Audio: "Everything starts with the vin..."
  //    ... "beyond a basic vin report."
  // Demo: VIN auto-decode plays, hold so viewer absorbs the decode
  // ═══════════════════════════════════════════════════════════════

  await at(109); // 1:49 — narrator says "Before anyone even sees the vehicle"
  console.log('[1:49] Navigating to Risk Intel...');
  await page.locator('text=Continue').click();
  await page.waitForTimeout(4000); // Wait for 3D model & risk items to load

  // ═══════════════════════════════════════════════════════════════
  // 1:49 – 3:01  RISK INTEL PAGE
  // Audio: "Before anyone even sees the vehicle..."
  //    ... head gasket detail, injector leaks, etc.
  //    ... "knows exactly what to look for."
  // Demo: Click top risk (head gasket), scroll through risks
  // ═══════════════════════════════════════════════════════════════

  // 2:09 — narrator starts detailing head gasket failure
  await at(129);
  console.log('[2:09] Clicking top risk (head gasket)...');
  await page.locator('main button').first().click();
  await page.waitForTimeout(6000); // Let detail card expand, narrator reads costs

  // ~2:25 — narrator moves to other risks (injector leaks, water pump, etc.)
  await at(145);
  console.log('[2:25] Scrolling to show more risks...');
  await scrollRiskPanel(page, 400);

  // Close expanded risk
  await page.locator('main button').first().click();
  await page.waitForTimeout(2000);

  // ~2:38 — scroll to Major/Moderate risks
  await at(158);
  console.log('[2:38] Scrolling to Major risks...');
  await scrollRiskPanel(page, 800);

  // ~2:50 — scroll further to show inspection checklist mention
  await at(170);
  console.log('[2:50] Scrolling to lower risks...');
  await scrollRiskPanel(page, 1200);

  // ═══════════════════════════════════════════════════════════════
  // 3:01 – 3:33  GUIDED CAPTURE PAGE
  // Audio: "Now the inspection begins..."
  //    ... "into a documented inspection."
  // Demo: Navigate to Capture, start capture, take photos, exit
  // ═══════════════════════════════════════════════════════════════

  await at(181); // 3:01
  console.log('[3:01] Navigating to Guided Capture...');
  await page.locator('text=Continue').click();
  await page.waitForTimeout(2000);

  // 3:16 — framing guidance / start guided capture
  await at(196);
  console.log('[3:16] Starting guided capture...');
  await page.locator('text=Start Guided Capture').click();
  await page.waitForTimeout(2500);

  // ~3:20 — take first photo (narrator: "which photos are required")
  console.log('[3:20] Taking first photo...');
  await page.locator('button[style*="border-radius: 50%"][style*="width: 64"]').click({ timeout: 5000 }).catch(async () => {
    await page.evaluate(() => {
      const btns = document.querySelectorAll('button');
      for (const b of btns) {
        if (b.style.borderRadius === '50%' && b.style.width === '64px') { b.click(); return; }
      }
      const hud = document.querySelector('[style*="position: fixed"][style*="z-index: 100"]');
      if (hud) {
        const btn = hud.querySelector('button[style*="border-radius"]');
        if (btn) btn.click();
      }
    });
  });
  await page.waitForTimeout(5000); // align → confirm → next zone

  // ~3:28 — take second photo
  console.log('[3:28] Taking second photo...');
  await page.evaluate(() => {
    const hud = document.querySelector('[style*="position: fixed"]');
    if (hud) {
      const btns = hud.querySelectorAll('button');
      for (const b of btns) {
        if (b.style.borderRadius === '50%' && parseInt(b.style.width) >= 60) { b.click(); return; }
      }
    }
  });
  await page.waitForTimeout(5000);

  // ~3:38 — exit camera
  console.log('[3:38] Exiting camera...');
  await page.locator('text=Close').click({ timeout: 3000 }).catch(async () => {
    await page.evaluate(() => {
      const hud = document.querySelector('[style*="position: fixed"]');
      if (hud) {
        const btns = hud.querySelectorAll('button');
        for (const b of btns) {
          if (b.textContent.includes('Close')) { b.click(); return; }
        }
      }
    });
  });
  await page.waitForTimeout(1500);

  // ═══════════════════════════════════════════════════════════════
  // 3:33 – 4:36  FINDINGS PAGE
  // Audio: "Now comes the moment of truth..."
  //    ... condition score 64/100, head gasket confirmed
  //    ... vehicle history at 4:14, "confidence moves to high"
  // Demo: Navigate to Findings, let items reveal, add history, scroll
  // ═══════════════════════════════════════════════════════════════

  await at(213); // 3:33
  console.log('[3:33] Moving to Findings...');
  await page.locator('text=Continue').click();
  await page.waitForTimeout(3000); // Let findings stagger in

  // ~3:40 — click the head gasket finding to show details
  await at(220);
  console.log('[3:40] Clicking head gasket finding...');
  await page.locator('text=Head Gasket Compromised').click();
  await page.waitForTimeout(3000); // Let detail card expand

  // ~3:48 — scroll down to show the details and other findings
  await at(228);
  console.log('[3:48] Scrolling through findings...');
  await smoothScroll(page, 350, 3000);
  await page.waitForTimeout(2000);
  await smoothScroll(page, 350, 3000);

  // 4:14 — narrator mentions vehicle history
  await at(254);
  console.log('[4:14] Adding vehicle history...');
  await page.locator('text=Add Vehicle History').click({ timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(4000); // Wait for history to load + spinner

  // ~4:22 — scroll down to see all history info
  await at(262);
  console.log('[4:22] Scrolling through vehicle history...');
  await smoothScroll(page, 400, 3000);
  await page.waitForTimeout(2000);
  await smoothScroll(page, 400, 3000);
  await page.waitForTimeout(2000);
  await smoothScroll(page, 400, 3000);

  // ═══════════════════════════════════════════════════════════════
  // 4:36 – 5:30  MARKET ANALYSIS PAGE
  // Audio: "Now VeriBuy answers the question..."
  //    ... AutoTrader, Cars.com, wholesale auction data
  //    ... "recommended maximum acquisition price is $15,275"
  //    ... "$5,000 gap VeriBuy just protected you from"
  // Demo: Navigate to Pricing, scroll through market data
  // ═══════════════════════════════════════════════════════════════

  await at(276); // 4:36
  console.log('[4:36] Navigating to Market Analysis...');
  await page.locator('text=Continue').click();
  await page.waitForTimeout(2500);

  // Slow scroll through pricing — narrator is reading specific numbers
  console.log('[4:40] Scrolling through pricing data...');
  await smoothScroll(page, 300, 3500);
  await page.waitForTimeout(3000);
  await smoothScroll(page, 300, 3500);
  await page.waitForTimeout(3000);

  // 5:17 — scroll down to show more pricing details (recommended max acquisition)
  await at(317);
  console.log('[5:17] Scrolling to show recommended price...');
  await smoothScroll(page, 350, 3500);
  await page.waitForTimeout(3000);
  await smoothScroll(page, 300, 3500);

  // ═══════════════════════════════════════════════════════════════
  // 5:30 – 5:56  REPORT PAGE
  // Audio: "All of this information rolls into the Verified Report..."
  //    ... "tied to that vehicle moving forward."
  // Demo: Navigate to Report, scroll through entire document
  // ═══════════════════════════════════════════════════════════════

  await at(330); // 5:30
  console.log('[5:30] Navigating to Report...');
  await page.locator('text=Continue').click();
  await page.waitForTimeout(2000);

  // Scroll through the full report — more movement to see everything
  console.log('[5:33] Scrolling through report...');
  await smoothScroll(page, 280, 2500);
  await page.waitForTimeout(1500);
  await smoothScroll(page, 280, 2500);
  await page.waitForTimeout(1500);
  await smoothScroll(page, 280, 2500);
  await page.waitForTimeout(1500);
  await smoothScroll(page, 280, 2500);
  await page.waitForTimeout(1500);
  await smoothScroll(page, 280, 2500);

  // ═══════════════════════════════════════════════════════════════
  // 5:56 – 6:34  CLOSING / COMPLETE PAGE
  // Audio: "At first glance, this Bronco Sport looked like a great buy..."
  //    ... "Verify before you buy… with VeriBuy."
  // Demo: Navigate to Complete, hold until audio ends
  // ═══════════════════════════════════════════════════════════════

  await at(356); // 5:56
  console.log('[5:56] Completing demo...');
  await page.locator('text=Complete').click();
  await page.waitForTimeout(2000);

  // Hold final page until audio ends + buffer
  await at(AUDIO_DURATION + 3); // 6:37
  console.log('[6:37] Audio ended. Stopping recording...\n');

  // Save and close
  const videoPath = await page.video().path();
  await page.close();
  await context.close();
  await browser.close();

  console.log('✅ Recording complete!');
  console.log(`📹 Video saved: ${videoPath}`);
  console.log('\nTo merge with audio, run:');
  console.log(`ffmpeg -i "${videoPath}" -i "C:\\Users\\melic\\Downloads\\ElevenLabs_2026-03-05T08_36_01_Cody S._eleven_v3.mp3" -c:v libx264 -c:a aac -shortest -y "C:\\Users\\melic\\Desktop\\veribuy-demo-final.mp4"`);
})();
