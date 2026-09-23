const {join} = require('path');

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Changes the cache location for Puppeteer to the local project directory
  // This ensures Chrome is properly cached in Docker environments like Coolify
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
};
