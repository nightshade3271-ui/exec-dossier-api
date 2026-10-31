/**
 * ExecDossier Intelligence Engine
 * 
 * High-precision executive psychographic analysis, buying trigger profiling,
 * objection anticipation, and cold-pitch personalization.
 */

const ROLE_TAXONOMY = {
  engineering: {
    titles: ['cto', 'vp of engineering', 'vp engineering', 'head of engineering', 'chief technology officer', 'lead architect', 'director of engineering', 'tech lead'],
    archetype: 'The System Stability & Velocity Architect',
    seniority: 'C-Suite / VP',
    budget_authority: 'Primary Technical Budget Owner',
    attention_span: 'Under 40 seconds (Strict mobile-skimmer)',
    decision_style: 'Metrics-driven, allergic to buzzwords, hyper-focused on tech debt, reliability, and developer bandwidth.',
    pain_points: [
      'Engineers spending 30%+ of sprints on maintenance and glue code instead of revenue-generating features.',
      'Hidden infrastructure sprawl and unpredictable cloud egress bills.',
      'Slowing sprint velocity as codebases scale and legacy dependencies compound.'
    ],
    buzzwords_to_avoid: ['game-changing AI paradigm', 'synergy', 'turnkey revolution', 'disruptive transformation'],
    golden_triggers: ['zero-migration downtime', 'reduced MTTR', 'dev-hours saved', 'latency benchmarks', 'open-source compatibility'],
    anticipated_objection: 'Our engineering roadmap is locked for Q3/Q4 and we prefer building in-house.',
    counter_reframe: 'Totally get that—most teams we work with felt the exact same way until they saw that building this in-house diverted 2 senior engineers for 5 months. Worth seeing the ROI comparison?'
  },
  finance: {
    titles: ['cfo', 'chief financial officer', 'vp of finance', 'vp finance', 'controller', 'head of finance', 'director of finance'],
    archetype: 'The Fiscal Sentinel & EBITDA Guardian',
    seniority: 'C-Suite / VP',
    budget_authority: 'Ultimate Spending Sign-Off & ROI Auditor',
    attention_span: 'Under 30 seconds (Cares exclusively about EBITDA impact, payback periods, and risk containment)',
    decision_style: 'Ruthlessly quantitative. Does not care about features; cares about margin expansion, cash burn reduction, and rapid payback periods.',
    pain_points: [
      'Uncontrolled SaaS sprawl with recurring subscriptions sitting unused across fragmented teams.',
      'Inaccurate forecasting and lagging financial visibility into operational overhead.',
      'Long payback horizons (>6 months) that drag down working capital.'
    ],
    buzzwords_to_avoid: ['innovative experience', 'holistic platform', 'future-proof vision', 'culture enhancement'],
    golden_triggers: ['payback in under 60 days', 'direct OpEx reduction', 'bottom-line EBITDA impact', 'contract consolidation', 'cash flow neutral'],
    anticipated_objection: 'We are in a strict cash conservation mode and all non-essential software spend is frozen.',
    counter_reframe: 'Understood. We actually only work with CFOs when the implementation is net-cash-positive in month 1 by replacing 2 existing bloated vendors. If it doesn’t pay for itself immediately, you shouldn’t do it.'
  },
  sales: {
    titles: ['cro', 'chief revenue officer', 'vp of sales', 'vp sales', 'head of sales', 'director of sales', 'director of revenue'],
    archetype: 'The Pipeline Velocity & Quota Maximizer',
    seniority: 'C-Suite / VP',
    budget_authority: 'Aggressive Budget Allocator for Revenue Lift',
    attention_span: 'Under 25 seconds (Scans on smartphone between pipeline reviews)',
    decision_style: 'Goal-oriented, impatient with theory, heavily incentivized by rep ramp time, win rates, and quarterly quota attainment.',
    pain_points: [
      'Reps spending more than 40% of their day manually researching leads instead of speaking to buyers.',
      'Low connect and reply rates from stale, generic outbound campaigns.',
      'Deals slipping across quarters due to lack of multi-threaded buyer engagement.'
    ],
    buzzwords_to_avoid: ['comprehensive data ecosystem', 'machine learning infrastructure', 'complex integration requirements'],
    golden_triggers: ['reps booked +35% more pipeline', 'shortened deal cycles', 'instant CRM enrichment', 'higher connect rates', 'zero rep ramp time'],
    anticipated_objection: 'We already use ZoomInfo / Apollo / Salesloft and our tech stack is set.',
    counter_reframe: 'Completely agree—we don’t replace your sequencer or contact database. We plug into them to turn your reps’ generic cold emails into personalized pitches that actually get opened. Worth a 2-minute look?'
  },
  marketing: {
    titles: ['cmo', 'chief marketing officer', 'vp of marketing', 'vp marketing', 'head of marketing', 'growth lead', 'director of marketing', 'vp growth'],
    archetype: 'The CAC Compressor & Brand Growth Catalyst',
    seniority: 'C-Suite / VP',
    budget_authority: 'Primary Growth & Demand Gen Budget Owner',
    attention_span: 'Under 45 seconds (Appreciates clean copy, storytelling, and demonstrable attribution)',
    decision_style: 'Balances brand positioning with ruthless pipeline attribution. Sensitive to wasted ad spend and lead leakage.',
    pain_points: [
      'Skyrocketing CAC and diminishing returns on traditional paid channels.',
      'Disconnect between marketing qualified leads (MQLs) and sales pipeline conversion.',
      'Content and messaging fatigue where cold campaigns look identical to competitors.'
    ],
    buzzwords_to_avoid: ['best-in-class multi-channel synergy', 'seamless storytelling suite'],
    golden_triggers: ['lowered customer acquisition cost', 'higher lead-to-opportunity conversion', 'ABM personalization at scale', 'organic pipeline lift'],
    anticipated_objection: 'We generate plenty of leads; our issue is sales closing them.',
    counter_reframe: 'That’s the exact reason we built this—to deliver pre-warmed, psychographically profiled buyer intelligence to your sales team so marketing pipeline actually converts instead of stalling in the funnel.'
  },
  founder: {
    titles: ['founder', 'ceo', 'chief executive officer', 'co-founder', 'owner', 'managing partner', 'principal'],
    archetype: 'The Visionary Builder & High-Beta Operator',
    seniority: 'Executive Founder / CEO',
    budget_authority: 'Complete Discretionary Authority',
    attention_span: 'Under 35 seconds (Hyper-focused on enterprise valuation, growth bottlenecks, and talent leverage)',
    decision_style: 'Intuitive yet pragmatic. Respects peer founders, brutal honesty, and high-leverage shortcuts that buy back executive time.',
    pain_points: [
      'Being the primary bottleneck in sales, hiring, or operations.',
      'Burning runway or capital on slow, non-differentiated distribution methods.',
      'Competitors moving faster due to superior tooling and automation.'
    ],
    buzzwords_to_avoid: ['enterprise roadmap consultation', 'scalable vendor paradigm', 'end-to-end enablement'],
    golden_triggers: ['buys back 10+ hours a week', 'tested by peer founders', 'immediate distribution advantage', 'direct margin improvement'],
    anticipated_objection: 'I’m too busy right now, delegate this to someone on my team.',
    counter_reframe: 'Totally fair. Who on your team owns pipeline velocity right now that I should share the 2-minute overview with so your calendar stays clear?'
  },
  people: {
    titles: ['chief people officer', 'cpo', 'vp of people', 'head of people', 'head of hr', 'vp hr', 'vp talent', 'director of talent'],
    archetype: 'The Retention, Culture & Efficiency Steward',
    seniority: 'C-Suite / VP',
    budget_authority: 'People Ops & HR Tech Budget Owner',
    attention_span: 'Under 45 seconds (Values relational tone, employee experience, and legal/compliance peace of mind)',
    decision_style: 'People-first, cautious regarding culture disruption, highly attuned to burnout and employee retention metrics.',
    pain_points: [
      'Talent burnout and attrition in key leadership roles.',
      'Manual, repetitive administrative onboarding tasks draining HR bandwidth.',
      'Difficulty demonstrating measurable ROI on engagement programs to the CEO/CFO.'
    ],
    buzzwords_to_avoid: ['human capital disruption', 'workforce monetization', 'aggressive productivity squeezing'],
    golden_triggers: ['improved retention rates', 'reduced onboarding friction', 'zero administrative burnout', 'seamless compliance'],
    anticipated_objection: 'We just rolled out a new HRIS and our team has zero bandwidth for new tools.',
    counter_reframe: 'Understood—the last thing you need is another complex platform to manage. This requires zero employee training and runs quietly in the background. Worth seeing how peer teams set it up in 10 minutes?'
  }
};

