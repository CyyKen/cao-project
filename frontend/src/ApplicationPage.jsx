import { useState } from 'react';
import { GraduationCap } from 'lucide-react';
import ApplicationForm from './components/ApplicationForm';

function ApplicationPage({ token, user }) {
  const [step, setStep] = useState(0);

  const handleCreated = (createdScholar) => {
    if (createdScholar) {
      setStep(0);
    }
  };

  return (
    <div className="application-page-shell">
      <header className="application-page-header">
        <div className="application-page-header-inner">
          <div className="application-brand">
            <div className="application-brand-mark" aria-hidden="true">
              <div className="text"></div>
              <GraduationCap />
            </div>
            <div className="application-brand-copy">
              <p className="application-brand-kicker">LOCAL GOVERNMENT UNIT</p>
              <h1>Scholarship Monitoring System</h1>
            </div>
          </div>

          <div className="application-page-pill">
            <span className="application-page-pill-dot" aria-hidden="true" />
            <span>Application Form - A.Y. 2024-2025</span>
          </div>
        </div>
      </header>

      <main className="application-stage">
        <ApplicationForm
          token={token}
          user={user}
          onCreated={handleCreated}
          step={step}
          setStep={setStep}
        />
      </main>

      <footer className="application-page-footer">
        Scholarship Monitoring System · All information is kept strictly confidential · A.Y. 2024-2025
      </footer>
    </div>
  );
}

export default ApplicationPage;
