import {
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  FileCheck2,
  GraduationCap,
  LogOut,
  UserRound,
} from 'lucide-react';

const timeline = [
  { label: 'Application submitted', date: 'July 01, 2026', complete: true },
  { label: 'Qualifying examination', date: 'July 12, 2026', complete: true },
  { label: 'Scholarship approval', date: 'July 18, 2026', complete: true },
  { label: 'Submit current requirements', date: 'Due August 15, 2026', active: true },
  { label: 'Allowance release', date: 'Upcoming', complete: false },
];

function ScholarDashboard({ user, onLogout }) {
  const displayName = user?.email?.split('@')[0]?.replace(/[._-]/g, ' ') || 'Scholar';

  return (
    <div className="scholar-dashboard">
      <header className="scholar-header">
        <div className="scholar-brand">
          <div className="scholar-brand-mark"><GraduationCap size={22} /></div>
          <div><span>PGCEAP</span><strong>Scholar Portal</strong></div>
        </div>
        <div className="scholar-header-actions">
          <button type="button" className="scholar-icon-button" aria-label="Notifications"><Bell size={19} /><i /></button>
          <div className="scholar-user-chip"><span>{displayName.charAt(0).toUpperCase()}</span><div><strong>{displayName}</strong><small>Scholar</small></div></div>
          <button type="button" className="scholar-logout" onClick={onLogout}><LogOut size={16} /> Log out</button>
        </div>
      </header>

      <main className="scholar-dashboard-main">
        <section className="scholar-welcome-card">
          <div><p className="scholar-eyebrow">SCHOLAR ACCOUNT</p><h1>Good morning, {displayName}!</h1><p>Here’s a quick look at your scholarship progress and next steps.</p></div>
          <div className="scholar-welcome-icon"><GraduationCap size={42} /></div>
        </section>

        <section className="scholar-stat-grid">
          <article className="scholar-stat-card"><div className="scholar-stat-icon green"><CheckCircle2 size={21} /></div><div><span>Scholarship status</span><strong>Active Scholar</strong><small>Approved July 18, 2026</small></div></article>
          <article className="scholar-stat-card"><div className="scholar-stat-icon gold"><CircleDollarSign size={21} /></div><div><span>Next allowance</span><strong>₱5,000.00</strong><small>Release schedule to follow</small></div></article>
          <article className="scholar-stat-card"><div className="scholar-stat-icon blue"><FileCheck2 size={21} /></div><div><span>Requirements</span><strong>4 of 6 submitted</strong><small>2 documents need your attention</small></div></article>
        </section>

        <div className="scholar-content-grid">
          <section className="scholar-panel scholar-progress-panel">
            <div className="scholar-panel-heading"><div><p className="scholar-eyebrow">YOUR JOURNEY</p><h2>Scholarship progress</h2></div><span className="scholar-progress-percent">75%</span></div>
            <div className="scholar-progress-track"><span /></div>
            <div className="scholar-timeline">
              {timeline.map((item) => <div className={`scholar-timeline-item ${item.active ? 'active' : ''}`} key={item.label}><span className="scholar-timeline-dot">{item.complete ? <CheckCircle2 size={15} /> : item.active ? <span /> : null}</span><div><strong>{item.label}</strong><small>{item.date}</small></div></div>)}
            </div>
          </section>

          <section className="scholar-panel scholar-action-panel">
            <div className="scholar-panel-heading"><div><p className="scholar-eyebrow">ACTION NEEDED</p><h2>Complete your requirements</h2></div><FileCheck2 size={21} className="scholar-heading-icon" /></div>
            <p className="scholar-panel-copy">Upload the remaining documents before the deadline to keep your scholarship active.</p>
            <div className="scholar-requirement-row"><span>Certificate of registration</span><strong className="done">Submitted</strong></div>
            <div className="scholar-requirement-row"><span>Grade report card</span><strong className="done">Submitted</strong></div>
            <div className="scholar-requirement-row"><span>Valid ID photocopy</span><strong className="pending">Pending</strong></div>
            <button type="button" className="scholar-primary-button">View requirements <ChevronRight size={17} /></button>
          </section>
        </div>

        <section className="scholar-bottom-grid">
          <article className="scholar-panel scholar-announcement-panel"><div className="scholar-panel-heading"><div><p className="scholar-eyebrow">FROM CAO</p><h2>Latest announcement</h2></div><Bell size={20} className="scholar-heading-icon" /></div><h3>Submission of first semester requirements</h3><p>Remember to complete your remaining documents on or before August 15, 2026.</p><a href="#requirements">Read announcement <ChevronRight size={15} /></a></article>
          <article className="scholar-panel scholar-profile-panel"><div className="scholar-panel-heading"><div><p className="scholar-eyebrow">ACCOUNT DETAILS</p><h2>My profile</h2></div><UserRound size={20} className="scholar-heading-icon" /></div><div className="scholar-profile-detail"><span>Control number</span><strong>{user?.controlNumber || 'PGCEAP-SCH-001'}</strong></div><div className="scholar-profile-detail"><span>Email address</span><strong>{user?.email || 'scholar@example.com'}</strong></div><button type="button" className="scholar-text-button">View profile <ChevronRight size={15} /></button></article>
        </section>
        <footer className="scholar-footer"><CalendarDays size={14} /> Need help? Contact the Community Affairs Office for assistance.</footer>
      </main>
    </div>
  );
}

export default ScholarDashboard;
