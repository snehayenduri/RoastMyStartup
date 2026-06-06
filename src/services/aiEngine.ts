import type { Startup, Report } from '../db/schema';

// Helper to generate score based on keywords and validation stage (mock/offline fallback)
const calculateScores = (startup: Startup, personality: string) => {
  let problem = 5;
  let market = 5;
  let competition = 4;
  let founderFit = 5;
  let distribution = 4;
  let aiNecessity = 3;

  const validationLower = startup.customerValidation.toLowerCase();
  if (validationLower.includes('intent') || validationLower.includes('beta') || validationLower.includes('paying')) {
    problem += 3;
    founderFit += 2;
  } else if (validationLower.includes('interviewed') || validationLower.includes('survey')) {
    problem += 2;
  } else if (validationLower.includes('none') || validationLower.length < 15) {
    problem -= 2;
  }

  const ideaLower = startup.oneLineIdea.toLowerCase() + ' ' + startup.problemStatement.toLowerCase();
  if (ideaLower.includes('ai') || ideaLower.includes('gpt') || ideaLower.includes('llm') || ideaLower.includes('artificial')) {
    aiNecessity = 8;
    market += 1;
  } else {
    aiNecessity = 2;
  }

  const compLower = startup.competitors.toLowerCase();
  if (compLower.includes('none') || compLower.includes('no competitors')) {
    competition = 2;
  } else {
    competition = Math.min(8, 4 + compLower.split(',').length);
  }

  const bgLower = startup.founderBackground.toLowerCase();
  if (bgLower.includes('engineer') || bgLower.includes('developer') || bgLower.includes('builder')) {
    founderFit += 2;
  }
  if (bgLower.includes('ex-') || bgLower.includes('manager') || bgLower.includes('experience')) {
    founderFit += 1;
  }

  const revLower = startup.revenueModel.toLowerCase();
  if (revLower.includes('saas') || revLower.includes('subscription')) {
    distribution += 1;
  }
  if (startup.targetCustomer.length > 50) {
    distribution -= 1;
  }

  if (personality === 'yc') {
    distribution = Math.max(1, distribution - 1);
  } else if (personality === 'vc') {
    market = Math.max(1, market - 1);
  } else if (personality === 'pm') {
    problem = Math.max(1, problem - 1);
  }

  const clamp = (val: number) => Math.max(1, Math.min(10, val));
  
  const finalScores = {
    problem: clamp(problem),
    market: clamp(market),
    competition: clamp(competition),
    founderFit: clamp(founderFit),
    distribution: clamp(distribution),
    aiNecessity: clamp(aiNecessity),
    overall: 0
  };

  const avg = (
    finalScores.problem +
    finalScores.market +
    finalScores.competition +
    finalScores.founderFit +
    finalScores.distribution
  ) / 5;

  finalScores.overall = Math.round(avg * 10) / 10;

  return finalScores;
};

