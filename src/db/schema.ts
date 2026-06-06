export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  plan: 'free' | 'pro' | 'team';
  roastCountThisMonth: number;
}

export interface Startup {
  id: string;
  userId: string;
  name: string;
  oneLineIdea: string;
  problemStatement: string;
  targetCustomer: string;
  revenueModel: string;
  whyNow: string;
  competitors: string;
  founderBackground: string;
  customerValidation: string;
  currentStage: string;
  createdAt: string;
}

export interface Report {
  id: string;
  startupId: string;
  userId: string;
  roastLevel: 'mild' | 'investor' | 'brutal' | 'nuclear';
  personality: 'yc' | 'vc' | 'pm' | 'founder' | 'marketer';
  scorecard: {
    problem: number;
    market: number;
    competition: number;
    founderFit: number;
    distribution: number;
    aiNecessity: number;
    overall: number;
  };
  executiveSummary: string;
  roastSection: {
    topRisks: string[];
    weakAssumptions: string[];
    failureReasons: string[];
  };
  positiveSignals: {
    opportunities: string[];
    strengths: string[];
    timing: string[];
  };
  competitorAnalysis: string;
  goToMarket: {
    first10: string;
    first100: string;
    first1000: string;
  };
  mvpRecommendation: {
    mustBuild: string[];
    niceToHave: string[];
    avoid: string[];
  };
  revenueStrategy: string;
  successProbability: number;
  rebuildMode: {
    strongerVersions: string[];
    nicheVersions: string[];
    pivotOpportunities: string[];
  };
  createdAt: string;
}
