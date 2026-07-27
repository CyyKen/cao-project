const express = require('express');
const { authenticate, authenticateOptional } = require('../middleware/auth');
const { checkRole } = require('../middleware/rbac');
const {
  createApplication,
  inputExamScore,
  submitRequirements,
  activateScholar,
  markPayoutCompliant,
  markPaid,
  createPayrollBatch,
  releasePayrollBatch,
  getEligibleScholars,
  getScholarsByStatus,
  getApplicationById,
  createAnnouncement,
  updateUserRole,
  getDashboardSummary,
  getApplicantManagement,
} = require('../controllers/applicationController');
const {
  validateCreateApplication,
  validateExamInput,
  validateRequirements,
  validatePayrollBatch,
  validateAnnouncement,
  validateRoleUpdate,
} = require('../middleware/validators');

const router = express.Router();

router.get('/dashboard/summary', authenticate, checkRole(['SuperAdmin', 'RegularAdmin']), getDashboardSummary);
router.get('/applicants/management', authenticate, checkRole(['SuperAdmin', 'RegularAdmin']), getApplicantManagement);

// Public route to create a baseline application and optionally register a user
router.post('/applications', authenticateOptional, validateCreateApplication, createApplication);

// Get application by ID (owner or privileged roles)
router.get('/applications/:id', authenticate, checkRole(['SuperAdmin', 'BillingPayrollAdmin', 'Applicant', 'Scholar']), getApplicationById);

// Super Admin only route to input exam results
router.put('/applications/:id/exam', authenticate, checkRole(['SuperAdmin']), validateExamInput, inputExamScore);

// Applicant / Scholar route to upload baseline requirements
router.put('/applications/:id/requirements', authenticate, checkRole(['Applicant', 'Scholar']), validateRequirements, submitRequirements);

// Super Admin route to activate a scholar as eligible
router.put('/applications/:id/activate', authenticate, checkRole(['SuperAdmin']), activateScholar);

// Billing/Payroll Admin route to mark scholar payout compliance
router.put('/applications/:id/payout-compliant', authenticate, checkRole(['BillingPayrollAdmin']), markPayoutCompliant);

// Billing/Payroll Admin route to mark an individual scholar as paid
router.put('/applications/:id/paid', authenticate, checkRole(['BillingPayrollAdmin']), markPaid);

// Billing/Payroll Admin route to create a payroll batch from compliant scholars
router.post('/payroll/billing-batch', authenticate, checkRole(['BillingPayrollAdmin']), validatePayrollBatch, createPayrollBatch);

// Billing/Payroll Admin route to release a payroll batch and finalize payouts
router.put('/payroll/billing-batch/:id/release', authenticate, checkRole(['BillingPayrollAdmin']), releasePayrollBatch);

// List eligible scholars for payroll or review
router.get('/scholars/eligible', authenticate, checkRole(['SuperAdmin', 'BillingPayrollAdmin']), getEligibleScholars);

// List scholars by workflow status
router.get('/scholars', authenticate, checkRole(['SuperAdmin', 'BillingPayrollAdmin', 'Moderator']), getScholarsByStatus);

// Moderator or Super Admin route to post announcements
router.post('/announcements', authenticate, checkRole(['Moderator', 'SuperAdmin']), validateAnnouncement, createAnnouncement);

// Super Admin route to update a user's role
router.put('/users/:id/role', authenticate, checkRole(['SuperAdmin']), validateRoleUpdate, updateUserRole);

module.exports = router;
