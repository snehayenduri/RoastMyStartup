import type { User, Startup, Report } from './schema';

const STORAGE_KEYS = {
  USERS: 'idearoast_users',
  CURRENT_USER: 'idearoast_current_user',
  STARTUPS: 'idearoast_startups',
  REPORTS: 'idearoast_reports'
};

// Seed Data
const SEED_USER: User = {
  id: 'u-1',
  email: 'founder@example.com',
  name: 'Alex Mercer',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  plan: 'free',
  roastCountThisMonth: 1
};

const SEED_STARTUPS: Startup[] = [
  {
    id: 's-1',
    userId: 'u-1',
    name: 'KoffeeBlock',
    oneLineIdea: 'Blockchain-based loyalty program for independent local coffee shops.',
    problemStatement: 'Local coffee shops struggle to retain customers against Starbucks because they cannot afford custom high-tech loyalty programs, while physical stamp cards get lost and offer no data analytics.',
    targetCustomer: 'Gen-Z and Millennial specialty coffee lovers and local coffee shop owners.',
    revenueModel: 'SaaS fee ($49/mo) for coffee shop dashboards, plus a 1.5% transaction fee on mobile pre-orders.',
    whyNow: 'The rise of consumer Web3 applications, mobile pre-orders post-pandemic, and independent shops forming coalitions to survive corporate competition.',
    competitors: 'Starbucks Rewards (proprietary), Belly (legacy loyalty), Square loyalty (expensive for shop owners).',
    founderBackground: 'Ex-Product Manager at Starbucks, 3 years experience as a freelance Solidity developer.',
    customerValidation: 'Interviewed 15 local coffee shop owners (8 expressed interest, 4 signed letters of intent). Surveled 100 coffee drinkers (68% said they would use a single app for all local shops).',
    currentStage: 'Pre-seed / MVP build',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString() // 5 days ago
  },
  {
    id: 's-2',
    userId: 'u-1',
    name: 'ScribeFlow',
    oneLineIdea: 'AI-powered co-pilot for automated legal contract drafting and compliance review.',
    problemStatement: 'Boutique law firms spend dozens of hours manually drafting standard commercial contracts, leading to slow turnaround times, high costs for clients, and human error in compliance clauses.',
    targetCustomer: 'Solo attorneys and boutique law firms (2-10 partners) specializing in commercial law.',
    revenueModel: 'Per-user seat subscription model starting at $120/month.',
    whyNow: 'LLMs are now accurate enough to comprehend complex contract logic, and law firms are facing severe pressure to automate routine labor to compete with virtual legal platforms.',
    competitors: 'Luminance, Ironclad (focused on enterprise), LawGeex, manual templates.',
    founderBackground: 'Corporate attorney with 8 years experience at Big Law; CS graduate from Stanford.',
    customerValidation: 'Beta-testing with 3 boutique firms. They report contract turnaround times dropping from 4 hours to 15 minutes.',
    currentStage: 'Seed / Active beta',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString() // 14 days ago
  }
];

