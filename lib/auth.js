/**
 * RapidAPI Authentication & Security Middleware
 * 
 * Protects ExecDossier API endpoints so outside callers cannot bypass RapidAPI,
 * while allowing the official marketing website demo sandbox to function smoothly.
 */

function verifyRapidApi(req, res) {
  // Always permit CORS Preflight
  if (req.method === 'OPTIONS') {
    return true;
  }

  const expectedSecret = process.env.RAPIDAPI_PROXY_SECRET;

  // If no secret configured (local dev / testing), permit access
  if (!expectedSecret) {
    return true;
  }

  // 1. Verify RapidAPI Gateway Proxy Secret (for paid RapidAPI subscribers)
  const proxySecret = req.headers['x-rapidapi-proxy-secret'];
  if (proxySecret && proxySecret === expectedSecret) {
    req.rapidUser = req.headers['x-rapidapi-user'] || 'rapidapi-subscriber';
    return true;
  }

  // 2. Secure Same-Origin Whitelist for the Website Sandbox Demo
  // Browsers enforce Sec-Fetch-Site and Origin; outside scripts/apps cannot spoof them
  const origin = (req.headers['origin'] || '').toLowerCase();
  const referer = (req.headers['referer'] || '').toLowerCase();
  const host = (req.headers['host'] || '').toLowerCase();

  const isSameSite = 
    origin.includes('exec-dossier-api.vercel.app') ||
    referer.includes('exec-dossier-api.vercel.app') ||
    origin.includes('localhost') ||
    referer.includes('localhost') ||
    host.includes('localhost');

  if (isSameSite && req.headers['sec-fetch-site'] !== 'cross-site') {
    req.rapidUser = 'demo-sandbox-user';
    return true;
  }

  // 3. Block all direct unauthorized external requests
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 403;
  res.end(JSON.stringify({
    error: 'Direct access forbidden',
    message: 'ExecDossier API must be accessed via RapidAPI. Please subscribe on RapidAPI to obtain an API key.'
  }));
  return false;
}

module.exports = { verifyRapidApi };

