const { analyzeExecutive } = require('../lib/intelligence.js');

// In-memory rate limiter for the public website sandbox
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 6;      // Max 6 requests per minute per IP

function isRateLimited(ip) {
  const now = Date.now();
  const record = rateLimitMap.get(ip) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };

  if (now > record.resetAt) {
    record.count = 1;
    record.resetAt = now + RATE_LIMIT_WINDOW_MS;
    rateLimitMap.set(ip, record);
    return false;
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  record.count += 1;
  rateLimitMap.set(ip, record);
  return false;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  // 1. Verify Browser Origin & Sec-Fetch-Site (anti-cURL / anti-scraper)
  const origin = (req.headers['origin'] || '').toLowerCase();
  const referer = (req.headers['referer'] || '').toLowerCase();
  const secFetchSite = (req.headers['sec-fetch-site'] || '').toLowerCase();

  const isTrustedWebsite =
    origin.includes('exec-dossier-api.vercel.app') ||
    referer.includes('exec-dossier-api.vercel.app') ||
    origin.includes('localhost') ||
    referer.includes('localhost');

  // Real browsers always set sec-fetch-site to 'same-origin' when calling their own domain
  if (!isTrustedWebsite || (secFetchSite && secFetchSite !== 'same-origin')) {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 403;
    res.end(JSON.stringify({
      error: 'Direct access forbidden',
      message: 'The interactive demo is only accessible via the official website UI. For programmatic API access, subscribe on RapidAPI.',
      marketplace: 'https://rapidapi.com'
    }));
    return;
  }

  // 2. IP Rate Limiting to prevent scraping abuse
  const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  if (isRateLimited(clientIp)) {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 429;
    res.end(JSON.stringify({
      error: 'Demo limit reached',
      message: 'You have reached the demo rate limit (6 tests/minute). For high-volume API access, subscribe on RapidAPI.'
    }));
    return;
  }

  // 3. Process demo payload
  try {
    let body = req.body;
    if (typeof body === 'string') {
      body = JSON.parse(body || '{}');
    } else if (!body) {
      body = {};
    }

    const name = body.name || 'Executive';
    const title = body.title || 'Leader';
    const company = body.company || 'Enterprise';
    const industry = body.industry || 'Technology';

    const dossier = analyzeExecutive({ name, title, company, industry });

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.statusCode = 200;
    res.end(JSON.stringify({ success: true, is_demo: true, data: dossier }));
  } catch (err) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Demo processing failed', details: err.message }));
  }
};