/**
 * Identify role category from title
 */
function classifyRole(title = '') {
  const t = title.toLowerCase();
  for (const [key, category] of Object.entries(ROLE_TAXONOMY)) {
    if (category.titles.some(match => t.includes(match))) {
      return { key, category };
    }
  }
  
  // Default General Executive
  return {
    key: 'general_executive',
    category: {
      archetype: 'The Strategic Operator & Value Maximizer',
      seniority: 'Executive / Leadership',
      budget_authority: 'Departmental Budget Decision Maker',
      attention_span: 'Under 40 seconds',
      decision_style: 'Pragmatic, outcome-oriented, evaluates tools based on measurable efficiency gains.',
      pain_points: [
        'Bandwidth constraints and operational bottlenecks slowing execution.',
        'Difficulty isolating high-leverage initiatives from routine noise.',
        'Vendor fatigue with tools that promise scale but require heavy maintenance.'
      ],
      buzzwords_to_avoid: ['disruptive synergy', 'holistic digital transformation', 'paradigm shift'],
      golden_triggers: ['measurable ROI', 'zero-overhead setup', 'tested by peer leaders', 'hours saved weekly'],
      anticipated_objection: 'Send me some information and I’ll take a look when things slow down.',
      counter_reframe: 'Happy to send over a 1-page summary. To make sure it’s actually relevant and not a waste of your time, what’s your single biggest focus this quarter?'
    }
  };
}

