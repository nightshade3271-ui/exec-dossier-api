const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const acceptsHtml = (req.headers.accept && req.headers.accept.includes('text/html')) || req.query?.format === 'html';
  const wantsJson = req.query?.format === 'json';

  if (acceptsHtml && !wantsJson) {
    try {
      const htmlPath = path.join(process.cwd(), 'public', 'index.html');
      const rootHtmlPath = path.join(process.cwd(), 'index.html');
      const target = fs.existsSync(htmlPath) ? htmlPath : rootHtmlPath;
      if (fs.existsSync(target)) {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.statusCode = 200;
        res.end(fs.readFileSync(target, 'utf8'));
        return;
      }
    } catch (e) {}
  }

  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 200;
  res.end(JSON.stringify({
    status: 'online',
    product: 'ExecDossier API - Executive Psychographic Profiling & Cold-Pitch Intelligence',
    version: '1.0.0',
    endpoints: [
      'POST /v1/dossier/analyze',
      'POST /v1/pitch/icebreaker',
      'GET /v1/dossier/sample'
    ]
  }, null, 2));
};

