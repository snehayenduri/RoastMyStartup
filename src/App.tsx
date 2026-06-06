import React, { useState, useEffect } from 'react';
import type { User, Startup, Report } from './db/schema';
import { mockDb, initDb } from './db/mockDb';
import { generateRoastReport } from './services/aiEngine';
import { ThemeToggle } from './components/ThemeToggle';
import { AuthModal } from './components/AuthModal';
import { LandingPage } from './components/LandingPage';
import { SubmissionWizard } from './components/SubmissionWizard';
import { Dashboard } from './components/Dashboard';
import { ReportView } from './components/ReportView';

export const App: React.FC = () => {
  // Init DB and seed data on load
  useEffect(() => {
    initDb();
  }, []);

  const [user, setUser] = useState<User | null>(() => {
    try {
      return mockDb.getCurrentUser();
    } catch {
      return null;
    }
  });

  const [startups, setStartups] = useState<Startup[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [view, setView] = useState<'landing' | 'wizard' | 'dashboard' | 'report'>('landing');
  const [currentStartup, setCurrentStartup] = useState<Startup | null>(null);
  const [currentReport, setCurrentReport] = useState<Report | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Sync startups and reports when user changes
  useEffect(() => {
    if (user) {
      setStartups(mockDb.getStartups());
      setReports(mockDb.getReports());
      if (view === 'landing') {
        setView('dashboard');
      }
    } else {
      setStartups([]);
      setReports([]);
      setView('landing');
    }
  }, [user]);

  const handleStartRoast = () => {
    if (!user) {
      setAuthModalOpen(true);
    } else {
      setView('wizard');
    }
  };

  const handleCompleteWizard = async (
    startupData: Omit<Startup, 'id' | 'userId' | 'createdAt'>,
    roastLevel: 'mild' | 'investor' | 'brutal' | 'nuclear',
    personality: 'yc' | 'vc' | 'pm' | 'founder' | 'marketer'
  ) => {
    try {
      // Save startup
      const savedStartup = mockDb.saveStartup(startupData);
      
      // Generate roast
      const generatedRoastData = await generateRoastReport(savedStartup, roastLevel, personality);
      const savedReport = mockDb.saveReport(generatedRoastData);

      // Update state
      setUser(mockDb.getCurrentUser());
      setStartups(mockDb.getStartups());
      setReports(mockDb.getReports());
      setCurrentStartup(savedStartup);
      setCurrentReport(savedReport);
      setView('report');
    } catch (err) {
      console.error(err);
      alert('Error generating roast report.');
    }
  };

  const handleViewReport = (startupId: string) => {
    const startup = startups.find(s => s.id === startupId);
    const report = reports.find(r => r.startupId === startupId);
    if (startup && report) {
      setCurrentStartup(startup);
      setCurrentReport(report);
      setView('report');
    }
  };

  const handleDeleteStartup = (id: string) => {
    mockDb.deleteStartup(id);
    setStartups(mockDb.getStartups());
    setReports(mockDb.getReports());
    if (currentStartup?.id === id) {
      setCurrentStartup(null);
      setCurrentReport(null);
      setView('dashboard');
    }
  };

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setView('dashboard');
  };

  const handleLogout = () => {
    mockDb.setCurrentUser(null);
    setUser(null);
    setView('landing');
  };

  const handleUpgradePlan = (plan: 'free' | 'pro' | 'team') => {
    if (!user) return;
    const updated = mockDb.updateUserPlan(plan);
    setUser(updated);
    alert(`Successfully upgraded to the ${plan.toUpperCase()} plan!`);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Global SaaS Header */}
      <header className="app-header">
        <div className="container header-container">
          <div className="logo" style={{ cursor: 'pointer' }} onClick={() => setView(user ? 'dashboard' : 'landing')}>
            <div className="logo-icon">🔥</div>
            <span>IdeaRoast AI</span>
          </div>

          <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }} className="btn-print-hide">
            {user ? (
              <>
                <button 
                  onClick={() => setView('dashboard')} 
                  className="btn" 
                  style={{ background: 'none', border: 'none', color: view === 'dashboard' ? 'var(--primary)' : 'var(--fg)', padding: 0 }}
                  id="nav-dashboard-btn"
                >
                  Dashboard
                </button>
                <button 
                  onClick={handleStartRoast} 
                  className="btn" 
                  style={{ background: 'none', border: 'none', color: view === 'wizard' ? 'var(--primary)' : 'var(--fg)', padding: 0 }}
                  id="nav-roast-btn"
                >
                  Roast Idea
                </button>
                <button 
                  onClick={handleLogout} 
                  className="btn btn-secondary" 
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.825rem' }}
                  id="nav-logout-btn"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <a href="#pricing-section" className="btn" style={{ background: 'none', border: 'none', color: 'var(--fg)' }}>
                  Pricing
                </a>
                <button 
                  onClick={() => setAuthModalOpen(true)} 
                  className="btn btn-primary" 
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.825rem' }}
                  id="nav-signin-btn"
                >
                  Sign In
                </button>
              </>
            )}
            
            <ThemeToggle />
          </nav>
        </div>
      </header>

      {/* Main App Content Viewport */}
      <main style={{ flex: 1 }}>
        {view === 'landing' && (
          <LandingPage 
            onStartRoast={handleStartRoast} 
            isAuthenticated={!!user}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}
        
        {view === 'wizard' && (
          <SubmissionWizard 
            onComplete={handleCompleteWizard}
            onCancel={() => setView(user ? 'dashboard' : 'landing')}
            userPlan={user?.plan || 'free'}
          />
        )}

        {view === 'dashboard' && user && (
          <Dashboard 
            startups={startups}
            reports={reports}
            user={user}
            onNewRoast={handleStartRoast}
            onViewReport={handleViewReport}
            onDeleteStartup={handleDeleteStartup}
            onUpgradePlan={handleUpgradePlan}
          />
        )}

        {view === 'report' && currentReport && currentStartup && (
          <ReportView 
            report={currentReport}
            startup={currentStartup}
            onBackToDashboard={() => setView('dashboard')}
          />
        )}
      </main>

      {/* Global Footer */}
      <footer style={{ 
        borderTop: '1px solid var(--border)', 
        paddingBlock: '2rem', 
        backgroundColor: 'var(--bg-subtle)', 
        color: 'var(--fg-subtle)', 
        fontSize: '0.85rem',
        textAlign: 'center' 
      }} className="btn-print-hide">
        <div className="container">
          <p style={{ margin: 0 }}>&copy; {new Date().getFullYear()} IdeaRoast AI. Roast your startups, save your runway. Built with pride.</p>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

    </div>
  );
};

export default App;
