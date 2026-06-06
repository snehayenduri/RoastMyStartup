/* ============================================================
   IdeaRoast AI — AI JS
   OPENAI API integration, prompt templates, report generation
   ============================================================ */

window.AIManager = (function () {
  const MODEL = 'gpt-4.1-mini';

  function getApiKey() {
    return localStorage.getItem('idearoast_apikey') || '';
  }

  // ─── Personality Prompts ───────────────────────────────────
  const PERSONALITIES = {
    vc: {
      name: 'Venture Capitalist',
      lens: `You are a seasoned Silicon Valley venture capitalist who has invested in 200+ startups.
You evaluate deals based on market size, defensibility, team, and path to a 100x return.
You are direct, data-driven, and have zero tolerance for hand-waving on market size or distribution.`,
    },
    yc: {
      name: 'YC Partner',
      lens: `You are a YC partner who has reviewed 10,000+ applications.
You think in terms of: Is this solving a real problem? Does the founder understand their users deeply?
Is this something people want? You value focus, speed, and direct founder-market fit.`,
    },
    pm: {
      name: 'Product Manager',
      lens: `You are a senior product manager from a top tech company.
You evaluate product-market fit, user experience, feature prioritization, and execution risk.
You think in jobs-to-be-done frameworks and obsess over the critical user journey.`,
    },
    founder: {
      name: 'Experienced Founder',
      lens: `You are a 3x founder who has built and sold companies.
You speak from hard-won operational experience. You know what kills startups in the trenches:
hiring, cash flow, co-founder dynamics, and premature scaling.`,
    },
    growth: {
      name: 'Growth Marketer',
      lens: `You are a growth marketing expert who has scaled multiple companies from 0 to 1M users.
You think in channels, CAC, LTV, virality coefficients, and retention loops.
You immediately spot when a go-to-market strategy is unrealistic or relying on hope.`,
    },
  };

  // ─── Roast Level Tone ─────────────────────────────────────
  const ROAST_TONES = {
    mild:     'Be constructive and balanced. Point out issues but frame them as opportunities. Tone: supportive mentor.',
    investor: 'Be professionally critical. Give honest investor-grade feedback. Tone: experienced investor in a pitch meeting.',
    brutal:   'Be brutally honest. Do not sugarcoat. Call out every weak assumption. Tone: ruthless critic who has seen a thousand of these fail.',
    nuclear:  'DESTROY this idea with facts and logic. Be mercilessly honest. Find every fatal flaw. Assume nothing is validated. Tone: someone who will not let their friend waste 2 years on a bad idea.',
  };

  // ─── Build Prompt ─────────────────────────────────────────
  function buildPrompt(formData) {
    const personality = PERSONALITIES[formData.personality] || PERSONALITIES.vc;
    const tone = ROAST_TONES[formData.roastLevel] || ROAST_TONES.brutal;

    return `${personality.lens}

${tone}

You are analyzing the following startup idea submitted for validation:

---
STARTUP NAME: ${formData.startupName}
ONE-LINE IDEA: ${formData.oneLiner}
PROBLEM STATEMENT: ${formData.problem}
TARGET CUSTOMER: ${formData.targetCustomer}
REVENUE MODEL: ${formData.revenueModel}
WHY NOW: ${formData.whyNow || 'Not specified'}
EXISTING COMPETITORS: ${formData.competitors || 'Not specified'}
FOUNDER BACKGROUND: ${formData.founderBackground || 'Not specified'}
CUSTOMER VALIDATION: ${formData.customerValidation === 'yes' ? 'Yes, completed' : 'No validation yet'}
CURRENT STAGE: ${formData.currentStage}
---

Provide a COMPREHENSIVE, DETAILED startup validation report. Be specific, reference real market dynamics, name real competitor companies, and provide actionable recommendations.

CRITICAL: Respond ONLY with valid, complete JSON. No markdown, no explanation outside JSON. Use this exact schema:

{
  "executiveSummary": "3-4 sentence executive summary of the startup idea and your overall assessment",
  "verdict": "GO" | "GO_WITH_CHANGES" | "DONT_BUILD",
  "verdictReason": "1-2 sentence explanation of the verdict",
  "scores": {
    "problem": <integer 0-100>,
    "market": <integer 0-100>,
    "competition": <integer 0-100>,
    "founderFit": <integer 0-100>,
    "distribution": <integer 0-100>,
    "aiNecessity": <integer 0-100>,
    "overall": <integer 0-100>
  },
  "brutalRoast": {
    "topRisks": ["risk 1", "risk 2", "risk 3"],
    "weakAssumptions": ["assumption 1", "assumption 2", "assumption 3"],
    "failureReasons": ["reason 1", "reason 2", "reason 3"]
  },
  "positiveSignals": {
    "opportunities": ["opportunity 1", "opportunity 2", "opportunity 3"],
    "founderStrengths": ["strength 1", "strength 2"],
    "timingAdvantages": ["advantage 1", "advantage 2"]
  },
  "competitorAnalysis": [
    {"name": "Competitor Name", "description": "Brief description", "threat": "high" | "medium" | "low"},
    {"name": "Competitor Name", "description": "Brief description", "threat": "high" | "medium" | "low"},
    {"name": "Competitor Name", "description": "Brief description", "threat": "high" | "medium" | "low"}
  ],
  "goToMarket": {
    "first10": "Specific tactical strategy to get your first 10 customers",
    "first100": "Specific strategy to get from 10 to 100 customers",
    "first1000": "Strategy to scale from 100 to 1000 customers"
  },
  "mvpRecommendation": {
    "mustBuild": ["feature 1", "feature 2", "feature 3"],
    "niceToHave": ["feature 1", "feature 2"],
    "avoid": ["feature to avoid 1", "feature to avoid 2"]
  },
  "revenueStrategy": "Detailed paragraph on the optimal revenue strategy, pricing, and monetization path",
  "successProbability": {
    "percentage": <integer 0-100>,
    "rationale": "2-3 sentence rationale for this probability estimate"
  },
  "rebuildMode": {
    "strongerVersions": [
      {"title": "Version name", "description": "How to make this idea 10x stronger"},
      {"title": "Version name", "description": "Alternative stronger angle"},
      {"title": "Version name", "description": "Another stronger direction"}
    ],
    "nicheVersions": [
      {"title": "Niche name", "description": "Specific niche to dominate first"},
      {"title": "Niche name", "description": "Another profitable niche"},
      {"title": "Niche name", "description": "A third niche opportunity"}
    ],
    "pivotOpportunities": [
      {"title": "Pivot name", "description": "How this could pivot to a better business"},
      {"title": "Pivot name", "description": "Alternative pivot direction"},
      {"title": "Pivot name", "description": "A third pivot opportunity"}
    ]
  }
}`;
  }

  // ─── Call OPENAI API ──────────────────────────────────────
  async function generateReport(formData) {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error('No API key configured');

    const prompt = buildPrompt(formData);

    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini",
          input: prompt,
          temperature: 0.85,
          max_output_tokens: 4096
        })
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err?.error?.message || `OpenAI API error: ${response.status}`);
    }

    const data = await response.json();

    const text =
      data?.output?.[0]?.content?.[0]?.text ||
      data?.output_text;

    if (!text) throw new Error("Empty response from AI");

    // clean JSON
    let jsonStr = text.trim();
    jsonStr = jsonStr.replace(/^```json\s*/i, "")
                    .replace(/^```\s*/i, "")
                    .replace(/```\s*$/i, "");

    try {
      return JSON.parse(jsonStr);
    } catch (e) {
      const match = jsonStr.match(/\{[\s\S]*\}/);
      if (match) return JSON.parse(match[0]);
      throw new Error("Could not parse GPT response as JSON.");
    }
  }
  // ─── Demo Mode (no API key) ───────────────────────────────
  function getDemoReport(formData) {
    return {
      executiveSummary: `${formData.startupName} addresses a real pain point in the ${formData.targetCustomer} space. The idea shows potential but faces significant market education challenges and well-funded incumbents. With the right go-to-market strategy and a narrow initial focus, there's a viable path forward — but execution risk is high.`,
      verdict: 'GO_WITH_CHANGES',
      verdictReason: 'The core problem is real, but the current scope is too broad and the distribution strategy is underdeveloped.',
      scores: { problem: 72, market: 68, competition: 45, founderFit: 58, distribution: 42, aiNecessity: 65, overall: 58 },
      brutalRoast: {
        topRisks: [
          'No clear distribution moat — organic growth assumptions are dangerously optimistic',
          'Well-funded competitors (Salesforce, HubSpot) can clone this feature in one sprint',
          'Revenue model assumes enterprise willingness to pay that hasn\'t been validated',
        ],
        weakAssumptions: [
          'Assuming customers will switch from existing tools without a 10x improvement',
          'CAC estimates ignore the high cost of enterprise sales cycles (6-18 months)',
          'Market size projections conflate TAM with realistically addressable market',
        ],
        failureReasons: [
          'Running out of runway before achieving product-market fit (most common cause of death)',
          'Underestimating technical complexity leading to missed milestones',
          'Competing on features rather than distribution or unique data advantages',
        ],
      },
      positiveSignals: {
        opportunities: [
          'Massive fragmentation in the tools market creates genuine switching opportunity',
          'AI cost curves dropping 10x/year improves unit economics dramatically by 2025',
          'Remote work tailwinds continue to drive demand for async collaboration tools',
        ],
        founderStrengths: ['Domain expertise in the target market', 'Technical capability to build the MVP'],
        timingAdvantages: ['Post-ChatGPT AI acceptance curve is at inflection point', 'Legacy vendors haven\'t shipped meaningful AI features'],
      },
      competitorAnalysis: [
        { name: 'Notion', description: 'All-in-one workspace dominating the SMB segment with strong brand loyalty', threat: 'high' },
        { name: 'Linear', description: 'Premium product-led growth darling capturing eng teams rapidly', threat: 'medium' },
        { name: 'Coda', description: 'Document-meets-database attempting the same positioning', threat: 'medium' },
      ],
      goToMarket: {
        first10: 'Do things that don\'t scale. Identify 10 specific companies in your network whose CEO personally feels this pain. Offer free white-glove onboarding and get on calls weekly. Your first 10 users should feel like they have a dedicated co-founder-level product manager.',
        first100: 'Build a content flywheel around the specific workflow problem you solve. One high-quality case study from your first 10 customers + LinkedIn distribution from the CEO. Partner with 3 complementary tools for referral swaps. Target 2 specific industry Slack communities.',
        first1000: 'Productize the PLG loop: free tier with natural upgrade triggers at team collaboration. Launch on Product Hunt. Build an affiliate program targeting consultants and agencies who serve your ICP. Consider a small inside sales team once CAC < 3 months of revenue.',
      },
      mvpRecommendation: {
        mustBuild: ['Core problem-solving workflow (the one thing that makes users say "wow")', 'Basic team collaboration (comments, sharing)', 'Export/import from tools they already use'],
        niceToHave: ['Advanced analytics dashboard', 'Zapier/Make integrations', 'Mobile app'],
        avoid: ['Enterprise SSO/SAML before $1M ARR', 'Custom reporting engine', 'AI features that aren\'t 10x better than ChatGPT'],
      },
      revenueStrategy: `Start with a freemium model: generous free tier (up to 3 users, core features) to drive PLG adoption, then charge $15-25/user/month for team features. Resist the temptation to go enterprise early — your sales motion isn't ready and you'll distort your product roadmap. Once you have 50+ paying teams, identify the 5 that are growing fastest and offer them an annual plan at 20% discount. Use that ARR predictability to hire your first sales hire at month 18.`,
      successProbability: {
        percentage: 23,
        rationale: `Base rate for venture-scale startups succeeding is ~10%, and this idea gets above-average marks for timing and problem clarity. The probability is held back by an underdeveloped distribution strategy and heavily contested competitive landscape. Improving founder-market fit evidence and narrowing the ICP would move this to 35%+.`,
      },
      rebuildMode: {
        strongerVersions: [
          { title: 'Vertical SaaS Play', description: `Instead of being horizontal, go deep on one industry (e.g., ${formData.targetCustomer}). Build features that are so specific to that vertical that Salesforce can't justify copying them. Charge 3x more.` },
          { title: 'API-First Infrastructure', description: 'Rebuild as developer infrastructure that other SaaS companies build on top of. Lower CAC, higher NRR, defensible through network effects and switching costs.' },
          { title: 'Marketplace + SaaS Hybrid', description: 'Add a marketplace layer where your best users can offer their services/templates to others. Creates organic growth loop and additional revenue stream.' },
        ],
        nicheVersions: [
          { title: 'Healthcare Operations Teams', description: 'HIPAA-compliant version targeting hospital admin teams. Premium pricing ($50-100/user), longer sales cycles but much less competition and huge CAC efficiency from warm referrals.' },
          { title: 'VC-Backed Startup Teams', description: 'Target Series A-B startups specifically. They have budget, move fast, love new tools, and are great reference customers who spread word fast.' },
          { title: 'Government & Public Sector', description: 'FedRAMP-authorized version. Painful to build but creates near-permanent switching costs once in. Small customer count but massive contract values.' },
        ],
        pivotOpportunities: [
          { title: 'Become the Data Layer', description: 'Pivot to being the connective tissue between all the tools your users already use. Revenue from API calls rather than seats. Much more defensible once you have the integrations.' },
          { title: 'Professional Services + Software', description: 'Lead with consulting to understand the problem deeply, then productize the most repeatable solution. Cash flow positive from day one while you build the product.' },
          { title: 'AI Automation for the Use Case', description: 'Drop the SaaS wrapper entirely and build an AI agent that fully automates the workflow. Charge per outcome rather than per seat. Dramatically different economics.' },
        ],
      },
    };
  }

  return { generateReport, getDemoReport, PERSONALITIES, ROAST_TONES };
})();
