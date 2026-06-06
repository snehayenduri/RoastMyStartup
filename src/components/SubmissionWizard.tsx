import React, { useState } from 'react';
import type { Startup } from '../db/schema';

interface SubmissionWizardProps {
  onComplete: (
    startupData: Omit<Startup, 'id' | 'userId' | 'createdAt'>,
    roastLevel: 'mild' | 'investor' | 'brutal' | 'nuclear',
    personality: 'yc' | 'vc' | 'pm' | 'founder' | 'marketer'
  ) => void;
  onCancel: () => void;
  userPlan: 'free' | 'pro' | 'team';
}

const LOADING_TEXTS = [
  'Reading your pitch deck (well, the first slide)...',
  'Analyzing Total Addressable Market (TAM)...',
  'Polishing passive-aggressive investor comments...',
  'Checking if this could have been a simple spreadsheet...',
  'Roasting customer acquisition cost assumptions...',
  'Simulating Cap Table dilutions...',
  'Drafting YC interview rejection templates...',
  'Trimming feature bloat from your proposed MVP...',
  'Asking experienced founders if they would buy this...'
];

export const SubmissionWizard: React.FC<SubmissionWizardProps> = ({ onComplete, onCancel, userPlan }) => {
  const [step, setStep] = useState(1);
  
  // Step 1 State
  const [name, setName] = useState('');
  const [oneLineIdea, setOneLineIdea] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [targetCustomer, setTargetCustomer] = useState('');
  const [revenueModel, setRevenueModel] = useState('');

  // Step 2 State
  const [whyNow, setWhyNow] = useState('');
  const [competitors, setCompetitors] = useState('');
  const [founderBackground, setFounderBackground] = useState('');
  const [customerValidation, setCustomerValidation] = useState('None');
  const [currentStage, setCurrentStage] = useState('Idea stage');

  // Step 3 State
  const [roastLevel, setRoastLevel] = useState<'mild' | 'investor' | 'brutal' | 'nuclear'>('investor');
  const [personality, setPersonality] = useState<'yc' | 'vc' | 'pm' | 'founder' | 'marketer'>('yc');

  // Loading State
  const [loading, setLoading] = useState(false);
  const [loadingIndex, setLoadingIndex] = useState(0);

  const handleNext = () => {
    if (step === 1) {
      if (!name || !oneLineIdea || !problemStatement || !targetCustomer || !revenueModel) {
        alert('Please fill out all fields in Step 1.');
        return;
      }
    } else if (step === 2) {
      if (!whyNow || !competitors || !founderBackground) {
        alert('Please fill out all fields in Step 2.');
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check permission for brutal/nuclear modes if free plan
    if (userPlan === 'free' && (roastLevel === 'brutal' || roastLevel === 'nuclear')) {
      alert('Brutal and Nuclear roast levels require a Pro plan subscription.');
      return;
    }

    setLoading(true);
    
    // Animate loading text
    const textInterval = setInterval(() => {
      setLoadingIndex(prev => (prev + 1) % LOADING_TEXTS.length);
    }, 2000);

    setTimeout(() => {
      clearInterval(textInterval);
      onComplete(
        {
          name,
          oneLineIdea,
          problemStatement,
          targetCustomer,
          revenueModel,
          whyNow,
          competitors,
          founderBackground,
          customerValidation,
          currentStage
        },
        roastLevel,
        personality
      );
    }, 4500); // 4.5 seconds of roast preparation
  };

  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
        <div style={{
          width: '80px',
          height: '80px',
          border: '6px solid var(--border)',
          borderTopColor: 'var(--accent)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '2rem'
        }} />
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', color: 'var(--accent)' }}>Cooking Up Your Roast Report...</h2>
        <p style={{ fontSize: '1.1rem', color: 'var(--fg-subtle)', fontStyle: 'italic', transition: 'opacity 0.5s ease', height: '1.5em', marginTop: '0.5rem' }}>
          {LOADING_TEXTS[loadingIndex]}
        </p>

        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '750px', marginBlock: '3rem' }}>
      <div className="card card-glass" style={{ padding: '2.5rem' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.85rem' }}>
          Startup Submission Wizard
        </h2>
        
        {/* Progress Tracker */}
        <div className="wizard-progress">
          <div className={`wizard-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>1</div>
          <div className={`wizard-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>2</div>
          <div className={`wizard-step ${step >= 3 ? 'active' : ''}`}>3</div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* STEP 1: Basic Information */}
          {step === 1 && (
            <div style={{ animation: 'modalEnter 0.25s ease-out' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', color: 'var(--primary)' }}>
                Step 1: The Basics
              </h3>
              
              <div className="form-group">
                <label className="form-label" htmlFor="startup-name">Startup Name</label>
                <input 
                  id="startup-name"
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. ScribeFlow" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="one-line-idea">One-Line Idea</label>
                <input 
                  id="one-line-idea"
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. AI-powered legal co-pilot for automated commercial contract drafting" 
                  value={oneLineIdea}
                  onChange={(e) => setOneLineIdea(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="problem-statement">Problem Statement</label>
                <textarea 
                  id="problem-statement"
                  className="form-control" 
                  rows={3}
                  placeholder="What is the critical pain point your target customer faces daily?" 
                  value={problemStatement}
                  onChange={(e) => setProblemStatement(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="target-customer">Target Customer</label>
                <input 
                  id="target-customer"
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Boutique law firms with 2-10 partners specializing in commercial law" 
                  value={targetCustomer}
                  onChange={(e) => setTargetCustomer(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="revenue-model">Revenue Model</label>
                <input 
                  id="revenue-model"
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. SaaS subscription of $120/seat/month" 
                  value={revenueModel}
                  onChange={(e) => setRevenueModel(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" onClick={onCancel} className="btn btn-secondary">Cancel</button>
                <button type="button" onClick={handleNext} className="btn btn-primary" id="wizard-next-1-btn">Next Step &rarr;</button>
              </div>
            </div>
          )}

          {/* STEP 2: Context & Validation */}
          {step === 2 && (
            <div style={{ animation: 'modalEnter 0.25s ease-out' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', color: 'var(--primary)' }}>
                Step 2: Feasibility & Traction
              </h3>

              <div className="form-group">
                <label className="form-label" htmlFor="why-now">Why Now?</label>
                <textarea 
                  id="why-now"
                  className="form-control" 
                  rows={2}
                  placeholder="Why is this the perfect timing for your startup? What changed recently?" 
                  value={whyNow}
                  onChange={(e) => setWhyNow(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="competitors">Existing Competitors</label>
                <input 
                  id="competitors"
                  type="text" 
                  className="form-control" 
                  placeholder="List them, separated by commas (e.g. Ironclad, Luminance, old templates)" 
                  value={competitors}
                  onChange={(e) => setCompetitors(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="founder-background">Founder Background</label>
                <textarea 
                  id="founder-background"
                  className="form-control" 
                  rows={2}
                  placeholder="What is your domain expertise or development background related to this?" 
                  value={founderBackground}
                  onChange={(e) => setFounderBackground(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="validation-stage">Customer Validation Completed</label>
                <select 
                  id="validation-stage"
                  className="form-control"
                  value={customerValidation}
                  onChange={(e) => setCustomerValidation(e.target.value)}
                >
                  <option value="None - just an idea">None - just an idea</option>
                  <option value="Spoke to 5-10 prospective customers">Spoke to 5-10 prospective customers</option>
                  <option value="Surveyed 50+ target users">Surveyed 50+ target users</option>
                  <option value="Signed Letters of Intent (LOI) / active beta testers">Signed Letters of Intent (LOI) / active beta testers</option>
                  <option value="Already have early paying customers">Already have early paying customers</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="current-stage">Current Development Stage</label>
                <select 
                  id="current-stage"
                  className="form-control"
                  value={currentStage}
                  onChange={(e) => setCurrentStage(e.target.value)}
                >
                  <option value="Idea stage">Idea stage</option>
                  <option value="Wireframes / Landing page check">Wireframes / Landing page check</option>
                  <option value="Active MVP prototype build">Active MVP prototype build</option>
                  <option value="MVP launched with active users">MVP launched with active users</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" onClick={handleBack} className="btn btn-secondary">&larr; Back</button>
                <button type="button" onClick={handleNext} className="btn btn-primary" id="wizard-next-2-btn">Next Step &rarr;</button>
              </div>
            </div>
          )}

          {/* STEP 3: Roast Configuration */}
          {step === 3 && (
            <div style={{ animation: 'modalEnter 0.25s ease-out' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', color: 'var(--primary)' }}>
                Step 3: Roast Settings
              </h3>

              {/* Personality selection */}
              <div className="form-group" style={{ marginBottom: '2rem' }}>
                <label className="form-label">Select AI Personality Perspective</label>
                <div className="personality-grid">
                  <div className={`personality-card ${personality === 'yc' ? 'selected' : ''}`} onClick={() => setPersonality('yc')}>
                    <div className="personality-icon">👨‍💼</div>
                    <span className="personality-title">YC Partner</span>
                  </div>
                  
                  <div className={`personality-card ${personality === 'vc' ? 'selected' : ''}`} onClick={() => setPersonality('vc')}>
                    <div className="personality-icon">💵</div>
                    <span className="personality-title">Venture Capitalist</span>
                  </div>

                  <div className={`personality-card ${personality === 'pm' ? 'selected' : ''}`} onClick={() => setPersonality('pm')}>
                    <div className="personality-icon">📱</div>
                    <span className="personality-title">Product Manager</span>
                  </div>

                  <div className={`personality-card ${personality === 'founder' ? 'selected' : ''}`} onClick={() => setPersonality('founder')}>
                    <div className="personality-icon">🚀</div>
                    <span className="personality-title">SaaS Founder</span>
                  </div>

                  <div className={`personality-card ${personality === 'marketer' ? 'selected' : ''}`} onClick={() => setPersonality('marketer')}>
                    <div className="personality-icon">📢</div>
                    <span className="personality-title">Growth Marketer</span>
                  </div>
                </div>
              </div>

              {/* Roast Level selection */}
              <div className="form-group" style={{ marginBottom: '2rem' }}>
                <label className="form-label">Select Roast Severity Level</label>
                <div className="roast-grid">
                  <div 
                    className={`roast-card ${roastLevel === 'mild' ? 'selected' : ''}`} 
                    onClick={() => setRoastLevel('mild')}
                    data-level="mild"
                    style={{ border: '2px solid var(--border)', backgroundColor: roastLevel === 'mild' ? 'rgba(16, 185, 129, 0.1)' : 'var(--card-bg)', cursor: 'pointer' }}
                  >
                    <div style={{ fontSize: '1.25rem' }}>🥗</div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Mild Advice</span>
                  </div>

                  <div 
                    className={`roast-card ${roastLevel === 'investor' ? 'selected' : ''}`} 
                    onClick={() => setRoastLevel('investor')}
                    data-level="investor"
                    style={{ border: '2px solid var(--border)', backgroundColor: roastLevel === 'investor' ? 'rgba(79, 70, 229, 0.1)' : 'var(--card-bg)', cursor: 'pointer' }}
                  >
                    <div style={{ fontSize: '1.25rem' }}>💼</div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Investor Review</span>
                  </div>

                  <div 
                    className={`roast-card ${roastLevel === 'brutal' ? 'selected' : ''}`} 
                    onClick={() => setRoastLevel('brutal')}
                    data-level="brutal"
                    style={{ 
                      border: '2px solid var(--border)', 
                      backgroundColor: roastLevel === 'brutal' ? 'rgba(245, 158, 11, 0.1)' : 'var(--card-bg)', 
                      cursor: 'pointer',
                      opacity: userPlan === 'free' ? 0.6 : 1
                    }}
                  >
                    <div style={{ fontSize: '1.25rem' }}>🔥</div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Brutal Roast {userPlan === 'free' && '🔒'}</span>
                  </div>

                  <div 
                    className={`roast-card ${roastLevel === 'nuclear' ? 'selected' : ''}`} 
                    onClick={() => setRoastLevel('nuclear')}
                    data-level="nuclear"
                    style={{ 
                      border: '2px solid var(--border)', 
                      backgroundColor: roastLevel === 'nuclear' ? 'rgba(239, 68, 68, 0.1)' : 'var(--card-bg)', 
                      cursor: 'pointer',
                      opacity: userPlan === 'free' ? 0.6 : 1
                    }}
                  >
                    <div style={{ fontSize: '1.25rem' }}>☢️</div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Nuclear {userPlan === 'free' && '🔒'}</span>
                  </div>
                </div>
                {userPlan === 'free' && (
                  <p style={{ fontSize: '0.75rem', color: 'var(--accent)', marginTop: '0.5rem', textAlign: 'center' }}>
                    🔒 Upgrade to Pro to unlock Brutal and Nuclear roast settings.
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" onClick={handleBack} className="btn btn-secondary">&larr; Back</button>
                <button type="submit" className="btn btn-accent" style={{ paddingInline: '2rem' }} id="wizard-submit-btn">
                  Generate Roast Report 🔥
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
