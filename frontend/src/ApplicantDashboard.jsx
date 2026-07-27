import {
  Bell,
  CalendarDays,
  ChevronRight,
  ClipboardList,
  FileText,
  LogOut,
  MessageCircleQuestion,
  UserRound,
} from 'lucide-react';

function ApplicantDashboard({ user, onLogout }) {
  const displayName = user?.email?.split('@')[0]?.replace(/[._-]/g, ' ') || 'Applicant';
  const controlNumber = user?.controlNumber || 'PGCEAP-APP-021';

  return (
    <div className="applicant-dashboard">
      <header className="scholar-header applicant-header">
        <div className="scholar-brand"><div className="scholar-brand-mark applicant-brand-mark"><ClipboardList size={21} /></div><div><span>PGCEAP</span><strong>Applicant Portal</strong></div></div>
        <div className="scholar-header-actions"><button type="button" className="scholar-icon-button" aria-label="Notifications"><Bell size={19} /><i /></button><div className="scholar-user-chip"><span>{displayName.charAt(0).toUpperCase()}</span><div><strong>{displayName}</strong><small>Applicant</small></div></div><button type="button" className="scholar-logout" onClick={onLogout}><LogOut size={16} /> Log out</button></div>
      </header>

      <main className="applicant-dashboard-main">
        <section className="applicant-welcome-card"><div><p className="applicant-eyebrow">APPLICANT ACCOUNT</p><h1>Welcome, {displayName}!</h1><p>Complete your application and stay updated on your PGCEAP scholarship journey.</p></div><div className="applicant-welcome-icon"><ClipboardList size={40} /></div></section>

        <section className="applicant-stat-grid"><article className="applicant-stat-card"><div className="applicant-stat-icon green"><FileText size={21} /></div><div><span>Application status</span><strong>In progress</strong><small>Continue where you left off</small></div></article><article className="applicant-stat-card"><div className="applicant-stat-icon gold"><CalendarDays size={21} /></div><div><span>Application deadline</span><strong>August 15, 2026</strong><small>Keep your documents ready</small></div></article><article className="applicant-stat-card"><div className="applicant-stat-icon blue"><ClipboardList size={21} /></div><div><span>Application progress</span><strong>Step 2 of 4</strong><small>Academic information next</small></div></article></section>

        <div className="applicant-content-grid"><section className="applicant-panel applicant-continue-panel"><div className="applicant-panel-heading"><div><p className="applicant-eyebrow">YOUR APPLICATION</p><h2>Continue your application</h2></div><span className="applicant-progress-badge">40% complete</span></div><p className="applicant-panel-copy">You’ve completed your personal information. Continue with your academic and family details to submit your application.</p><div className="applicant-progress-track"><span /></div><div className="applicant-step-list"><div className="applicant-step done"><span>✓</span><div><strong>Personal information</strong><small>Completed</small></div></div><div className="applicant-step active"><span>2</span><div><strong>Academic information</strong><small>Next step</small></div></div><div className="applicant-step"><span>3</span><div><strong>Family and financial information</strong><small>Not started</small></div></div><div className="applicant-step"><span>4</span><div><strong>Review and submit</strong><small>Not started</small></div></div></div><button type="button" className="applicant-primary-button">Continue application <ChevronRight size={17} /></button></section><section className="applicant-panel applicant-info-panel"><div className="applicant-panel-heading"><div><p className="applicant-eyebrow">ACCOUNT INFORMATION</p><h2>Your details</h2></div><UserRound size={20} className="applicant-heading-icon" /></div><div className="applicant-detail"><span>Control number</span><strong>{controlNumber}</strong></div><div className="applicant-detail"><span>Email address</span><strong>{user?.email || 'applicant@example.com'}</strong></div><div className="applicant-detail"><span>Account status</span><strong className="applicant-status">Active</strong></div><button type="button" className="applicant-text-button">View profile <ChevronRight size={15} /></button></section></div>

        <section className="applicant-bottom-grid"><article className="applicant-panel"><div className="applicant-panel-heading"><div><p className="applicant-eyebrow">FROM CAO</p><h2>What happens next?</h2></div><MessageCircleQuestion size={20} className="applicant-heading-icon" /></div><p className="applicant-panel-copy">After submitting your application, the CAO team will review your information and notify you about the qualifying examination schedule.</p><a className="applicant-link" href="#requirements">Learn more <ChevronRight size={15} /></a></article><article className="applicant-panel applicant-notice-panel"><div className="applicant-panel-heading"><div><p className="applicant-eyebrow">REMINDER</p><h2>Prepare your documents</h2></div><FileText size={20} className="applicant-heading-icon" /></div><p className="applicant-panel-copy">Have your school records, valid identification, and family income documents ready before you submit.</p></article></section>
        <footer className="scholar-footer"><CalendarDays size={14} /> Need help? Contact the Community Affairs Office for assistance.</footer>
      </main>
    </div>
  );
}

export default ApplicantDashboard;
