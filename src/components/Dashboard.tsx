import React, { useState } from 'react';
import type { Startup, Report, User } from '../db/schema';

interface DashboardProps {
  startups: Startup[];
  reports: Report[];
  user: User;
  onNewRoast: () => void;
  onViewReport: (startupId: string) => void;
  onDeleteStartup: (id: string) => void;
  onUpgradePlan: (plan: 'free' | 'pro' | 'team') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  startups,
  reports,
  user,
  onNewRoast,
  onViewReport,
  onDeleteStartup,
  onUpgradePlan
}) => {
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [isComparing, setIsComparing] = useState<boolean>(false);

  const handleCheckboxChange = (startupId: string) => {
    setSelectedForCompare(prev => {
      if (prev.includes(startupId)) {
        return prev.filter(id => id !== startupId);
      } else {
        if (prev.length >= 2) {
          // Limit comparison to 2 startups
          alert('You can compare exactly 2 startup ideas at a time.');
          return prev;
        }
        return [...prev, startupId];
      }
    });
  };

  const startComparison = () => {
    if (selectedForCompare.length !== 2) {
      alert('Please select exactly 2 startup ideas to compare.');
      return;
    }
    setIsComparing(true);
  };

  const closeComparison = () => {
    setIsComparing(false);
    setSelectedForCompare([]);
  };

  // Helper to find report for a startup
  const getStartupReport = (startupId: string) => {
    return reports.find(r => r.startupId === startupId);
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'var(--success)';
    if (score >= 5) return 'var(--warning)';
    return 'var(--danger)';
  };

  return (
    <div className="container" style={{ marginBlock: '2.5rem' }}>
      
      {/* Upper info band */}
      <div className="card card-glass" style={{ marginBottom: '2.5rem', padding: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img src={user.avatar} alt={user.name} style={{ width: '3.5rem', height: '3.5rem', borderRadius: '50%', border: '2px solid var(--primary)' }} />
          <div style={{ textAlign: 'left' }}>
            <h2 style={{ fontSize: '1.25rem', margin: 0, fontFamily: 'var(--font-heading)' }}>Welcome back, {user.name}</h2>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--fg-subtle)' }}>
              Current Plan: <span style={{ textTransform: 'uppercase', fontWeight: 700, color: 'var(--primary)' }}>{user.plan}</span>
              {user.plan === 'free' && ` | Roasts Used: ${user.roastCountThisMonth}/3`}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {user.plan === 'free' && (
            <button onClick={() => onUpgradePlan('pro')} className="btn btn-secondary" style={{ color: 'var(--accent)', borderColor: 'var(--accent)' }} id="upgrade-pro-btn">
              ⭐ Go Pro (Unlimited Roasts)
            </button>
          )}
          {user.plan !== 'team' && (
            <button onClick={() => onUpgradePlan('team')} className="btn btn-glass" style={{ borderColor: 'var(--primary)' }} id="upgrade-team-btn">
              👥 Upgrade to Team Workspace
            </button>
          )}
        </div>
      </div>

      {/* COMPARISON VIEW */}
      {isComparing && selectedForCompare.length === 2 && (() => {
        const startupA = startups.find(s => s.id === selectedForCompare[0]);
        const startupB = startups.find(s => s.id === selectedForCompare[1]);
        const reportA = startupA ? getStartupReport(startupA.id) : null;
        const reportB = startupB ? getStartupReport(startupB.id) : null;

        if (!startupA || !startupB || !reportA || !reportB) return null;

        return (
          <div className="card" style={{ marginBottom: '2.5rem', border: '2px solid var(--primary)', animation: 'modalEnter 0.3s ease-out', textAlign: 'left' }}>
            <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '1.35rem', color: 'var(--primary)' }}>⚔️ Startup Idea Comparison</h3>
              <button onClick={closeComparison} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                Close Comparison
              </button>
            </div>

            <div className="grid" style={{ gridTemplateColumns: '1.2fr 2fr 2fr', gap: '1.5rem', fontSize: '0.9rem' }}>
              {/* Table header */}
              <div style={{ fontWeight: 700, color: 'var(--fg-subtle)' }}>Criteria</div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--primary)' }}>{startupA.name}</div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--primary)' }}>{startupB.name}</div>

              {/* Rows */}
              <div style={{ borderTop: '1px solid var(--border)', paddingBlock: '0.75rem', fontWeight: 600 }}>One-Line Idea</div>
              <div style={{ borderTop: '1px solid var(--border)', paddingBlock: '0.75rem', fontStyle: 'italic' }}>"{startupA.oneLineIdea}"</div>
              <div style={{ borderTop: '1px solid var(--border)', paddingBlock: '0.75rem', fontStyle: 'italic' }}>"{startupB.oneLineIdea}"</div>

              <div style={{ borderTop: '1px solid var(--border)', paddingBlock: '0.75rem', fontWeight: 600 }}>Overall Score</div>
              <div style={{ borderTop: '1px solid var(--border)', paddingBlock: '0.75rem', fontSize: '1.25rem', fontWeight: 800, color: getScoreColor(reportA.scorecard.overall) }}>{reportA.scorecard.overall} / 10</div>
              <div style={{ borderTop: '1px solid var(--border)', paddingBlock: '0.75rem', fontSize: '1.25rem', fontWeight: 800, color: getScoreColor(reportB.scorecard.overall) }}>{reportB.scorecard.overall} / 10</div>

              <div style={{ borderTop: '1px solid var(--border)', paddingBlock: '0.75rem', fontWeight: 600 }}>Success Probability</div>
              <div style={{ borderTop: '1px solid var(--border)', paddingBlock: '0.75rem', fontSize: '1.25rem', fontWeight: 800, color: getScoreColor(reportA.successProbability / 10) }}>{reportA.successProbability}%</div>
              <div style={{ borderTop: '1px solid var(--border)', paddingBlock: '0.75rem', fontSize: '1.25rem', fontWeight: 800, color: getScoreColor(reportB.successProbability / 10) }}>{reportB.successProbability}%</div>

              <div style={{ borderTop: '1px solid var(--border)', paddingBlock: '0.75rem', fontWeight: 600 }}>Problem Urgency</div>
              <div style={{ borderTop: '1px solid var(--border)', paddingBlock: '0.75rem' }}>{reportA.scorecard.problem} / 10</div>
              <div style={{ borderTop: '1px solid var(--border)', paddingBlock: '0.75rem' }}>{reportB.scorecard.problem} / 10</div>

              <div style={{ borderTop: '1px solid var(--border)', paddingBlock: '0.75rem', fontWeight: 600 }}>Market Opportunity</div>
              <div style={{ borderTop: '1px solid var(--border)', paddingBlock: '0.75rem' }}>{reportA.scorecard.market} / 10</div>
              <div style={{ borderTop: '1px solid var(--border)', paddingBlock: '0.75rem' }}>{reportB.scorecard.market} / 10</div>

              <div style={{ borderTop: '1px solid var(--border)', paddingBlock: '0.75rem', fontWeight: 600 }}>Top Risk</div>
              <div style={{ borderTop: '1px solid var(--border)', paddingBlock: '0.75rem', color: 'var(--danger)' }}>{reportA.roastSection.topRisks[0] || 'N/A'}</div>
              <div style={{ borderTop: '1px solid var(--border)', paddingBlock: '0.75rem', color: 'var(--danger)' }}>{reportB.roastSection.topRisks[0] || 'N/A'}</div>

              <div style={{ borderTop: '1px solid var(--border)', paddingBlock: '0.75rem', fontWeight: 600 }}>Must Build (MVP)</div>
              <div style={{ borderTop: '1px solid var(--border)', paddingBlock: '0.75rem' }}>{reportA.mvpRecommendation.mustBuild[0] || 'N/A'}</div>
              <div style={{ borderTop: '1px solid var(--border)', paddingBlock: '0.75rem' }}>{reportB.mvpRecommendation.mustBuild[0] || 'N/A'}</div>

              <div style={{ borderTop: '1px solid var(--border)', paddingBlock: '0.75rem', fontWeight: 600 }}>Target Customer</div>
              <div style={{ borderTop: '1px solid var(--border)', paddingBlock: '0.75rem', color: 'var(--fg-subtle)' }}>{startupA.targetCustomer}</div>
              <div style={{ borderTop: '1px solid var(--border)', paddingBlock: '0.75rem', color: 'var(--fg-subtle)' }}>{startupB.targetCustomer}</div>
            </div>
          </div>
        );
      })()}

      {/* DASHBOARD GRID */}
      <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ textAlign: 'left' }}>
          <h2 style={{ fontSize: '1.6rem', margin: 0, fontFamily: 'var(--font-heading)' }}>
            {user.plan === 'team' ? '🏢 Team Workspace Ideas' : '📁 Saved Startup Ideas'}
          </h2>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--fg-subtle)' }}>
            Select any idea to view its roast report or check two ideas to compare.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {selectedForCompare.length === 2 && (
            <button onClick={startComparison} className="btn btn-accent" style={{ animation: 'jitter 0.15s ease-out' }} id="compare-now-btn">
              ⚔️ Compare Selected (2)
            </button>
          )}
          <button onClick={onNewRoast} className="btn btn-primary" id="roast-new-idea-btn">
            Roast New Idea 🔥
          </button>
        </div>
      </div>

      {startups.length === 0 ? (
        <div className="card" style={{ paddingBlock: '4rem', textAlign: 'center' }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>🏜️</span>
          <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)', marginBottom: '0.5rem' }}>No ideas validated yet</h3>
          <p style={{ color: 'var(--fg-subtle)', marginBottom: '1.5rem' }}>Run your first startup validation report now to see it in your dashboard.</p>
          <button onClick={onNewRoast} className="btn btn-primary">Roast My First Idea 🔥</button>
        </div>
      ) : (
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem', textAlign: 'left' }}>
          {startups.map((startup) => {
            const report = getStartupReport(startup.id);
            const isChecked = selectedForCompare.includes(startup.id);

            return (
              <div key={startup.id} className="card card-hover" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: isChecked ? '2px solid var(--primary)' : '1px solid var(--border)' }}>
                <div>
                  <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input 
                        type="checkbox" 
                        id={`compare-${startup.id}`}
                        checked={isChecked}
                        onChange={() => handleCheckboxChange(startup.id)}
                        style={{ width: '1.1rem', height: '1.1rem', cursor: 'pointer' }}
                      />
                      <label htmlFor={`compare-${startup.id}`} style={{ fontSize: '0.75rem', color: 'var(--fg-subtle)', cursor: 'pointer', userSelect: 'none' }}>Compare</label>
                    </div>

                    {report && (
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        backgroundColor: getScoreColor(report.scorecard.overall),
                        color: 'white',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '0.25rem'
                      }}>
                        Score: {report.scorecard.overall}
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', cursor: 'pointer' }} onClick={() => onViewReport(startup.id)}>
                    {startup.name}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--fg)', fontStyle: 'italic', marginBottom: '0.75rem' }}>
                    "{startup.oneLineIdea}"
                  </p>
                  
                  {report && (
                    <div style={{ fontSize: '0.825rem', color: 'var(--fg-subtle)', marginBottom: '1rem' }}>
                      <div style={{ marginBottom: '0.25rem' }}>
                        🔥 <strong>Risks:</strong> {report.roastSection.topRisks[0] ? (report.roastSection.topRisks[0].length > 65 ? report.roastSection.topRisks[0].substring(0, 65) + '...' : report.roastSection.topRisks[0]) : 'None'}
                      </div>
                      <div>
                        🌱 <strong>Opps:</strong> {report.positiveSignals.opportunities[0] ? (report.positiveSignals.opportunities[0].length > 65 ? report.positiveSignals.opportunities[0].substring(0, 65) + '...' : report.positiveSignals.opportunities[0]) : 'None'}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                  <button onClick={() => onViewReport(startup.id)} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} id={`view-report-${startup.id}-btn`}>
                    View Report &rarr;
                  </button>
                  <button 
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete ${startup.name}?`)) {
                        onDeleteStartup(startup.id);
                      }
                    }} 
                    className="btn btn-secondary" 
                    style={{ padding: '0.4rem 0.6rem', color: 'var(--danger)', borderColor: 'transparent', fontSize: '0.8rem' }}
                    title="Delete Idea"
                    id={`delete-startup-${startup.id}-btn`}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
