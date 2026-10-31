const { generateIcebreakers, classifyRole } = require('../lib/intelligence.js');
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

    const name = body.name || '';
    const title = body.title || 'Leader';
    const company = body.company || 'your team';
    const industry = body.industry || 'Tech & Growth';

    const icebreakers = generateIcebreakers({ name, title, company, industry });
    const { category } = classifyRole(title);

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=43200');
    res.statusCode = 200;
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
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 400;
    res.end(JSON.stringify({
      error: 'Icebreaker generation failed',
      details: err.message
    }));
  }
};

