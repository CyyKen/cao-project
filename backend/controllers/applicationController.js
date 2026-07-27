const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');

const APPLICATION_STATUSES = {
  APPLIED: 'Applied',
  EXAMINED: 'Examined',
  PASSED_EXAM: 'Passed_Exam',
  REQUIREMENTS_SUBMITTED: 'Requirements_Submitted',
  ACTIVE_SCHOLAR: 'Active_Scholar',
  PAYOUT_COMPLIANT: 'Payout_Compliant',
  IN_PAYROLL: 'In_Payroll',
  PAID: 'Paid',
};

const PASSING_SCORE = 75;

const createApplication = async (req, res) => {
  try {
    const { email, personalInfo, initialDocs } = req.body;

    if (!personalInfo || typeof personalInfo !== 'object') {
      return res.status(400).json({ message: 'Missing required application fields.' });
    }

    let user = req.user;
    if (!user) {
      if (!email || typeof email !== 'string') {
        return res.status(400).json({ message: 'Email is required for anonymous application submissions.' });
      }

      const normalizedEmail = email.toLowerCase().trim();
      user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
      if (!user) {
        const passwordHash = await bcrypt.hash(`Scholar@${Math.random().toString(36).slice(2, 10)}`, 12);
        user = await prisma.user.create({
          data: {
            email: normalizedEmail,
            passwordHash,
            role: 'Applicant',
          },
        });
      }
    } else {
      user = await prisma.user.findUnique({ where: { id: req.user.id } });
      if (!user) {
        return res.status(401).json({ message: 'Authenticated user not found.' });
      }
    }

    const existingScholar = await prisma.scholar.findUnique({ where: { userId: user.id } });
    if (existingScholar) {
      return res.status(409).json({ message: 'Scholar profile already exists for this user.' });
    }

    const scholar = await prisma.scholar.create({
      data: {
        user: { connect: { id: user.id } },
        personalInfo,
        status: APPLICATION_STATUSES.APPLIED,
        initialDocs: initialDocs || {},
        payoutComplianceDocs: {},
      },
    });

    return res.status(201).json({ message: 'Application submitted.', scholar });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error submitting application.' });
  }
};

const inputExamScore = async (req, res) => {
  try {
    const { id } = req.params;
    const { examScore } = req.body;

    if (typeof examScore !== 'number') {
      return res.status(400).json({ message: 'Exam score must be a number.' });
    }

    const scholar = await prisma.scholar.findUnique({ where: { id: Number(id) } });
    if (!scholar) {
      return res.status(404).json({ message: 'Scholar application not found.' });
    }

    const updatedStatus = examScore >= PASSING_SCORE ? APPLICATION_STATUSES.PASSED_EXAM : APPLICATION_STATUSES.EXAMINED;

    const updatedScholar = await prisma.scholar.update({
      where: { id: Number(id) },
      data: {
        examScore,
        status: updatedStatus,
      },
    });

    return res.status(200).json({ message: 'Exam score updated.', scholar: updatedScholar });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error updating exam score.' });
  }
};

const submitRequirements = async (req, res) => {
  try {
    const { id } = req.params;
    const { payoutComplianceDocs } = req.body;

    const scholar = await prisma.scholar.findUnique({ where: { id: Number(id) } });
    if (!scholar) {
      return res.status(404).json({ message: 'Scholar record not found.' });
    }

    if (req.user.id !== scholar.userId && req.user.role !== 'SuperAdmin') {
      return res.status(403).json({ message: 'Access Denied. Cannot update this scholar.' });
    }

    const updatedScholar = await prisma.scholar.update({
      where: { id: Number(id) },
      data: {
        payoutComplianceDocs: payoutComplianceDocs || scholar.payoutComplianceDocs,
        status: APPLICATION_STATUSES.REQUIREMENTS_SUBMITTED,
      },
    });

    return res.status(200).json({ message: 'Requirements submitted.', scholar: updatedScholar });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error submitting requirements.' });
  }
};

const activateScholar = async (req, res) => {
  try {
    const { id } = req.params;
    const scholar = await prisma.scholar.findUnique({ where: { id: Number(id) } });
    if (!scholar) {
      return res.status(404).json({ message: 'Scholar record not found.' });
    }

    const updatedScholar = await prisma.scholar.update({
      where: { id: Number(id) },
      data: {
        status: APPLICATION_STATUSES.ACTIVE_SCHOLAR,
      },
    });

    return res.status(200).json({ message: 'Scholar activated.', scholar: updatedScholar });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error activating scholar.' });
  }
};

