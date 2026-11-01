/**
 * RapidAPI Authentication & Security Middleware
 * 
 * Production endpoints strictly require the RapidAPI Proxy Secret.
 * Direct external calls to Vercel (scrapers, cURL, Python bots) are blocked with 403 Forbidden.
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

  // Strictly verify RapidAPI Gateway Proxy Secret
  const proxySecret = req.headers['x-rapidapi-proxy-secret'];
  if (proxySecret && proxySecret === expectedSecret) {
    req.rapidUser = req.headers['x-rapidapi-user'] || 'rapidapi-subscriber';
    return true;
  }

  // Block all direct external requests that bypass RapidAPI
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 403;
  res.end(JSON.stringify({
    error: 'Direct access forbidden',
    message: 'ExecDossier API must be accessed via RapidAPI. Direct requests to Vercel are blocked. Please subscribe on RapidAPI to obtain an API key.',
    marketplace: 'https://rapidapi.com'
  }));
  return false;
}

module.exports = { verifyRapidApi };