const SEED_REPORTS: Report[] = [
  {
    id: 'r-1',
    startupId: 's-1',
    userId: 'u-1',
    roastLevel: 'brutal',
    personality: 'yc',
    scorecard: {
      problem: 6,
      market: 5,
      competition: 4,
      founderFit: 8,
      distribution: 3,
      aiNecessity: 2,
      overall: 5
    },
    executiveSummary: 'KoffeeBlock aims to solve local coffee shop customer retention using blockchain rewards. While the founder possesses strong domain expertise (Starbucks PM), the solution suffers from chronic over-engineering. Forcing consumers and small shop owners onto web3 tech introduces severe friction for a problem already solved by simple database tables.',
    roastSection: {
      topRisks: [
        'Massive friction at onboarding: Coffee shops do not want to manage wallets, and customers won\'t download an app just to get a stamp on a blockchain.',
        'High churn: Independent coffee shops are notoriously low-margin operations; a $49/mo SaaS fee will be cut the moment they experience a slow month.',
        'Gas fees and latency: Using blockchain for micro-transactions of coffee rewards is slow and cost-prohibitive unless built on a highly centralized L2, which defeats the blockchain premise.'
      ],
      weakAssumptions: [
        'Assumes coffee shops want to "form coalitions". Coffee shops compete with each other and are reluctant to share a loyalty system where a customer could earn points at Shop A and spend them at rival Shop B.',
        'Assumes customer validation from 15 shop owners translates to actual budget.'
      ],
      failureReasons: [
        'You build the tech, but the onboarding friction results in near-zero consumer adoption, causing coffee shops to churn within 60 days.',
        'The transaction costs eat all loyalty margins, forcing you to raise subscription fees and pricing out your target customers.'
      ]
    },
    positiveSignals: {
      opportunities: [
        'The mobile pre-order space for independent coffee shops is fragmented, and a shared platform could offer a unified ordering experience.',
        'SaaS analytics for local cafes is a real gap; owners are hungry for data on customer retention and average order values.'
      ],
      strengths: [
        'The founder is an ex-Starbucks PM, meaning they know exactly how the world\'s best coffee loyalty system functions from the inside.',
        'Direct relationship with coffee shop owners provides a clean channel for early qualitative feedback.'
      ],
      timing: [
        'Local buying trends are peaking, and customers want to support neighborhood shops over conglomerates.'
      ]
    },
    competitorAnalysis: 'Your biggest threat isn\'t another blockchain startup. It\'s Square. Square is already integrated into the POS systems of 80% of local coffee shops. They can activate a native loyalty program with one click. Selling coffee shop owners on a separate, blockchain-based terminal or dashboard is an uphill battle. To win, you must integrate directly with existing POS systems (Square, Toast) rather than forcing new hardware or software overlays.',
    goToMarket: {
      first10: 'Hand-sell to the 10 coffee shops near your house. Sit in their cafes, buy coffee for customers, and manually help them download the app to get them through the web3 onboarding hurdles.',
      first100: 'Form partnerships with local roasting companies. Roasters supply beans to dozens of cafes and have trust. Give them a revenue share for recommending your platform to their cafe accounts.',
      first1000: 'Open a developer API and POS store integration. Scale via cold email sequences targeting multi-location regional chains (5-15 shops) that want custom loyalty but cannot afford full custom app development.'
    },
    mvpRecommendation: {
      mustBuild: [
        'A simple database-backed mobile stamp card (no blockchain whatsoever).',
        'Direct POS integration for automatic reward stamps during checkout.',
        'A basic shop dashboard showing customer visit frequency.'
      ],
      niceToHave: [
        'Pre-ordering functionality to increase ticket sizes.',
        'Multi-location points transfer with clear settlement rules.'
      ],
      avoid: [
        'Solidity smart contracts, gas fee abstraction, and crypto wallets. It is an operational nightmare that adds zero user value.'
      ]
    },
    revenueStrategy: 'Ditch the transaction fee early on. Coffee shops operate on 5-8% net margins and hate variable transaction costs. Charge a flat $39/mo SaaS fee for loyalty + analytics, with a tiered structure based on active users. Offer POS integration setups as a premium one-time service fee ($199).',
    successProbability: 35,
    rebuildMode: {
      strongerVersions: [
        'Square/Toast App Store Loyalty Plugin: Build exclusively as an integration inside the existing POS app stores, eliminating the separate dashboard requirement.',
        'Local Coffee Pass: A subscription service ($15/mo) that grants users a 10% discount at 30 participating local cafes in a city, split-revenue model.',
        'White-label mobile ordering app builder for premium independent cafes.'
      ],
      nicheVersions: [
        'Loyalty system specifically for coffee roasters and subscription bean clubs.',
        'Specialty tea house rewards program incorporating tea education tracking.'
      ],
      pivotOpportunities: [
        'Cafe inventory analytics: Pivot from loyalty to a platform that predicts cafe supply needs based on transactional data.',
        'B2B ordering software connecting cafes to their local milk, pastry, and bean suppliers.'
      ]
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString()
  },
  {
    id: 'r-2',
    startupId: 's-2',
    userId: 'u-1',
    roastLevel: 'investor',
    personality: 'vc',
    scorecard: {
      problem: 8,
      market: 7,
      competition: 5,
      founderFit: 9,
      distribution: 6,
      aiNecessity: 8,
      overall: 7.5
    },
    executiveSummary: 'ScribeFlow targets contract automation for boutique law firms. The business model is highly attractive (high contract values, high willingness to pay) and founder-market fit is top-tier (Stanford CS + Law Partner). However, legal tech is experiencing extreme overcrowding, and liability risks for AI halluncinations are severe. The key to winning is proving compliance accuracy and building defensive workflows.',
    roastSection: {
      topRisks: [
        'Professional liability: If the AI misses a critical clause or hallucinates compliance, the lawyer is liable. Standard insurance might not cover AI-drafted mistakes.',
        'Data privacy and security: Law firms handle highly sensitive client information. Using open APIs or public LLMs will result in immediate compliance failures.',
        'Overcrowded space: Every legal SaaS builder is building a "contract reviewer". Differentiation is extremely low without custom proprietary models or deep workflow lock-in.'
      ],
      weakAssumptions: [
        'Assumes solo attorneys will trust AI outputs without spending the same amount of time reviewing the draft line-by-line, which defeats the time-saving premise.'
      ],
      failureReasons: [
        'An early customer faces a malpractice lawsuit due to an AI omission, causing massive reputational damage and killing your sales pipeline.',
        'Tech giants (Thomson Reuters, LexisNexis) integrate native AI drafts into their massive, pre-existing legal suites, pricing you out of the market.'
      ]
    },
    positiveSignals: {
      opportunities: [
        'Boutique firms are squeezed by big law pricing, making efficiency tools their only survival strategy.',
        'Automated document drafting can expand into niche compliance verticals (e.g., local zoning laws, specific state HR compliance).'
      ],
      strengths: [
        'Founder background is a double-threat: legal experience to speak the customer\'s language, and Stanford tech skills to build the core AI architecture.'
      ],
      timing: [
        'Generative AI is globally recognized in the legal industry, lowering the resistance to software adoption.'
      ]
    },
    competitorAnalysis: 'Established players like Ironclad own the enterprise contract lifecycle management (CLM). Do not try to compete with them. Instead, focus entirely on the "drafting co-pilot" experience for the small law firm. Leverage the founder\'s network. Your competitors are old-school template files and copy-paste workflows. Position ScribeFlow as the "secure, firm-private legal assistant".',
    goToMarket: {
      first10: 'Leverage the founder\'s former legal colleagues. Offer a 3-month free trial in exchange for deep feedback, testimonials, and usage logs to prove accuracy.',
      first100: 'Advertise in state bar association newsletters and speak at legal tech conferences. Word-of-mouth is the primary driver of legal software purchases.',
      first1000: 'Partner with malpractice insurers. Offer a premium discount to firms that use verified compliance checkers like ScribeFlow, turning insurers into distribution partners.'
    },
    mvpRecommendation: {
      mustBuild: [
        'A highly secure Word Add-in (lawyers live in Microsoft Word; they will not use a separate web app for drafting).',
        'A private vector database (RAG) using firm-specific templates only (no mixing client data).',
        'A redlining dashboard highlighting edits and reasons.'
      ],
      niceToHave: [
        'Auto-generation of signature pages and sending to DocuSign.',
        'State-by-state compliance filter buttons.'
      ],
      avoid: [
        'Building a full web-based document editor. Trying to rebuild Microsoft Word is a multi-million dollar waste of time.'
      ]
    },
    revenueStrategy: 'Attorneys charge by the hour, so frame pricing as "hours saved". Start with a seat-based SaaS model of $99/seat/month, but introduce a value-add "Document credits" pricing for high-frequency firms. Offer a premium tier ($249/seat/mo) that includes custom fine-tuning on the firm\'s historical contract library.',
    successProbability: 68,
    rebuildMode: {
      strongerVersions: [
        'Boutique Law Firm Word Plugin: A Microsoft Word Add-in that reviews drafts and inserts clauses in real-time, working where lawyers already work.',
        'AI mal-practice shield: A dedicated auditor tool that checks finalized contracts solely for compliance gaps and risks prior to signing.',
        'Specialized Real Estate compliance checker: Deep focus on zoning and lease validation.'
      ],
      nicheVersions: [
        'ScribeFlow for Construction Contracts: Focus on construction liability, delay clauses, and subcontractors.',
        'ScribeFlow for Entertainment Law: Dedicated to IP licensing and talent options.'
      ],
      pivotOpportunities: [
        'In-house Legal Advisor for Series A-C startups: Software that helps startups review investor and vendor contracts without hiring external counsel.',
        'AI legal document summarizer for insurance adjusters reviewing claims.'
      ]
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString()
  }
];

// Helper Functions
const load = <T>(key: string, defaultValue: T): T => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
  return JSON.parse(data);
};

const save = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Database Initialization
export const initDb = (): void => {
  load(STORAGE_KEYS.USERS, [SEED_USER]);
  load(STORAGE_KEYS.CURRENT_USER, SEED_USER);
  load(STORAGE_KEYS.STARTUPS, SEED_STARTUPS);
  load(STORAGE_KEYS.REPORTS, SEED_REPORTS);
};

// Database API
export const mockDb = {
  getCurrentUser(): User {
    initDb();
    return load(STORAGE_KEYS.CURRENT_USER, SEED_USER);
  },

  setCurrentUser(user: User | null): void {
    if (user) {
      save(STORAGE_KEYS.CURRENT_USER, user);
      // Update in users table too
      const users = load<User[]>(STORAGE_KEYS.USERS, [SEED_USER]);
      const idx = users.findIndex(u => u.id === user.id);
      if (idx > -1) {
        users[idx] = user;
      } else {
        users.push(user);
      }
      save(STORAGE_KEYS.USERS, users);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  updateUserPlan(plan: 'free' | 'pro' | 'team'): User {
    const user = this.getCurrentUser();
    user.plan = plan;
    this.setCurrentUser(user);
    return user;
  },

  incrementUserRoastCount(): User {
    const user = this.getCurrentUser();
    user.roastCountThisMonth += 1;
    this.setCurrentUser(user);
    return user;
  },

  getStartups(): Startup[] {
    initDb();
    const user = this.getCurrentUser();
    const startups = load<Startup[]>(STORAGE_KEYS.STARTUPS, SEED_STARTUPS);
    return startups.filter(s => s.userId === user.id);
  },

  getStartup(id: string): Startup | undefined {
    const startups = this.getStartups();
    return startups.find(s => s.id === id);
  },

  saveStartup(startupData: Omit<Startup, 'id' | 'userId' | 'createdAt'>): Startup {
    const user = this.getCurrentUser();
    const startups = load<Startup[]>(STORAGE_KEYS.STARTUPS, SEED_STARTUPS);
    const newStartup: Startup = {
      ...startupData,
      id: `s-${Date.now()}`,
      userId: user.id,
      createdAt: new Date().toISOString()
    };
    startups.push(newStartup);
    save(STORAGE_KEYS.STARTUPS, startups);
    return newStartup;
  },

  deleteStartup(id: string): void {
    const startups = load<Startup[]>(STORAGE_KEYS.STARTUPS, SEED_STARTUPS);
    const filteredStartups = startups.filter(s => s.id !== id);
    save(STORAGE_KEYS.STARTUPS, filteredStartups);

    // Also delete associated reports
    const reports = load<Report[]>(STORAGE_KEYS.REPORTS, SEED_REPORTS);
    const filteredReports = reports.filter(r => r.startupId !== id);
    save(STORAGE_KEYS.REPORTS, filteredReports);
  },

  getReports(): Report[] {
    initDb();
    const user = this.getCurrentUser();
    const reports = load<Report[]>(STORAGE_KEYS.REPORTS, SEED_REPORTS);
    return reports.filter(r => r.userId === user.id);
  },

  getReportForStartup(startupId: string): Report | undefined {
    const reports = this.getReports();
    return reports.find(r => r.startupId === startupId);
  },

  saveReport(reportData: Omit<Report, 'id' | 'userId' | 'createdAt'>): Report {
    const user = this.getCurrentUser();
    const reports = load<Report[]>(STORAGE_KEYS.REPORTS, SEED_REPORTS);
    const newReport: Report = {
      ...reportData,
      id: `r-${Date.now()}`,
      userId: user.id,
      createdAt: new Date().toISOString()
    };
    reports.push(newReport);
    save(STORAGE_KEYS.REPORTS, reports);
    this.incrementUserRoastCount();
    return newReport;
  }
};