// Generates the mock report (offline fallback)
const generateMockRoastReport = (
  startup: Startup,
  roastLevel: 'mild' | 'investor' | 'brutal' | 'nuclear',
  personality: 'yc' | 'vc' | 'pm' | 'founder' | 'marketer'
): Omit<Report, 'id' | 'userId' | 'createdAt'> => {
  const scores = calculateScores(startup, personality);
  const successProbability = Math.round(scores.overall * 10 - (roastLevel === 'nuclear' ? 15 : roastLevel === 'brutal' ? 5 : 0));
  const finalProb = Math.max(5, Math.min(95, successProbability));

  let intro = '';
  let risks: string[] = [];
  let assumptions: string[] = [];
  let failures: string[] = [];
  let opportunities: string[] = [];
  let strengths: string[] = [];
  let timing: string[] = [];
  let compText = '';
  let gtm10 = '';
  let gtm100 = '';
  let gtm1000 = '';
  let mustBuild: string[] = [];
  let niceBuild: string[] = [];
  let avoidBuild: string[] = [];
  let revText = '';
  let pivot1 = '', pivot2 = '', pivot3 = '';
  let niche1 = '', niche2 = '', niche3 = '';
  let strong1 = '', strong2 = '', strong3 = '';

  if (personality === 'yc') {
    intro = `YC Partner perspective: Let's look at this like we are in an YC interview. You want to build ${startup.name} targeting ${startup.targetCustomer}. Honestly, this feels like a classic "tarpit idea"—a problem that looks attractive on the surface but is incredibly hard to get traction for because you have no organic distribution edge.`;
    risks = [
      `No distribution leverage: You are selling to ${startup.targetCustomer}. Unless you have a proprietary channel, your CAC will exceed LTV immediately.`,
      `Over-engineered solution: The one-line idea "${startup.oneLineIdea}" does not require complex features. Do things that don't scale first.`,
      `Tarpit trap: Small users are notoriously bad customers. They churn constantly.`
    ];
    assumptions = [
      `Assumes ${startup.targetCustomer} actually care enough about this problem to change their daily habits.`,
      `Assumes your background ("${startup.founderBackground}") provides you with a distribution superpower.`
    ];
    failures = [
      `You spend 6 months building in stealth, launch, get 200 signups, and within 30 days, 95% of them have churned.`,
      `You fail to find a repeatable, scalable channel to acquire customers without burning capital.`
    ];
    opportunities = [
      `If you can get 10 high-value customers to pay you upfront, you prove real validation.`,
      `A lightweight utility that fits into existing workflows has a higher chance of virality.`
    ];
    strengths = [
      `You are close enough to the problem to draft a reasonable description of the pain point.`,
      `The current stage "${startup.currentStage}" is early enough to pivot without throwing away code.`
    ];
    timing = [
      `The global pressure on productivity means buyers are willing to adopt specialized software if it saves immediate hours.`
    ];
    compText = `You listed competitors as "${startup.competitors}". Frankly, your biggest competitor is inertia. If they are currently solving this with Excel, email, or a notepad, you are competing with their laziness. To win, your app must be 10x faster and easier than typing into a Google Sheet.`;
    gtm10 = `Do things that don't scale. Go to where ${startup.targetCustomer} hang out (subreddits, local stores, specific forums). Do the work manually for them for free to understand their exact friction.`;
    gtm100 = `Write content. Publish high-quality technical posts detailing how you solved the problem statement manually. Drive organic traffic to a waitlist.`;
    gtm1000 = `Build a referral loop directly into the app. Make it so when a user completes their workflow, they get incentivized to invite other coworkers.`;
    mustBuild = [
      `A single-page utility that solves one core part of the problem statement in under 60 seconds.`,
      `A dead-simple billing gateway (charge immediately to verify value).`
    ];
    niceBuild = [
      `A dashboard showing analytics.`,
      `Multi-tenant permissions and team support.`
    ];
    avoidBuild = [
      `Building native mobile apps.`,
      `Complex enterprise integrations or custom single sign-on (SSO) at this stage.`
    ];
    revText = `Charge a flat, high pricing early on. If they won't pay $49/month, they don't actually have the problem you think they have. Free tiers are a vanity metric that mask a lack of product-market fit.`;
    strong1 = `B2B API-first version: Package the core utility as an API that developers at larger companies can integrate.`;
    strong2 = `Enterprise Security Focus: Double down on private data protection and sell to corporate compliance officers.`;
    strong3 = `The "Superhuman" for this workflow: A highly-polished, keyboard-shortcut-driven desktop utility.`;
    niche1 = `Specialized solution targeting only high-margin consultancies.`;
    niche2 = `A version built exclusively for healthcare companies to comply with HIPAA.`;
    niche3 = `A localized version tailored for regional businesses in your specific metropolitan area.`;
    pivot1 = `Workflow analytics: Sell the diagnostic data that shows where the inefficiency occurs.`;
    pivot2 = `Agency service: Turn the software into an agency where you do the work for clients.`;
    pivot3 = `Community platform: Shift from a tool to a private community where these customers share templates.`;
  } else {
    // Generics for other agents when offline
    intro = `Review from ${personality.toUpperCase()} perspective on ${startup.name}. While you target ${startup.targetCustomer}, the core hypothesis "${startup.oneLineIdea}" has key assumptions that need rigorous testing before committing capital.`;
    risks = [
      `High acquisition costs relative to contract values.`,
      `High competitive intensity from ${startup.competitors || 'incumbents'}.`,
      `Product implementation complexity.`
    ];
    assumptions = [
      `Assumes target audience has an active, urgent budget for this problem.`,
      `Assumes user switching costs are low.`
    ];
    failures = [
      `Users sign up out of curiosity but fail to integrate the tool into their daily stack, leading to high churn.`,
      `Acquisition cost escalates too fast, making unit economics unsustainable.`
    ];
    opportunities = [
      `Expanding target customer definitions to high-margin niches.`,
      `Programmatic SEO content plays to capture high-intent search traffic.`
    ];
    strengths = [
      `Founder's background in "${startup.founderBackground}" provides baseline domain familiarity.`,
      `Low initial asset requirements to build the first MVP iteration.`
    ];
    timing = [
      `Recent shifts in remote collaboration and automation infrastructure.`
    ];
    compText = `Competing with "${startup.competitors || 'incumbents'}" requires a focused product scope. Do not build a feature-complete clone; solve one specific sub-problem 10x better than they do.`;
    gtm10 = `Leverage personal network and warm outreach to acquire 10 design partners.`;
    gtm100 = `Publish detailed case studies of the first 10 users to build organic trust.`;
    gtm1000 = `Build self-serve programmatic organic loops and integrations.`;
    mustBuild = [`Core workflow utility`, `Direct payment link`];
    niceBuild = [`Analytics dashboard`, `Collaborative editing`];
    avoidBuild = [`Enterprise SSO`, `Custom mobile applications`];
    revText = `Charge a flat subscription. Validate willingness to pay early to verify problem urgency.`;
    strong1 = `API-first developer platform`;
    strong2 = `Enterprise white-label solution`;
    strong3 = `Niche specialized SaaS application`;
    niche1 = `Targeting real estate agencies`;
    niche2 = `Tailored for marketing consultancies`;
    niche3 = `Specific workflow tool for developers`;
    pivot1 = `Data analytics service`;
    pivot2 = `Full-service consult agency`;
    pivot3 = `Content and templates marketplace`;
  }

  // Roast intensity adjustments
  if (roastLevel === 'mild') {
    intro = `Hey there! First off, congrats on taking the leap to validate ${startup.name}. Here is a constructive look at your concept: "${startup.oneLineIdea}". Let's break down where we can make it stronger.`;
    risks = risks.map(r => `💡 Consider: ${r.split(':')[0]}`);
  } else if (roastLevel === 'brutal') {
    intro = `Brutal Roast Mode: Okay, let's skip the polite tech-founder fluff. ${startup.name} is a textbook solution in search of a problem. One line: "${startup.oneLineIdea}". You're basically asking to burn through your savings. Here's exactly why you're going to struggle.`;
    risks = risks.map(r => `🔥 ${r.toUpperCase()}`);
  } else if (roastLevel === 'nuclear') {
    intro = `☢️ NUCLEAR ROAST ACTIVE ☢️: Please step away from the keyboard. Building ${startup.name} is an efficient way to turn your time and money into ashes. The one-line "${startup.oneLineIdea}" sounds like a generated buzzword salad. You have zero proprietary distribution, your target market is broke, and your competitors will crush you before you finish your coffee.`;
    risks = risks.map(r => `☢️ CRITICAL DANGER: ${r}`);
  }

  return {
    startupId: startup.id,
    roastLevel,
    personality,
    scorecard: scores,
    executiveSummary: intro,
    roastSection: {
      topRisks: risks,
      weakAssumptions: assumptions,
      failureReasons: failures
    },
    positiveSignals: {
      opportunities,
      strengths,
      timing
    },
    competitorAnalysis: compText,
    goToMarket: {
      first10: gtm10,
      first100: gtm100,
      first1000: gtm1000
    },
    mvpRecommendation: {
      mustBuild,
      niceToHave: niceBuild,
      avoid: avoidBuild
    },
    revenueStrategy: revText,
    successProbability: finalProb,
    rebuildMode: {
      strongerVersions: [strong1, strong2, strong3],
      nicheVersions: [niche1, niche2, niche3],
      pivotOpportunities: [pivot1, pivot2, pivot3]
    }
  };
};