const markPayoutCompliant = async (req, res) => {
  try {
    const { id } = req.params;
    const scholar = await prisma.scholar.findUnique({ where: { id: Number(id) } });
    if (!scholar) {
      return res.status(404).json({ message: 'Scholar record not found.' });
    }

    const updatedScholar = await prisma.scholar.update({
      where: { id: Number(id) },
      data: {
        status: APPLICATION_STATUSES.PAYOUT_COMPLIANT,
      },
    });

    return res.status(200).json({ message: 'Scholar marked payout compliant.', scholar: updatedScholar });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error updating scholar payout status.' });
  }
};

const getEligibleScholars = async (req, res) => {
  try {
    const eligibleStatuses = [APPLICATION_STATUSES.ACTIVE_SCHOLAR, APPLICATION_STATUSES.PAYOUT_COMPLIANT];
    const scholars = await prisma.scholar.findMany({
      where: { status: { in: eligibleStatuses } },
      include: { user: { select: { id: true, email: true, role: true } } },
    });

    return res.status(200).json({ scholars });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error fetching eligible scholars.' });
  }
};

const getScholarsByStatus = async (req, res) => {
  try {
    const { status } = req.query;
    if (!status || !Object.values(APPLICATION_STATUSES).includes(status)) {
      return res.status(400).json({ message: 'A valid scholar status query is required.' });
    }

    const scholars = await prisma.scholar.findMany({
      where: { status },
      include: { user: { select: { id: true, email: true, role: true } } },
    });

    return res.status(200).json({ scholars });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error fetching scholars by status.' });
  }
};

const createPayrollBatch = async (req, res) => {
  try {
    const { totalAmount } = req.body;
    if (typeof totalAmount !== 'number' || totalAmount < 0) {
      return res.status(400).json({ message: 'A valid total amount is required.' });
    }

    const eligibleScholars = await prisma.scholar.findMany({ where: { status: APPLICATION_STATUSES.PAYOUT_COMPLIANT } });
    if (!eligibleScholars.length) {
      return res.status(400).json({ message: 'No payout-compliant scholars available for batching.' });
    }

    const batch = await prisma.payrollBatch.create({
      data: {
        createdBy: { connect: { id: req.user.id } },
        totalAmount,
        status: 'pending',
        scholars: {
          connect: eligibleScholars.map((scholar) => ({ id: scholar.id })),
        },
      },
      include: { scholars: true },
    });

    await prisma.scholar.updateMany({
      where: { id: { in: eligibleScholars.map((scholar) => scholar.id) } },
      data: { status: APPLICATION_STATUSES.IN_PAYROLL, payrollBatchId: batch.id },
    });

    return res.status(201).json({ message: 'Payroll batch created.', batch });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error creating payroll batch.' });
  }
};

const releasePayrollBatch = async (req, res) => {
  try {
    const { id } = req.params;
    const batch = await prisma.payrollBatch.findUnique({
      where: { id: Number(id) },
      include: { scholars: true },
    });

    if (!batch) {
      return res.status(404).json({ message: 'Payroll batch not found.' });
    }

    const updatedBatch = await prisma.payrollBatch.update({
      where: { id: Number(id) },
      data: { status: 'released' },
    });

    await prisma.scholar.updateMany({
      where: { payrollBatchId: Number(id), status: APPLICATION_STATUSES.IN_PAYROLL },
      data: { status: APPLICATION_STATUSES.PAID },
    });

    return res.status(200).json({ message: 'Payroll batch released.', batch: updatedBatch });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error releasing payroll batch.' });
  }
};

const markPaid = async (req, res) => {
  try {
    const { id } = req.params;
    const scholar = await prisma.scholar.findUnique({ where: { id: Number(id) } });
    if (!scholar) {
      return res.status(404).json({ message: 'Scholar record not found.' });
    }

    const updatedScholar = await prisma.scholar.update({
      where: { id: Number(id) },
      data: {
        status: APPLICATION_STATUSES.PAID,
      },
    });

    return res.status(200).json({ message: 'Scholar marked paid.', scholar: updatedScholar });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error marking scholar paid.' });
  }
};

const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const scholar = await prisma.scholar.findUnique({
      where: { id: Number(id) },
      include: { user: { select: { id: true, email: true, role: true } } },
    });

    if (!scholar) {
      return res.status(404).json({ message: 'Scholar application not found.' });
    }

    const isOwner = req.user.id === scholar.userId;
    const allowedViewerRoles = ['SuperAdmin', 'BillingPayrollAdmin'];

    if (!isOwner && !allowedViewerRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access Denied. Cannot view this application.' });
    }

    return res.status(200).json({ scholar });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error fetching application.' });
  }
};

