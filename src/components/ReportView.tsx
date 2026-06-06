import React, { useState } from 'react';
import type { Report, Startup } from '../db/schema';

interface ReportViewProps {
  report: Report;
  startup: Startup;
  onBackToDashboard: () => void;
}

export const ReportView: React.FC<ReportViewProps> = ({ report, startup, onBackToDashboard }) => {
  const [activeTab, setActiveTab] = useState<'roast' | 'gtm' | 'mvp' | 'rebuild'>('roast');

  const handlePrint = () => {
    window.print();
  };

  // Score radial calculation helpers
  const getStrokeOffset = (score: number) => {
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    return circumference - (score / 10) * circumference;
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'var(--success)';
    if (score >= 5) return 'var(--warning)';
    return 'var(--danger)';
  };

  const formattedDate = new Date(report.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="container" style={{ marginBlock: '2.5rem' }}>
      {/* Header Controls */}
      <div className="flex btn-print-hide" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <button onClick={onBackToDashboard} className="btn btn-secondary">
          &larr; Back to Dashboard
        </button>
        <button onClick={handlePrint} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} id="print-pdf-btn">
          <span>🖨️</span> Export Report as PDF
        </button>
      </div>

      {/* Main Report Document */}
      <div className="card" style={{ padding: '3rem', border: '1px solid var(--border)' }}>
        {/* Document Header */}
        <div style={{ borderBottom: '2px solid var(--border)', paddingBottom: '2rem', marginBottom: '2.5rem', textAlign: 'left' }}>
          <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{
                backgroundColor: report.roastLevel === 'nuclear' ? 'var(--danger)' : report.roastLevel === 'brutal' ? 'var(--warning)' : 'var(--primary)',
                color: 'white',
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '0.25rem 0.75rem',
                borderRadius: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                {report.roastLevel} roast mode
              </span>
              <h1 style={{ fontSize: '2.5rem', marginTop: '0.5rem', marginBottom: '0.25rem', fontFamily: 'var(--font-heading)' }}>
                Validation Report: {startup.name}
              </h1>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--fg-subtle)' }}>
                Generated on {formattedDate} | Perspective: <strong style={{ textTransform: 'uppercase' }}>{report.personality}</strong>
              </p>
            </div>
            
            {/* Overall Gauge */}
            <div style={{ textAlign: 'center' }}>
              <div className="score-circle">
                <svg>
                  <circle className="bg-ring" cx="50" cy="50" r="36" />
                  <circle 
                    className="progress-ring" 
                    cx="50" 
                    cy="50" 
                    r="36" 
                    stroke={getScoreColor(report.scorecard.overall)}
                    strokeDasharray={2 * Math.PI * 36}
                    strokeDashoffset={getStrokeOffset(report.scorecard.overall)}
                  />
                </svg>
                <div className="score-text" style={{ color: getScoreColor(report.scorecard.overall) }}>
                  {report.scorecard.overall}
                </div>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--fg-subtle)', display: 'block', marginTop: '0.25rem' }}>
                Overall Score
              </span>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div style={{ textAlign: 'left', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--primary)', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
            Executive Summary
          </h2>
          <p style={{ fontSize: '1.05rem', lineHeight: '1.6', color: 'var(--fg)', fontStyle: 'italic', backgroundColor: 'var(--bg-subtle)', padding: '1.25rem', borderRadius: '0.5rem', borderLeft: '4px solid var(--primary)' }}>
            {report.executiveSummary}
          </p>
        </div>

        {/* Startup Scorecard Details */}
        <div style={{ textAlign: 'left', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--primary)', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
            Startup Scorecard
          </h2>
          
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1.5rem' }}>
            {[
              { label: 'Problem Urgency', score: report.scorecard.problem },
              { label: 'Market Opportunity', score: report.scorecard.market },
              { label: 'Competitive Risk', score: report.scorecard.competition },
              { label: 'Founder Fit', score: report.scorecard.founderFit },
              { label: 'Distribution Ease', score: report.scorecard.distribution },
              { label: 'AI Necessity', score: report.scorecard.aiNecessity },
            ].map((item, idx) => (
              <div key={idx} style={{ textAlign: 'center', backgroundColor: 'var(--bg-subtle)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}>
                <div className="score-circle" style={{ width: '70px', height: '70px' }}>
                  <svg>
                    <circle className="bg-ring" cx="50" cy="50" r="36" />
                    <circle 
                      className="progress-ring" 
                      cx="50" 
                      cy="50" 
                      r="36" 
                      stroke={getScoreColor(item.score)}
                      strokeDasharray={2 * Math.PI * 36}
                      strokeDashoffset={getStrokeOffset(item.score)}
                    />
                  </svg>
                  <div className="score-text" style={{ fontSize: '1.15rem', color: getScoreColor(item.score) }}>
                    {item.score}
                  </div>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--fg)', display: 'block', marginTop: '0.5rem', lineHeight: '1.2' }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
          
          {/* Accessible Data Table for Screen Readers */}
          <table className="sr-only">
            <caption>Startup Scorecard Details</caption>
            <thead>
              <tr>
                <th scope="col">Evaluation Metric</th>
                <th scope="col">Score (out of 10)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Problem Urgency</td>
                <td>{report.scorecard.problem}</td>
              </tr>
              <tr>
                <td>Market Opportunity</td>
                <td>{report.scorecard.market}</td>
              </tr>
              <tr>
                <td>Competitive Risk</td>
                <td>{report.scorecard.competition}</td>
              </tr>
              <tr>
                <td>Founder Fit</td>
                <td>{report.scorecard.founderFit}</td>
              </tr>
              <tr>
                <td>Distribution Ease</td>
                <td>{report.scorecard.distribution}</td>
              </tr>
              <tr>
                <td>AI Necessity</td>
                <td>{report.scorecard.aiNecessity}</td>
              </tr>
              <tr>
                <td>Overall Score</td>
                <td>{report.scorecard.overall}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Document Tab Navigation */}
        <div className="flex btn-print-hide" style={{ borderBottom: '2px solid var(--border)', marginBottom: '2rem', gap: '0.5rem', overflowX: 'auto' }}>
          {[
            { id: 'roast', label: '🔥 The Roast & Signals' },
            { id: 'gtm', label: '📢 Go-To-Market' },
            { id: 'mvp', label: '🛠️ MVP & Pricing' },
            { id: 'rebuild', label: '🔄 Rebuild Mode' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className="btn"
              style={{
                backgroundColor: activeTab === tab.id ? 'var(--primary)' : 'transparent',
                color: activeTab === tab.id ? 'white' : 'var(--fg-subtle)',
                border: 'none',
                borderRadius: '0.5rem 0.5rem 0 0',
                paddingBlock: '0.75rem',
                margin: 0
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: Roast and Positive Signals */}
        {(activeTab === 'roast' || window.matchMedia('print').matches) && (
          <div style={{ textAlign: 'left', animation: 'modalEnter 0.2s ease-out' }}>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
              
              {/* Roast panel */}
              <div className="card" style={{ borderLeft: '4px solid var(--danger)', backgroundColor: 'var(--bg-subtle)' }}>
                <h3 style={{ color: 'var(--danger)', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>💀</span> Brutal Roast
                </h3>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--fg-subtle)', marginTop: '1rem', textTransform: 'uppercase' }}>Top Risks</h4>
                <ul style={{ paddingLeft: '1.2rem', fontSize: '0.9rem', lineHeight: '1.6' }}>
                  {report.roastSection.topRisks.map((item, i) => <li key={i} style={{ marginBottom: '0.5rem' }}>{item}</li>)}
                </ul>

                <h4 style={{ fontSize: '0.9rem', color: 'var(--fg-subtle)', marginTop: '1rem', textTransform: 'uppercase' }}>Weak Assumptions</h4>
                <ul style={{ paddingLeft: '1.2rem', fontSize: '0.9rem', lineHeight: '1.6' }}>
                  {report.roastSection.weakAssumptions.map((item, i) => <li key={i} style={{ marginBottom: '0.5rem' }}>{item}</li>)}
                </ul>

                <h4 style={{ fontSize: '0.9rem', color: 'var(--fg-subtle)', marginTop: '1rem', textTransform: 'uppercase' }}>Failure Scenarios</h4>
                <ul style={{ paddingLeft: '1.2rem', fontSize: '0.9rem', lineHeight: '1.6' }}>
                  {report.roastSection.failureReasons.map((item, i) => <li key={i} style={{ marginBottom: '0.5rem' }}>{item}</li>)}
                </ul>
              </div>

              {/* Signals panel */}
              <div className="card" style={{ borderLeft: '4px solid var(--success)', backgroundColor: 'var(--bg-subtle)' }}>
                <h3 style={{ color: 'var(--success)', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>🌱</span> Positive Signals
                </h3>
                
                <h4 style={{ fontSize: '0.9rem', color: 'var(--fg-subtle)', marginTop: '1rem', textTransform: 'uppercase' }}>Market Opportunities</h4>
                <ul style={{ paddingLeft: '1.2rem', fontSize: '0.9rem', lineHeight: '1.6' }}>
                  {report.positiveSignals.opportunities.map((item, i) => <li key={i} style={{ marginBottom: '0.5rem' }}>{item}</li>)}
                </ul>

                <h4 style={{ fontSize: '0.9rem', color: 'var(--fg-subtle)', marginTop: '1rem', textTransform: 'uppercase' }}>Founder Strengths</h4>
                <ul style={{ paddingLeft: '1.2rem', fontSize: '0.9rem', lineHeight: '1.6' }}>
                  {report.positiveSignals.strengths.map((item, i) => <li key={i} style={{ marginBottom: '0.5rem' }}>{item}</li>)}
                </ul>

                <h4 style={{ fontSize: '0.9rem', color: 'var(--fg-subtle)', marginTop: '1rem', textTransform: 'uppercase' }}>Timing Advantages</h4>
                <ul style={{ paddingLeft: '1.2rem', fontSize: '0.9rem', lineHeight: '1.6' }}>
                  {report.positiveSignals.timing.map((item, i) => <li key={i} style={{ marginBottom: '0.5rem' }}>{item}</li>)}
                </ul>
              </div>
            </div>

            <div className="card" style={{ backgroundColor: 'var(--bg-subtle)', borderLeft: '4px solid var(--primary)' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--fg)', marginBottom: '0.75rem' }}>🕵️ Competitor Deep Dive</h3>
              <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--fg-subtle)' }}>
                {report.competitorAnalysis}
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: Go-To-Market */}
        {(activeTab === 'gtm' || window.matchMedia('print').matches) && (
          <div style={{ textAlign: 'left', animation: 'modalEnter 0.2s ease-out' }}>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>📢 Go-To-Market Distribution Roadmap</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="card" style={{ borderLeft: '4px solid var(--accent)', backgroundColor: 'var(--bg-subtle)' }}>
                <h4 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ background: 'var(--accent)', color: 'white', borderRadius: '50%', width: '1.5rem', height: '1.5rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>1</span>
                  Acquire First 10 Customers
                </h4>
                <p style={{ marginTop: '0.75rem', marginBottom: 0, fontSize: '0.925rem', lineHeight: '1.6' }}>{report.goToMarket.first10}</p>
              </div>

              <div className="card" style={{ borderLeft: '4px solid var(--primary)', backgroundColor: 'var(--bg-subtle)' }}>
                <h4 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ background: 'var(--primary)', color: 'white', borderRadius: '50%', width: '1.5rem', height: '1.5rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>2</span>
                  Scale to First 100 Customers
                </h4>
                <p style={{ marginTop: '0.75rem', marginBottom: 0, fontSize: '0.925rem', lineHeight: '1.6' }}>{report.goToMarket.first100}</p>
              </div>

              <div className="card" style={{ borderLeft: '4px solid var(--success)', backgroundColor: 'var(--bg-subtle)' }}>
                <h4 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ background: 'var(--success)', color: 'white', borderRadius: '50%', width: '1.5rem', height: '1.5rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>3</span>
                  Expand to First 1000 Customers
                </h4>
                <p style={{ marginTop: '0.75rem', marginBottom: 0, fontSize: '0.925rem', lineHeight: '1.6' }}>{report.goToMarket.first1000}</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MVP & Revenue Strategy */}
        {(activeTab === 'mvp' || window.matchMedia('print').matches) && (
          <div style={{ textAlign: 'left', animation: 'modalEnter 0.2s ease-out' }}>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>🛠️ MVP Product Scope & Revenue Strategy</h3>
            
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
              
              <div className="card" style={{ borderTop: '4px solid var(--success)' }}>
                <h4 style={{ color: 'var(--success)', fontSize: '1rem', marginTop: 0 }}>✅ Must Build</h4>
                <ul style={{ paddingLeft: '1.1rem', fontSize: '0.875rem', lineHeight: '1.6' }}>
                  {report.mvpRecommendation.mustBuild.map((item, i) => <li key={i} style={{ marginBottom: '0.5rem' }}>{item}</li>)}
                </ul>
              </div>

              <div className="card" style={{ borderTop: '4px solid var(--warning)' }}>
                <h4 style={{ color: 'var(--warning)', fontSize: '1rem', marginTop: 0 }}>💡 Nice-to-Have</h4>
                <ul style={{ paddingLeft: '1.1rem', fontSize: '0.875rem', lineHeight: '1.6' }}>
                  {report.mvpRecommendation.niceToHave.map((item, i) => <li key={i} style={{ marginBottom: '0.5rem' }}>{item}</li>)}
                </ul>
              </div>

              <div className="card" style={{ borderTop: '4px solid var(--danger)' }}>
                <h4 style={{ color: 'var(--danger)', fontSize: '1rem', marginTop: 0 }}>🚫 Avoid Building</h4>
                <ul style={{ paddingLeft: '1.1rem', fontSize: '0.875rem', lineHeight: '1.6' }}>
                  {report.mvpRecommendation.avoid.map((item, i) => <li key={i} style={{ marginBottom: '0.5rem' }}>{item}</li>)}
                </ul>
              </div>
            </div>

            <div className="card" style={{ backgroundColor: 'var(--bg-subtle)', borderLeft: '4px solid var(--accent)' }}>
              <h4 style={{ color: 'var(--accent)', fontSize: '1.15rem', margin: 0, marginBottom: '0.5rem' }}>💰 Revenue Strategy Recommendations</h4>
              <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--fg-subtle)' }}>{report.revenueStrategy}</p>
            </div>
          </div>
        )}

        {/* TAB 4: Rebuild Mode */}
        {(activeTab === 'rebuild' || window.matchMedia('print').matches) && (
          <div style={{ textAlign: 'left', animation: 'modalEnter 0.2s ease-out' }}>
            <div className="flex" style={{ alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '1.75rem' }}>🔄</span>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--primary)', margin: 0 }}>Rebuild Mode: Alternative Directions</h3>
            </div>
            
            <p style={{ fontSize: '0.9rem', color: 'var(--fg-subtle)', marginBottom: '2rem' }}>
              Don't throw away the concept yet. Here are alternative versions and pivot pathways that solve key distribution and market risks.
            </p>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              
              <div className="card">
                <h4 style={{ color: 'var(--primary)', fontSize: '1.05rem', marginTop: 0, marginBottom: '1rem' }}>📈 3 Stronger Versions</h4>
                <ol style={{ paddingLeft: '1.1rem', fontSize: '0.875rem', lineHeight: '1.7' }}>
                  {report.rebuildMode.strongerVersions.map((item, i) => <li key={i} style={{ marginBottom: '0.75rem' }}>{item}</li>)}
                </ol>
              </div>

              <div className="card">
                <h4 style={{ color: 'var(--success)', fontSize: '1.05rem', marginTop: 0, marginBottom: '1rem' }}>🎯 3 Niche Verticals</h4>
                <ol style={{ paddingLeft: '1.1rem', fontSize: '0.875rem', lineHeight: '1.7' }}>
                  {report.rebuildMode.nicheVersions.map((item, i) => <li key={i} style={{ marginBottom: '0.75rem' }}>{item}</li>)}
                </ol>
              </div>

              <div className="card">
                <h4 style={{ color: 'var(--accent)', fontSize: '1.05rem', marginTop: 0, marginBottom: '1rem' }}>🔀 3 Pivot Opportunities</h4>
                <ol style={{ paddingLeft: '1.1rem', fontSize: '0.875rem', lineHeight: '1.7' }}>
                  {report.rebuildMode.pivotOpportunities.map((item, i) => <li key={i} style={{ marginBottom: '0.75rem' }}>{item}</li>)}
                </ol>
              </div>

            </div>
          </div>
        )}

        {/* Footer stats */}
        <div style={{ marginTop: '4rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <strong style={{ fontSize: '1.1rem', color: 'var(--fg)' }}>Success Probability Factor</strong>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--fg-subtle)' }}>Calculated against our historical database of startup outcomes.</p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 800, color: getScoreColor(report.successProbability / 10) }}>
              {report.successProbability}%
            </span>
            <div style={{
              width: '100px',
              height: '10px',
              backgroundColor: 'var(--border)',
              borderRadius: '5px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${report.successProbability}%`,
                height: '100%',
                backgroundColor: getScoreColor(report.successProbability / 10),
                borderRadius: '5px'
              }} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