// Main Export calling OPENAI API with offline fallback
export const generateRoastReport = async (
  startup: Startup,
  roastLevel: 'mild' | 'investor' | 'brutal' | 'nuclear',
  personality: 'yc' | 'vc' | 'pm' | 'founder' | 'marketer'
): Promise<Omit<Report, 'id' | 'userId' | 'createdAt'>> => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey || apiKey.includes('PLACEHOLDER') || apiKey.length < 10) {
    console.warn('VITE_OPENAI_API_KEY not found or invalid. Falling back to offline engine.');
    return generateMockRoastReport(startup, roastLevel, personality);
  }

  const systemInstructions = `
You are a startup validator that generates brutally honest reports in JSON format.
You simulate a specific startup council personality perspective: YC Partner (cynical, growth-obsessed), Venture Capitalist (market scale, exit size, TAM metrics), Product Manager (onboarding friction, feature bloat, TTV), Experienced Founder (sanity checks, operation overhead, cash burn), or Growth Marketer (acquisition loops, organic virality, conversion metrics).
Depending on the requested Roast Level (mild: supportive and constructive; investor: professional and objective; brutal: direct and blunt; nuclear: completely merciless and critical), adjust the tone of the "executiveSummary", "roastSection", and "competitorAnalysis".
  `.trim();

  const userPrompt = `
Generate a startup roast report for:
Startup Name: ${startup.name}
One-Line Idea: ${startup.oneLineIdea}
Problem Statement: ${startup.problemStatement}
Target Customer: ${startup.targetCustomer}
Revenue Model: ${startup.revenueModel}
Why Now: ${startup.whyNow}
Competitors: ${startup.competitors}
Founder Background: ${startup.founderBackground}
Customer Validation: ${startup.customerValidation}
Current Stage: ${startup.currentStage}

Parameters:
Roast Severity Level: ${roastLevel}
AI Persona Perspective: ${personality}

Return a valid JSON object matching the schema below. Do NOT wrap it in markdown. Do NOT include any text other than the raw JSON.

{
  "startupId": "${startup.id}",
  "roastLevel": "${roastLevel}",
  "personality": "${personality}",
  "scorecard": {
    "problem": number (1-10 value assessing problem urgency),
    "market": number (1-10 value assessing TAM size),
    "competition": number (1-10 value assessing intensity),
    "founderFit": number (1-10 value assessing relevant expertise),
    "distribution": number (1-10 value assessing scale ease),
    "aiNecessity": number (1-10 value assessing AI relevance),
    "overall": number (weighted average, 1-10)
  },
  "executiveSummary": "string (the main roast / review intro written in the style of the chosen personality at the selected roast level)",
  "roastSection": {
    "topRisks": ["string", "string", "string"],
    "weakAssumptions": ["string", "string"],
    "failureReasons": ["string", "string"]
  },
  "positiveSignals": {
    "opportunities": ["string", "string"],
    "strengths": ["string", "string"],
    "timing": ["string"]
  },
  "competitorAnalysis": "string",
  "goToMarket": {
    "first10": "string (how to get the first 10 customers)",
    "first100": "string (how to get the first 100 customers)",
    "first1000": "string (how to get the first 1000 customers)"
  },
  "mvpRecommendation": {
    "mustBuild": ["string", "string"],
    "niceToHave": ["string", "string"],
    "avoid": ["string", "string"]
  },
  "revenueStrategy": "string",
  "successProbability": number (5-95 value),
  "rebuildMode": {
    "strongerVersions": ["string", "string", "string"],
    "nicheVersions": ["string", "string", "string"],
    "pivotOpportunities": ["string", "string", "string"]
  }
}
  `.trim();

  try {
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
          input: [
            {
              role: "system",
              content: systemInstructions
            },
            {
              role: "user",
              content: userPrompt
            }
          ],
          temperature: 0.85,
          max_output_tokens: 4096
        })
      }
    );

    if (!response.ok) {
      throw new Error(`OPENAI API Error: Status ${response.status}`);
    }

    const data = await response.json();

    const jsonText =
      data?.output?.[0]?.content?.[0]?.text ||
      data?.output_text;

    if (!jsonText) {
      throw new Error("OpenAI API returned empty response structure.");
    }

    const parsedReport = JSON.parse(
      jsonText
        .trim()
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```\s*$/i, "")
    );
    
    // Safety verification of parsed keys
    if (parsedReport.scorecard && parsedReport.roastSection && parsedReport.goToMarket) {
      return parsedReport;
    } else {
      throw new Error('Parsed OPENAI response missing required fields.');
    }

  } catch (error) {
    console.error('Error generating report from OpenAI API:', error);
    console.log('Using offline mock fallback report.');
    return generateMockRoastReport(startup, roastLevel, personality);
  }
};
