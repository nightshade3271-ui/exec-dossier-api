const { analyzeExecutive } = require('../lib/intelligence.js');
const { verifyRapidApi } = require('../lib/auth.js');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-RapidAPI-Key, X-RapidAPI-Host, X-RapidAPI-Proxy-Secret');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  // RapidAPI Paywall Validation
  if (!verifyRapidApi(req, res)) {
    return;
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      body = JSON.parse(body || '{}');
    } else if (!body) {
      body = {};
    }

    const name = body.name || body.executive_name || '';
    const title = body.title || body.job_title || body.role || 'Executive';
    const company = body.company || body.company_name || '';
    const industry = body.industry || '';
    const summary = body.summary || body.bio || body.headline || '';
    const recentPost = body.recent_post || body.post_content || '';

    const dossier = analyzeExecutive({
      name,
      title,
      company,
      industry,
      summary,
      recentPost
    });

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=43200');
    res.statusCode = 200;
    res.end(JSON.stringify({
      success: true,
      data: dossier
    }, null, 2));

  } catch (err) {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 400;
    res.end(JSON.stringify({
      error: 'Analysis failed',
      details: err.message
    }));
  }
};

