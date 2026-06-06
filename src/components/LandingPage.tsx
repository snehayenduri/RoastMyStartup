import React, { useState } from 'react';

interface LandingPageProps {
  onStartRoast: () => void;
  isAuthenticated: boolean;
  onOpenAuth: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartRoast, isAuthenticated, onOpenAuth }) => {
  const [demoIdea, setDemoIdea] = useState('');
  const [demoOutput, setDemoOutput] = useState('');
  const [isRoasting, setIsRoasting] = useState(false);

  const handleQuickRoast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoIdea.trim()) return;

    setIsRoasting(true);
    setDemoOutput('');

    setTimeout(() => {
      setIsRoasting(false);
      const roasts = [
        `🚨 WARNING: You are building a "Lifestyle Business" masquerading as a Venture-Scale SaaS. Selling to local bakeries has a natural cap. They don't have budgets, they churn, and you'll spend 4 hours explaining how to log in. Pivot or prepare to bootstrap forever.`,
        `🔥 TAM ALERT: A marketplace for dog trainers? Unless dogs start ordering their own trainers, you're looking at a $50M Total Addressable Market. You cannot raise VC for this. Focus on a white-label software for elite pet hotels instead.`,
        `💀 FRICTION OVERLOAD: Rebuilding Microsoft Word but with "AI compliance"? Lawyers live and die in Word. Forcing them to write in your custom web editor is a death sentence for your onboarding funnel. Build a Word Plugin or prepare for zero adoption.`
      ];
      setDemoOutput(roasts[Math.floor(Math.random() * roasts.length)]);
    }, 1500);
  };

  return (
    <div style={{ paddingBottom: '5rem' }}>
      {/* Hero Section */}
      <section style={{ textAlign: 'center', paddingBlock: '5rem 3rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
          zIndex: -1,
          pointerEvents: 'none'
        }} />
        
        <h1 style={{ 
          fontSize: 'clamp(2.5rem, 1rem + 5vw, 4rem)', 
          lineHeight: '1.1', 
          fontWeight: 800,
          fontFamily: 'var(--font-heading)',
          marginInline: 'auto',
          maxWidth: '800px',
          background: 'linear-gradient(to right, var(--fg), var(--primary))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '1rem'
        }}>
          Get Brutally Honest Feedback on Your Startup Idea.
        </h1>
        
        <p style={{ 
          fontSize: 'clamp(1rem, 0.8rem + 1vw, 1.25rem)', 
          maxWidth: '600px', 
          marginInline: 'auto', 
          marginBottom: '2.5rem',
          color: 'var(--fg-subtle)'
        }}>
          Stop building features nobody wants. IdeaRoast AI analyzes your target customer, competition, GTM, and assumptions through the eyes of top VC partners and growth PMs.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button 
            onClick={isAuthenticated ? onStartRoast : onOpenAuth} 
            className="btn btn-primary" 
            style={{ fontSize: '1.05rem', paddingBlock: '0.8rem', paddingInline: '2rem', borderRadius: '0.75rem', boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)' }}
            id="hero-cta-btn"
          >
            Roast My Idea 🔥
          </button>
          {!isAuthenticated && (
            <button onClick={onOpenAuth} className="btn btn-secondary" style={{ fontSize: '1.05rem', paddingBlock: '0.8rem', paddingInline: '2rem', borderRadius: '0.75rem' }}>
              Sign In
            </button>
          )}
        </div>
      </section>

      {/* Quick Roast Playground */}
      <section className="container" style={{ marginBlock: '3rem', maxWidth: '800px' }}>
        <div className="card card-glass" style={{ padding: '2rem', textAlign: 'left', border: '1px solid var(--primary)' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--accent)' }}>🧪 Try a Quick Mock Roast</h3>
          <p style={{ fontSize: '0.875rem', marginBottom: '1.2rem', color: 'var(--fg-subtle)' }}>Enter your startup idea below to see how our AI personality system operates. No sign-up required.</p>
          
          <form onSubmit={handleQuickRoast} style={{ display: 'flex', gap: '0.75rem' }}>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. Uber for dog grooming with blockchain payments" 
              value={demoIdea}
              onChange={(e) => setDemoIdea(e.target.value)}
              disabled={isRoasting}
              style={{ flex: 1 }}
              required
            />
            <button type="submit" className="btn btn-accent" disabled={isRoasting} id="quick-roast-submit-btn">
              {isRoasting ? 'Roasting...' : 'Roast!'}
            </button>
          </form>

          {demoOutput && (
            <div className="card" style={{ marginTop: '1.25rem', borderLeft: '4px solid var(--accent)', backgroundColor: 'var(--bg-subtle)', animation: 'modalEnter 0.2s ease-out' }}>
              <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>🔥 AI Roaster says:</strong>
              <p style={{ margin: 0, fontSize: '0.925rem', lineHeight: '1.5', color: 'var(--fg)' }}>{demoOutput}</p>
            </div>
          )}
        </div>
      </section>

      {/* Feature Grids */}
      <section className="container" style={{ marginBlock: '5rem 3rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontFamily: 'var(--font-heading)', fontSize: '2rem' }}>How IdeaRoast AI Validates Your Startup</h2>
        
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div className="card card-hover">
            <span style={{ fontSize: '2rem', marginBottom: '1rem', display: 'inline-block' }}>🧐</span>
            <h3 style={{ fontSize: '1.15rem' }}>Multi-Perspective Analysis</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--fg-subtle)' }}>Evaluate your startup through specialized lenses: a cynical YC Partner, a TAM-obsessed Venture Capitalist, or a detail-focused Product Manager.</p>
          </div>

          <div className="card card-hover">
            <span style={{ fontSize: '2rem', marginBottom: '1rem', display: 'inline-block' }}>📊</span>
            <h3 style={{ fontSize: '1.15rem' }}>relational Scorecards</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--fg-subtle)' }}>Get numerical assessments on problem urgency, market size, distribution difficulty, and competitor barriers to guide prioritization.</p>
          </div>

          <div className="card card-hover">
            <span style={{ fontSize: '2rem', marginBottom: '1rem', display: 'inline-block' }}>🛠️</span>
            <h3 style={{ fontSize: '1.15rem' }}>MVP & Revenue Roadmaps</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--fg-subtle)' }}>Receive actionable advice on must-build features, details on what to avoid to prevent bloat, and monetization strategies.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container" style={{ marginBlock: '4rem', paddingBlock: '3rem', borderBlock: '1px solid var(--border)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontFamily: 'var(--font-heading)', fontSize: '2rem' }}>What Founders Are Saying</h2>
        
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div className="card" style={{ fontStyle: 'italic', position: 'relative' }}>
            <p>"IdeaRoast saved us at least $15k and 3 months of dev. The YC Partner mode pointed out that our GTM channel was way too expensive. We pivoted to a B2B API before writing a line of code."</p>
            <strong style={{ fontStyle: 'normal', fontSize: '0.85rem', display: 'block', marginTop: '1rem', color: 'var(--fg)' }}>— Sarah Chen, Co-Founder at LegalDraft</strong>
          </div>
          
          <div className="card" style={{ fontStyle: 'italic' }}>
            <p>"The Nuclear roast level is hilarious but deeply accurate. It highlighted three massive assumptions about user habits that fell apart during our interviews. Best startup auditor out there."</p>
            <strong style={{ fontStyle: 'normal', fontSize: '0.85rem', display: 'block', marginTop: '1rem', color: 'var(--fg)' }}>— David K., Bootstrapped SaaS Builder</strong>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container" style={{ marginBlock: '4rem 2rem' }} id="pricing-section">
        <h2 style={{ textAlign: 'center', marginBottom: '1rem', fontFamily: 'var(--font-heading)', fontSize: '2rem' }}>Simple, Transparent Pricing</h2>
        <p style={{ textAlign: 'center', color: 'var(--fg-subtle)', marginBottom: '3rem' }}>Upgrade your validation engine as your startup portfolio grows.</p>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1000px', marginInline: 'auto' }}>
          {/* Free Tier */}
          <div className="card card-glass" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '2.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)', color: 'var(--fg)' }}>Free Plan</h3>
              <div style={{ marginBlock: '1rem' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 800 }}>$0</span>
                <span style={{ color: 'var(--fg-subtle)' }}> / forever</span>
              </div>
              <ul style={{ paddingLeft: '1.25rem', color: 'var(--fg-subtle)', fontSize: '0.9rem', lineHeight: '2' }}>
                <li>3 Roasts per month</li>
                <li>Access to Mild & Investor modes</li>
                <li>Standard scorecard</li>
                <li>Save ideas locally</li>
              </ul>
            </div>
            <button onClick={isAuthenticated ? onStartRoast : onOpenAuth} className="btn btn-secondary" style={{ width: '100%', marginTop: '2rem' }}>
              {isAuthenticated ? 'Get Started' : 'Sign Up Free'}
            </button>
          </div>

          {/* Pro Tier */}
          <div className="card card-glass" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '2.5rem', border: '2px solid var(--primary)', position: 'relative' }}>
            <span style={{
              position: 'absolute',
              top: '-12px',
              right: '24px',
              backgroundColor: 'var(--primary)',
              color: 'white',
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '0.25rem 0.75rem',
              borderRadius: '1rem',
              textTransform: 'uppercase'
            }}>Recommended</span>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>Pro Plan</h3>
              <div style={{ marginBlock: '1rem' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 800 }}>$19</span>
                <span style={{ color: 'var(--fg-subtle)' }}> / month</span>
              </div>
              <ul style={{ paddingLeft: '1.25rem', color: 'var(--fg-subtle)', fontSize: '0.9rem', lineHeight: '2' }}>
                <li><strong>Unlimited</strong> Startup Roasts</li>
                <li>Access to Brutal & Nuclear modes</li>
                <li>Advanced GTM & MVP recommendations</li>
                <li>Export Reports as PDF</li>
                <li>Idea Compare matrix</li>
              </ul>
            </div>
            <button onClick={isAuthenticated ? onStartRoast : onOpenAuth} className="btn btn-primary" style={{ width: '100%', marginTop: '2rem' }}>
              Upgrade to Pro
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