const createAnnouncement = async (req, res) => {
  try {
    const { title, content } = req.body;
    const announcement = await prisma.announcement.create({
      data: {
        title,
        content,
        author: { connect: { id: req.user.id } },
      },
    });

    return res.status(201).json({ message: 'Announcement created.', announcement });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error creating announcement.' });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (req.user.id === Number(id)) {
      return res.status(400).json({ message: 'Super Admin cannot change their own role through this endpoint.' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: { role },
    });

    return res.status(200).json({ message: 'User role updated.', user: { id: updatedUser.id, email: updatedUser.email, role: updatedUser.role } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error updating user role.' });
  }
};

const getDashboardSummary = async (req, res) => {
  try {
    const [applicants, activeScholars, forfeitedAccounts, schools, activity] = await Promise.all([
      prisma.applicants.findMany({ where: { deleted_at: null }, orderBy: { created_at: 'desc' }, take: 7, select: { id: true, first_name: true, middle_name: true, last_name: true, status: true } }),
      prisma.scholar_accounts.count({ where: { is_active: true } }),
      prisma.exam_slots.count({ where: { forfeited_at: { not: null } } }),
      prisma.schools.findMany({ orderBy: { name: 'asc' }, take: 7, select: { name: true, school_type: true } }),
      prisma.activity_logs.findMany({ orderBy: { created_at: 'desc' }, take: 4, select: { id: true, action: true, description: true, created_at: true } }),
    ]);
    const applicantIds = applicants.map(({ id }) => id);
    const accounts = applicantIds.length ? await prisma.control_accounts.findMany({ where: { applicant_id: { in: applicantIds } }, select: { applicant_id: true, control_number: true } }) : [];
    const controlNumbers = new Map(accounts.map((account) => [account.applicant_id, account.control_number]));
    return res.json({
      stats: { activeScholars, forfeitedAccounts },
      recentApplications: applicants.map((applicant) => ({ name: [applicant.first_name, applicant.middle_name, applicant.last_name].filter(Boolean).join(' ').toUpperCase(), controlNo: controlNumbers.get(applicant.id) || `Applicant #${applicant.id}`, status: applicant.status })),
      schoolCatalog: schools.map((school) => ({ name: school.name, classification: school.school_type })),
      recentActivity: activity.map((entry) => ({ title: entry.action, detail: entry.description || 'System activity recorded', status: 'INFO', time: entry.created_at })),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error fetching dashboard summary.' });
  }
};

const getApplicantManagement = async (req, res) => {
  try {
    const applicants = await prisma.applicants.findMany({ where: { deleted_at: null }, orderBy: { created_at: 'desc' }, select: { id: true, first_name: true, middle_name: true, last_name: true, email: true, municipality: true, barangay: true, school_year: true, status: true, created_at: true } });
    const applicantIds = applicants.map(({ id }) => id);
    const [accounts, slots, results] = await Promise.all([
      prisma.control_accounts.findMany({ where: { applicant_id: { in: applicantIds } }, select: { applicant_id: true, control_number: true, last_login_at: true } }),
      prisma.exam_slots.findMany({ where: { applicant_id: { in: applicantIds } }, select: { applicant_id: true } }),
      prisma.results.findMany({ where: { applicant_id: { in: applicantIds } }, select: { applicant_id: true, passed: true } }),
    ]);
    const accountByApplicant = new Map(accounts.map((account) => [account.applicant_id, account]));
    const resultByApplicant = new Map(results.map((result) => [result.applicant_id, result]));
    return res.json({
      stats: { total: applicants.length, scheduled: slots.length, completed: results.length, passed: results.filter(({ passed }) => passed).length },
      applicants: applicants.map((applicant) => {
        const account = accountByApplicant.get(applicant.id);
        const result = resultByApplicant.get(applicant.id);
        return {
          id: applicant.id,
          name: [applicant.last_name, applicant.first_name, applicant.middle_name].filter(Boolean).join(', '),
          initials: `${applicant.first_name[0] || ''}${applicant.last_name[0] || ''}`.toUpperCase(),
          username: `${applicant.first_name}.${applicant.last_name}`.toLowerCase(),
          controlNo: account?.control_number || `Applicant #${applicant.id}`,
          email: applicant.email,
          municipality: applicant.municipality || 'Not specified',
          barangay: applicant.barangay || 'Not specified',
          schoolYear: applicant.school_year || 'Not specified',
          registered: applicant.created_at,
          lastLogin: account?.last_login_at || null,
          status: result?.passed ? 'Passed' : result ? 'Exam Completed' : applicant.status === 'pending' ? 'Pending' : applicant.status,
        };
      }),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error fetching applicants.' });
  }
};

module.exports = {
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
};
