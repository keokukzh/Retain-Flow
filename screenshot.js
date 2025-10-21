const { chromium } = require('playwright');

async function takeScreenshot(url, outputPath) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Set viewport size
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  // Navigate to the page with shorter timeout
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10000 });
  
  // Wait a bit for animations to load
  await page.waitForTimeout(3000);
  
  // Take full page screenshot
  await page.screenshot({ 
    path: outputPath, 
    fullPage: true,
    type: 'png'
  });
  
  await browser.close();
  console.log(`Screenshot saved to: ${outputPath}`);
}

// Get URL from command line argument
const url = process.argv[2] || 'https://174f77a8.retain-flow.pages.dev';
const outputPath = process.argv[3] || 'screenshot.png';

takeScreenshot(url, outputPath).catch(console.error);
