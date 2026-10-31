const { analyzeExecutive } = require('../lib/intelligence.js');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  // Reference Benchmark Sample Dossier
  const sample = analyzeExecutive({
    name: 'Sarah Chen',
    title: 'VP of Engineering',
    company: 'FintechScale Systems',
    industry: 'Financial Technology SaaS',
    summary: 'Scaling core payment infrastructure from 5M to 50M daily transactions. Focused on zero-downtime migrations, developer velocity, and database resilience.'
  });

  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.statusCode = 200;
  res.end(JSON.stringify({
    success: true,
    benchmark_persona: 'VP of Engineering (FinTech SaaS)',
    data: sample
  }, null, 2));
};