/**
 * Generate Hyper-Personalized Cold Outreach Icebreakers
 */
function generateIcebreakers({ name = '', title = '', company = '', industry = '', customContext = '' }) {
  const firstName = name.trim().split(' ')[0] || 'there';
  const org = company.trim() || 'your company';
  const role = title.trim() || 'leader';
  const ind = industry.trim() || 'your industry';

  return {
    hook_operational_friction: `Hi ${firstName}, noticed your work leading ${role} at ${org}. Most ${role}s in ${ind} tell us their biggest headache right now is keeping team output high without drowning in operational drag. Built a brief 2-minute benchmark on how peer teams are handling this—open to taking a look?`,
    
    hook_peer_benchmark: `Hi ${firstName}, congrats on the momentum at ${org}. Given the recent shift across ${ind}, curious if your team has already adapted to the new pipeline benchmarks peer companies are seeing this quarter, or if you're keeping things lean in-house?`,
    
    hook_low_friction_ask: `Hi ${firstName}, quick question—if there was a way to give your team at ${org} 8+ hours back every week with zero software migration, would that be worth a quick look, or is your stack 100% locked right now?`,

    personalized_ps: `P.S. Love what you and the team are building at ${org}—excited to watch the next phase of growth.`
  };
}

/**
 * Main Profiling Method
 */
function analyzeExecutive({ name = '', title = '', company = '', industry = '', summary = '', recentPost = '' }) {
  const { key, category } = classifyRole(title);
  const icebreakers = generateIcebreakers({ name, title, company, industry, customContext: summary || recentPost });
  const firstName = name.trim().split(' ')[0] || 'Executive';
  const org = company.trim() || 'the organization';

  return {
    executive_summary: {
      target_name: name || 'Not specified',
      target_title: title || 'Executive Leader',
      target_company: company || 'Not specified',
      target_industry: industry || 'Technology & Business',
      archetype: category.archetype,
      seniority_tier: category.seniority,
      budget_authority_role: category.budget_authority
    },
    psychographic_profile: {
      attention_span: category.attention_span,
      decision_framework: category.decision_style,
      primary_quarterly_headaches: category.pain_points,
      pitching_rules: {
        fatal_buzzwords_to_avoid: category.buzzwords_to_avoid,
        high_resonance_triggers: category.golden_triggers,
        ideal_email_length_words: '50 to 85 words max'
      }
    },
    cold_outreach_intelligence: {
      icebreakers: [
        {
          angle: 'Operational Friction & Bandwidth',
          subject_line: `question re: ${title.toLowerCase() || 'leadership'} at ${company || 'team'}`,
          body_text: icebreakers.hook_operational_friction
        },
        {
          angle: 'Peer Benchmark & Competitive Advantage',
          subject_line: `${company || 'your team'} + ${industry || 'industry'} benchmark`,
          body_text: icebreakers.hook_peer_benchmark
        },
        {
          angle: 'Low-Friction Asynchronous Ask',
          subject_line: `quick idea for ${company || 'your team'}`,
          body_text: icebreakers.hook_low_friction_ask
        }
      ],
      recommended_ps_hook: icebreakers.personalized_ps
    },
    objection_strategy: {
      anticipated_pushback: category.anticipated_objection,
      battle_tested_counter_reframe: category.counter_reframe
    },
    phone_dialer_opener: `Hey ${firstName}, I know I caught you out of the blue. I’ll keep this under 20 seconds: I’m reaching out because we help ${title}s at ${industry || 'high-growth'} companies reclaim 8+ hours a week without changing their tech stack. Have 30 seconds to hear why, or should I let you run?`
  };
}

module.exports = { analyzeExecutive, generateDossier: analyzeExecutive, classifyRole, generateIcebreakers };
