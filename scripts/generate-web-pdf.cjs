const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function generatePDF() {
  const url = 'http://localhost:3000/company-profile';
  const outputPath = path.join(process.cwd(), 'public', 'MaxIT_Company_Profile.pdf');

  console.log(`Starting PDF generation from ${url}...`);

  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    
    // Set a large viewport to ensure desktop layout
    await page.setViewport({ width: 1440, height: 900 });

    console.log('Navigating to page...');
    // Wait until network is fully idle (all images/fonts loaded)
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

    // Scroll to the bottom to trigger any lazy-loaded images or animations
    console.log('Scrolling to trigger lazy loads...');
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 100;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });

    // Scroll back to top
    await page.evaluate(() => window.scrollTo(0, 0));
    
    // Small wait to ensure final paints are done
    await new Promise(r => setTimeout(r, 1000));

    console.log('Generating PDF...');
    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });

    await browser.close();
    console.log(`Successfully saved PDF to ${outputPath}`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    process.exit(1);
  }
}

generatePDF();
