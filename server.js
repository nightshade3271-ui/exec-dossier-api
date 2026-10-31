const http = require('http');
const fs = require('fs');
const path = require('path');
const { analyzeExecutive, generateIcebreakers, classifyRole } = require('./lib/intelligence.js');

const PORT = 3044;

const server = http.createServer((req, res) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-RapidAPI-Key, X-RapidAPI-Host, X-RapidAPI-Proxy-Secret',
    'Access-Control-Max-Age': '86400'
  };

  Object.entries(corsHeaders).forEach(([h, v]) => res.setHeader(h, v));

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const forwarded = req.headers['x-forwarded-uri'] || req.headers['x-matched-path'] || req.headers['x-original-url'];
  const rawPath = forwarded || url.pathname;
  const p = rawPath.split('?')[0].toLowerCase();

  // 1. POST /v1/dossier/analyze
  if ((p === '/v1/dossier/analyze' || p === '/api/analyze' || p.endsWith('/dossier/analyze')) && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const name = payload.name || payload.executive_name || '';
        const title = payload.title || payload.job_title || payload.role || 'Executive';
        const company = payload.company || payload.company_name || '';
        const industry = payload.industry || '';
        const summary = payload.summary || payload.bio || payload.headline || '';
        const recentPost = payload.recent_post || payload.post_content || '';

        const dossier = analyzeExecutive({ name, title, company, industry, summary, recentPost });

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: true, data: dossier }, null, 2));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Analysis failed', details: err.message }));
      }
    });
    return;
  }

  // 2. POST /v1/pitch/icebreaker
  if ((p === '/v1/pitch/icebreaker' || p === '/api/icebreaker' || p.endsWith('/pitch/icebreaker')) && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const name = payload.name || '';
        const title = payload.title || 'Leader';
        const company = payload.company || 'your team';
        const industry = payload.industry || 'Tech & Growth';

        const icebreakers = generateIcebreakers({ name, title, company, industry });
        const { category } = classifyRole(title);

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
          success: true,
          tags: {
            icebreaker_pain_point: icebreakers.hook_operational_friction,
            icebreaker_peer_benchmark: icebreakers.hook_peer_benchmark,
            icebreaker_low_friction: icebreakers.hook_low_friction_ask,
            personalized_ps: icebreakers.personalized_ps,
            suggested_subject_line: `quick question re: ${title.toLowerCase()} at ${company}`
          },
          quick_context: {
            archetype: category.archetype,
            ideal_length: '50-80 words',
            avoid_words: category.buzzwords_to_avoid.slice(0, 2)
          }
        }, null, 2));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Icebreaker generation failed', details: err.message }));
      }
    });
    return;
  }

  // 3. GET /v1/dossier/sample
  if (p === '/v1/dossier/sample' || p === '/api/sample' || p.endsWith('/dossier/sample')) {
    const sample = analyzeExecutive({
      name: 'Sarah Chen',
      title: 'VP of Engineering',
      company: 'FintechScale Systems',
      industry: 'Financial Technology SaaS',
      summary: 'Scaling core payment infrastructure from 5M to 50M daily transactions. Focused on zero-downtime migrations, developer velocity, and database resilience.'
    });
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ success: true, benchmark_persona: 'VP of Engineering (FinTech SaaS)', data: sample }, null, 2));
    return;
  }

  // 4. Root & Static Files
  if (url.pathname === '/' || url.pathname === '/index.html') {
    const isBrowser = (req.headers.accept && req.headers.accept.includes('text/html')) || !req.headers.accept;
    const htmlPath = path.join(__dirname, 'public', 'index.html');
    if (isBrowser && fs.existsSync(htmlPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(fs.readFileSync(htmlPath));
      return;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'online',
      product: 'ExecDossier API - Executive Psychographic Profiling & Cold-Pitch Intelligence',
      version: '1.0.0',
      endpoints: ['POST /v1/dossier/analyze', 'POST /v1/pitch/icebreaker', 'GET /v1/dossier/sample']
    }, null, 2));
    return;
  }

  // Static files in public
  const safePath = path.normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[\/\\])+/, '');
  const localFile = path.join(__dirname, 'public', safePath);
  if (fs.existsSync(localFile) && fs.statSync(localFile).isFile()) {
    const ext = path.extname(localFile).toLowerCase();
    const mimeTypes = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.svg': 'image/svg+xml',
      '.html': 'text/html',
      '.json': 'application/json'
    };
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    res.end(fs.readFileSync(localFile));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Endpoint not found', path: p }));
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`  ✦ ExecDossier API running on http://localhost:${PORT}`);
  console.log(`  ✦ Endpoint 1: POST http://localhost:${PORT}/v1/dossier/analyze`);
  console.log(`  ✦ Endpoint 2: POST http://localhost:${PORT}/v1/pitch/icebreaker`);
  console.log(`======================================================\n`);
});

