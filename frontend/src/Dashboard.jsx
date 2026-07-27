import {
  Archive,
  BadgeCheck,
  BookText,
  CalendarDays,
  Calculator,
  ChartColumn,
  ClipboardList,
  Clock3,
  FileCheck2,
  FilePenLine,
  FileText,
  FlaskConical,
  FolderOpen,
  GraduationCap,
  HardDrive,
  Eye,
  Info,
  ListTodo,
  Megaphone,
  NotebookPen,
  Puzzle,
  Rocket,
  School,
  Search,
  Send,
  Settings2,
  ShieldAlert,
  ShieldCheck,
  TriangleAlert,
  UserCog,
  UsersRound,
  Boxes,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { API_BASE, authHeaders } from './services/api';
import schoolsListData from '../../schools_list.json';
import municipalitiesData from '../../municipality.json';
import barangaysData from '../../brgy.json';

const schoolCatalogFromJson = schoolsListData.schools.map((name) => ({
  name,
  classification: 'School',
}));
const municipalityNames = [...new Set(municipalitiesData.map((item) => item.name))];

const metricIconByLabel = {
  'Open Applications': FileText,
  'Active Scholars': UsersRound,
  'Pending Reviews': Clock3,
  'Role Updates': ShieldCheck,
  Submitted: FileCheck2,
  Incomplete: ClipboardList,
  'For Review': Search,
  Approved: BadgeCheck,
  'Staff Members': UserCog,
  'Active Tasks': ListTodo,
  'Open Requests': Clock3,
  'Access Reviews': ShieldCheck,
  'Payout Compliant': BadgeCheck,
  'In Payroll': Boxes,
  'Needs Action': TriangleAlert,
  'Open Bills': FileText,
  'Pending Review': Search,
  Released: Send,
  Paid: BadgeCheck,
  'Compliant Scholars': BadgeCheck,
  'Batches Created': Boxes,
  'For Scoring': FilePenLine,
  Passed: GraduationCap,
  'For Recheck': FlaskConical,
  'Ready to Activate': Rocket,
  Waitlisted: FileText,
  'For Release': Megaphone,
  Archived: Archive,
  Published: Megaphone,
  Scheduled: CalendarDays,
  Drafts: NotebookPen,
  'Audience Segments': UsersRound,
  Schools: School,
  'Active Entries': BookText,
  'Pending Updates': Clock3,
  Today: ClipboardList,
  Week: CalendarDays,
  'Access Events': ShieldCheck,
  Alerts: TriangleAlert,
  'Current Year': CalendarDays,
  'Open Terms': CalendarDays,
  'Archived Cycles': Archive,
  'Pending Setup': Settings2,
  'Monthly Reports': ChartColumn,
  Exports: FolderOpen,
  'Audit Views': Calculator,
  'Pending Metrics': Clock3,
  'Active Modules': Puzzle,
  'Last Backup': HardDrive,
  'Security Flags': ShieldAlert,
  'Pending Configs': Settings2,
  'Forfeited Accounts': ShieldAlert,
};

const sectionViews = {
  Dashboard: {
    eyebrow: 'System overview',
    title: 'Super admin command center',
    description: 'Track the full scholarship workflow, access control, and operational priorities from one place.',
    metrics: [
      { label: 'Open Applications', value: '184', icon: '📝', tone: 'emerald' },
      { label: 'Active Scholars', value: '42', icon: '👥', tone: 'sky' },
      { label: 'Pending Reviews', value: '11', icon: '⏳', tone: 'amber' },
      { label: 'Role Updates', value: '7', icon: '🔐', tone: 'violet' },
    ],
    primaryTitle: 'Recent submissions',
    primaryLink: 'View application queue',
    primaryItems: [
      { name: 'Maria Santos', detail: 'Scholarship Renewal', status: 'Approved', time: '10 min ago' },
      { name: 'Jhon Dela Cruz', detail: 'New Application', status: 'Pending', time: '32 min ago' },
      { name: 'Rina Lopez', detail: 'Document Check', status: 'Needs Review', time: '1 hr ago' },
    ],
    secondaryTitle: 'Today’s focus',
    secondaryTag: 'Priority',
    secondaryHeadline: 'Review 6 incomplete documents',
    secondaryText: 'Most applicants are missing proof of residency, certification uploads, or role verification.',
    secondaryItems: [
      '3 applications are ready for exam encoding.',
      '2 role update requests need approval.',
      '1 payroll batch is waiting for release review.',
    ],
  },
  'Content Management': {
    eyebrow: 'Content moderation',
    title: 'Content management workspace',
    description: 'Manage announcements, publishing flow, and content review tasks from one place.',
    heroBadge: 'Moderator ready',
    metrics: [
      { label: 'Published', value: '18', icon: '📣', tone: 'emerald' },
      { label: 'Scheduled', value: '3', icon: '🗓️', tone: 'sky' },
      { label: 'Drafts', value: '5', icon: '📝', tone: 'amber' },
      { label: 'Pending Review', value: '7', icon: '🔎', tone: 'violet' },
    ],
    primaryTitle: 'Content queue',
    primaryLink: 'Open content editor',
    primaryItems: [
      { name: 'Scholarship deadline reminder', detail: 'Ready for publish', status: 'Approved', time: '2 hrs ago' },
      { name: 'Payroll release update', detail: 'Scheduled for later today', status: 'Pending', time: 'Today' },
      { name: 'Exam schedule notice', detail: 'Needs final review', status: 'Needs Review', time: 'Today' },
    ],
    secondaryTitle: 'Content focus',
    secondaryTag: 'Moderation',
    secondaryHeadline: 'Keep announcements accurate',
    secondaryText: 'Review posts before publishing to avoid stale deadlines and incorrect notices.',
    secondaryItems: [
      'Check draft announcements.',
      'Approve or reject scheduled posts.',
      'Keep the notice board current.',
    ],
  },
  Applicants: {
    eyebrow: 'Application pipeline',
    title: 'Application intake and review',
    description: 'Monitor new submissions, application completeness, and approval bottlenecks.',
    heroBadge: 'Queue 184',
    metrics: [
      { label: 'Submitted', value: '184', icon: '📝', tone: 'emerald' },
      { label: 'Incomplete', value: '23', icon: '🧾', tone: 'amber' },
      { label: 'For Review', value: '11', icon: '🔍', tone: 'sky' },
      { label: 'Approved', value: '97', icon: '✅', tone: 'violet' },
    ],
    primaryTitle: 'Application queue',
    primaryLink: 'Open all applications',
    primaryItems: [
      { name: 'Ana Cruz', detail: 'Needs residency document', status: 'Needs Review', time: '5 min ago' },
      { name: 'Leah Torres', detail: 'Ready for encoding', status: 'Pending', time: '18 min ago' },
      { name: 'Mark Dizon', detail: 'For final approval', status: 'Approved', time: '41 min ago' },
    ],
    secondaryTitle: 'Screening focus',
    secondaryTag: 'Review',
    secondaryHeadline: 'Clear the incomplete intake forms',
    secondaryText: 'Prioritize document follow-ups before exam encoding and scholar activation.',
    secondaryItems: [
      'Validate required fields on new submissions.',
      'Route incomplete records back to applicants.',
      'Prepare complete records for exam workflow.',
    ],
  },
  Staff: {
    eyebrow: 'Staff oversight',
    title: 'Staff records and assignments',
    description: 'Manage staff access, task ownership, and day-to-day workload across the portal.',
    heroBadge: 'Team active',
    metrics: [
      { label: 'Staff Members', value: '14', icon: '👔', tone: 'emerald' },
      { label: 'Active Tasks', value: '26', icon: '📋', tone: 'sky' },
      { label: 'Open Requests', value: '5', icon: '⏳', tone: 'amber' },
      { label: 'Access Reviews', value: '2', icon: '🔐', tone: 'violet' },
    ],
    primaryTitle: 'Staff task list',
    primaryLink: 'Open staff directory',
    primaryItems: [
      { name: 'Maria Cruz', detail: 'Reviewing applications', status: 'Approved', time: 'Updated today' },
      { name: 'Jorge Santos', detail: 'Assigned to payroll checks', status: 'Pending', time: 'Updated today' },
      { name: 'Ana Reyes', detail: 'Access request pending', status: 'Needs Review', time: 'Updated 2 hrs ago' },
    ],
    secondaryTitle: 'Staff focus',
    secondaryTag: 'Assignments',
    secondaryHeadline: 'Keep staff load balanced',
    secondaryText: 'Track internal staff work, approvals, and any access changes that need attention.',
    secondaryItems: [
      'Review internal task assignments.',
      'Confirm staff access updates.',
      'Track workload across teams.',
    ],
  },
  Scholars: {
    eyebrow: 'Scholar management',
    title: 'Scholar records and status tracking',
    description: 'View active scholars, compliance status, and records moving through the program.',
    heroBadge: '42 active',
    metrics: [
      { label: 'Active Scholars', value: '42', icon: '👥', tone: 'sky' },
      { label: 'Payout Compliant', value: '28', icon: '💳', tone: 'emerald' },
      { label: 'In Payroll', value: '9', icon: '📦', tone: 'amber' },
      { label: 'Needs Action', value: '5', icon: '⚠️', tone: 'violet' },
    ],
    primaryTitle: 'Scholar status list',
    primaryLink: 'Open scholar roster',
    primaryItems: [
      { name: 'Rina Lopez', detail: 'Payout compliant', status: 'Approved', time: 'Updated today' },
      { name: 'Jose Reyes', detail: 'In payroll queue', status: 'Pending', time: 'Updated today' },
      { name: 'Mia Santos', detail: 'Needs requirement follow-up', status: 'Needs Review', time: 'Updated 2 hrs ago' },
    ],
    secondaryTitle: 'Management focus',
    secondaryTag: 'Compliance',
    secondaryHeadline: 'Keep scholar records current',
    secondaryText: 'Confirm payout readiness and keep compliance flags aligned with the latest submissions.',
    secondaryItems: [
      'Check scholar status transitions.',
      'Confirm payout-compliant records.',
      'Resolve exceptions before payroll release.',
    ],
  },
  Billing: {
    eyebrow: 'Billing overview',
    title: 'Billing records and payment status',
    description: 'Monitor pending charges, release requests, and billing-related follow ups.',
    heroBadge: 'Billing queue',
    metrics: [
      { label: 'Open Bills', value: '8', icon: '🧾', tone: 'emerald' },
      { label: 'Pending Review', value: '4', icon: '🔍', tone: 'sky' },
      { label: 'Released', value: '16', icon: '📤', tone: 'amber' },
      { label: 'Paid', value: '21', icon: '💰', tone: 'violet' },
    ],
    primaryTitle: 'Billing queue',
    primaryLink: 'Open billing records',
    primaryItems: [
      { name: 'Batch 2026-07A', detail: 'Pending release check', status: 'Pending', time: 'Today' },
      { name: 'Batch 2026-07B', detail: 'Approved for billing', status: 'Approved', time: 'Today' },
      { name: 'Batch 2026-06C', detail: 'Archived billing cycle', status: 'Approved', time: 'Last week' },
    ],
    secondaryTitle: 'Billing focus',
    secondaryTag: 'Review',
    secondaryHeadline: 'Clear billing follow ups',
    secondaryText: 'Keep billing records aligned with the latest approval and payment status.',
    secondaryItems: [
      'Check pending billing items.',
      'Verify release readiness.',
      'Confirm paid billing cycles.',
    ],
  },
  Payroll: {
    eyebrow: 'Payroll oversight',
    title: 'Payroll management',
    description: 'Monitor compliant scholars, batch release status, and payment progress.',
    heroBadge: 'Billing ready',
    metrics: [
      { label: 'Compliant Scholars', value: '28', icon: '💳', tone: 'emerald' },
      { label: 'Batches Created', value: '4', icon: '📦', tone: 'sky' },
      { label: 'Released', value: '3', icon: '📤', tone: 'amber' },
      { label: 'Paid', value: '21', icon: '💰', tone: 'violet' },
    ],
    primaryTitle: 'Payroll batch list',
    primaryLink: 'Open payroll batches',
    primaryItems: [
      { name: 'Batch 2026-07A', detail: '10 scholars released', status: 'Approved', time: 'Today' },
      { name: 'Batch 2026-07B', detail: 'Awaiting release', status: 'Pending', time: 'Today' },
      { name: 'Batch 2026-06C', detail: 'Complete and paid', status: 'Approved', time: 'Last week' },
    ],
    secondaryTitle: 'Payroll focus',
    secondaryTag: 'Release',
    secondaryHeadline: 'Clear payout batches on time',
    secondaryText: 'Use the payroll queue to keep scholarship disbursements moving without delays.',
    secondaryItems: [
      'Review payout-compliant scholars.',
      'Release approved batches.',
      'Confirm paid scholarship records.',
    ],
  },
  'Examination Management': {
    eyebrow: 'Exam operations',
    title: 'Examination management',
    description: 'Assign exam results, monitor scoring progress, and prepare scholars for activation.',
    heroBadge: 'Encoding live',
    metrics: [
      { label: 'For Scoring', value: '18', icon: '✍️', tone: 'amber' },
      { label: 'Passed', value: '76', icon: '🎓', tone: 'emerald' },
      { label: 'For Recheck', value: '9', icon: '🧪', tone: 'sky' },
      { label: 'Ready to Activate', value: '12', icon: '🚀', tone: 'violet' },
    ],
    primaryTitle: 'Exam score queue',
    primaryLink: 'Open scoring records',
    primaryItems: [
      { name: 'Batch A-2026', detail: '15 submissions waiting', status: 'Pending', time: 'Today' },
      { name: 'Batch B-2026', detail: '3 for recheck', status: 'Needs Review', time: 'Today' },
      { name: 'Batch C-2026', detail: 'All scores encoded', status: 'Approved', time: 'Today' },
    ],
    secondaryTitle: 'Exam focus',
    secondaryTag: 'Scoring',
    secondaryHeadline: 'Finalize exam inputs',
    secondaryText: 'Clear pending scores so scholar activation can move forward without delays.',
    secondaryItems: [
      'Encode new exam results.',
      'Review borderline score entries.',
      'Push qualified scholars to activation.',
    ],
  },
  'Results Management': {
    eyebrow: 'Decision releases',
    title: 'Results management',
    description: 'Track approved outcomes, waitlisted records, and release readiness for final notices.',
    heroBadge: '117 resolved',
    metrics: [
      { label: 'Approved', value: '97', icon: '✅', tone: 'emerald' },
      { label: 'Waitlisted', value: '14', icon: '📄', tone: 'amber' },
      { label: 'For Release', value: '8', icon: '📣', tone: 'sky' },
      { label: 'Archived', value: '23', icon: '🗂️', tone: 'violet' },
    ],
    primaryTitle: 'Outcome release list',
    primaryLink: 'Open release history',
    primaryItems: [
      { name: 'Final cohort A', detail: 'Ready for notification', status: 'Approved', time: 'Today' },
      { name: 'Final cohort B', detail: 'Waiting on confirmation', status: 'Pending', time: 'Yesterday' },
      { name: 'Appeal batch', detail: 'Needs review', status: 'Needs Review', time: 'Yesterday' },
    ],
    secondaryTitle: 'Results focus',
    secondaryTag: 'Release',
    secondaryHeadline: 'Publish final decisions',
    secondaryText: 'Review locked outcomes before releasing notifications to applicants and scholars.',
    secondaryItems: [
      'Confirm approval lists.',
      'Check for unresolved appeals.',
      'Schedule release notices.',
    ],
  },
  Announcements: {
    eyebrow: 'Communication hub',
    title: 'Announcements and notices',
    description: 'Publish system-wide updates for applicants, scholars, and staff.',
    heroBadge: '3 scheduled',
    metrics: [
      { label: 'Published', value: '18', icon: '📣', tone: 'emerald' },
      { label: 'Scheduled', value: '3', icon: '🗓️', tone: 'sky' },
      { label: 'Drafts', value: '5', icon: '📝', tone: 'amber' },
      { label: 'Audience Segments', value: '4', icon: '👥', tone: 'violet' },
    ],
    primaryTitle: 'Recent announcements',
    primaryLink: 'Open announcement editor',
    primaryItems: [
      { name: 'Scholarship deadline reminder', detail: 'Published for applicants', status: 'Approved', time: '2 hrs ago' },
      { name: 'Payroll release update', detail: 'Scheduled for scholars', status: 'Pending', time: 'Tomorrow' },
      { name: 'Exam schedule notice', detail: 'Draft ready', status: 'Needs Review', time: 'Today' },
    ],
    secondaryTitle: 'Announcement focus',
    secondaryTag: 'Publishing',
    secondaryHeadline: 'Keep audiences informed',
    secondaryText: 'Coordinate notices around deadlines, exam schedules, and payment releases.',
    secondaryItems: [
      'Publish urgent notices first.',
      'Schedule system reminders.',
      'Keep draft updates ready for review.',
    ],
  },
  'School Catalog': {
    eyebrow: 'Catalog management',
    title: 'School catalog and institution list',
    description: 'Review the school catalog used across the application and scholar workflows.',
    heroBadge: 'Catalog synced',
    metrics: [
      { label: 'Schools', value: '124', icon: '🏫', tone: 'emerald' },
      { label: 'Active Entries', value: '118', icon: '📘', tone: 'sky' },
      { label: 'Pending Updates', value: '6', icon: '⏳', tone: 'amber' },
      { label: 'Archived', value: '2', icon: '🗂️', tone: 'violet' },
    ],
    primaryTitle: 'School catalog',
    primaryLink: 'Open catalog editor',
    primaryItems: [
      { name: 'Central State University', detail: 'Active catalog entry', status: 'Approved', time: 'Updated today' },
      { name: 'Northern Institute', detail: 'Needs validation', status: 'Needs Review', time: 'Updated today' },
      { name: 'Metro Tech College', detail: 'Approved for use', status: 'Approved', time: 'Updated 2 hrs ago' },
    ],
    secondaryTitle: 'Catalog focus',
    secondaryTag: 'Data',
    secondaryHeadline: 'Keep school records current',
    secondaryText: 'Ensure the school list is accurate before applicants and scholars make selections.',
    secondaryItems: [
      'Review institution names and codes.',
      'Validate new catalog additions.',
      'Archive retired school entries.',
    ],
  },
  'Activity Logs': {
    eyebrow: 'Audit trail',
    title: 'Activity logs and system events',
    description: 'Track administrative actions, approvals, and system activity across the portal.',
    heroBadge: 'Live events',
    metrics: [
      { label: 'Today', value: '42', icon: '📋', tone: 'emerald' },
      { label: 'Week', value: '198', icon: '🕘', tone: 'sky' },
      { label: 'Access Events', value: '13', icon: '🔐', tone: 'amber' },
      { label: 'Alerts', value: '2', icon: '⚠️', tone: 'violet' },
    ],
    primaryTitle: 'Recent events',
    primaryLink: 'Open audit log',
    primaryItems: [
      { name: 'Super Admin Login', detail: 'Dashboard access granted', status: 'Approved', time: '2 min ago' },
      { name: 'Role Update', detail: 'Staff permissions changed', status: 'Needs Review', time: '24 min ago' },
      { name: 'Payroll Release', detail: 'Batch approved for payout', status: 'Approved', time: 'Today' },
    ],
    secondaryTitle: 'Log focus',
    secondaryTag: 'Monitoring',
    secondaryHeadline: 'Watch key actions closely',
    secondaryText: 'Keep an eye on sensitive changes, approvals, and access activity.',
    secondaryItems: [
      'Review admin actions.',
      'Check access changes.',
      'Export logs when needed.',
    ],
  },
  'Academic Years': {
    eyebrow: 'Academic calendar',
    title: 'Academic years and cycles',
    description: 'Manage academic periods used for applications, enrollment, and reporting.',
    heroBadge: 'Current cycle',
    metrics: [
      { label: 'Current Year', value: '2026-2027', icon: '📅', tone: 'emerald' },
      { label: 'Open Terms', value: '2', icon: '🗓️', tone: 'sky' },
      { label: 'Archived Cycles', value: '7', icon: '🗃️', tone: 'amber' },
      { label: 'Pending Setup', value: '1', icon: '⚙️', tone: 'violet' },
    ],
    primaryTitle: 'Academic year list',
    primaryLink: 'Open cycle manager',
    primaryItems: [
      { name: '2026-2027', detail: 'Current academic year', status: 'Approved', time: 'Active' },
      { name: '2025-2026', detail: 'Archived cycle', status: 'Approved', time: 'Archived' },
      { name: '2027-2028', detail: 'Prepared for setup', status: 'Pending', time: 'Draft' },
    ],
    secondaryTitle: 'Calendar focus',
    secondaryTag: 'Cycle setup',
    secondaryHeadline: 'Keep academic cycles organized',
    secondaryText: 'Make sure each school year is set before submissions and reporting begin.',
    secondaryItems: [
      'Review active academic year.',
      'Prepare the next cycle.',
      'Archive completed years.',
    ],
  },
  Reports: {
    eyebrow: 'Reporting center',
    title: 'Reports and analytics',
    description: 'Review operational exports, monthly summaries, and audit-ready snapshots.',
    heroBadge: 'Export ready',
    metrics: [
      { label: 'Monthly Reports', value: '12', icon: '📊', tone: 'emerald' },
      { label: 'Exports', value: '8', icon: '📁', tone: 'sky' },
      { label: 'Audit Views', value: '5', icon: '🧮', tone: 'amber' },
      { label: 'Pending Metrics', value: '2', icon: '⏳', tone: 'violet' },
    ],
    primaryTitle: 'Report queue',
    primaryLink: 'Open reporting workspace',
    primaryItems: [
      { name: 'Application summary', detail: 'Ready to export', status: 'Approved', time: 'Today' },
      { name: 'Payroll summary', detail: 'Waiting on release totals', status: 'Pending', time: 'Today' },
      { name: 'Access audit', detail: 'Needs signoff', status: 'Needs Review', time: 'Yesterday' },
    ],
    secondaryTitle: 'Reporting focus',
    secondaryTag: 'Insights',
    secondaryHeadline: 'Keep the system measurable',
    secondaryText: 'Use reports to track approvals, releases, and role changes over time.',
    secondaryItems: [
      'Export monthly snapshots.',
      'Review approval trends.',
      'Prepare audit references.',
    ],
  },
  Settings: {
    eyebrow: 'System settings',
    title: 'Portal settings and controls',
    description: 'Tune system preferences, monitor access health, and keep configuration aligned.',
    heroBadge: 'Healthy',
    metrics: [
      { label: 'Active Modules', value: '9', icon: '🧩', tone: 'emerald' },
      { label: 'Last Backup', value: 'Today', icon: '💾', tone: 'sky' },
      { label: 'Security Flags', value: '0', icon: '🛡️', tone: 'amber' },
      { label: 'Pending Configs', value: '1', icon: '⚙️', tone: 'violet' },
    ],
    primaryTitle: 'System checks',
    primaryLink: 'Open settings',
    primaryItems: [
      { name: 'Authentication', detail: 'Healthy and synced', status: 'Approved', time: 'Now' },
      { name: 'Notifications', detail: 'Templates loaded', status: 'Pending', time: 'Now' },
      { name: 'Backups', detail: 'Latest backup complete', status: 'Approved', time: 'Today' },
    ],
    secondaryTitle: 'Configuration focus',
    secondaryTag: 'Maintenance',
    secondaryHeadline: 'Keep the system stable',
    secondaryText: 'Review platform configuration, backup status, and access safeguards regularly.',
    secondaryItems: [
      'Confirm authentication settings.',
      'Review backup completion.',
      'Check notification templates.',
    ],
  },
};

const superAdminOverview = {
  stats: [
    {
      label: 'Active Scholars',
      value: '4',
      icon: GraduationCap,
      tone: 'success',
      accent: 'emerald',
    },
    {
      label: 'Forfeited Accounts',
      value: '0',
      icon: TriangleAlert,
      tone: 'danger',
      accent: 'rose',
    },
  ],
  recentApplications: [
    { name: 'CLARA MAGBANUA', controlNo: 'PGCEAP-2026-00023', status: 'Completed' },
    { name: 'PATRICIA DE LOS SANTOS', controlNo: 'PGCEAP-2026-00022', status: 'Pending Review' },
    { name: 'MARK VILLAFUERTE', controlNo: 'PGCEAP-2026-00021', status: 'Pending Review' },
    { name: 'BENEDICT EVANGELISTA', controlNo: 'PGCEAP-2026-00020', status: 'Pending Review' },
    { name: 'LIZA MARIE CATACUTAN', controlNo: 'PGCEAP-2026-00019', status: 'Pending Review' },
    { name: 'EMILIO SANTOS', controlNo: 'PGCEAP-2026-00018', status: 'Pending Review' },
    { name: 'KRISTINA CASSANDRA MACAPAGAL', controlNo: 'PGCEAP-2026-00017', status: 'Pending Review' },
  ],
  schoolCatalog: [
    { name: 'Camarines Norte School of Law', classification: 'Public' },
    { name: 'Camarines Norte School of Law, Arts and Sciences Inc.', classification: 'Public' },
    { name: 'Camarines Norte State College - Daet Campus', classification: 'Public' },
    { name: 'Camarines Norte State College, Abaño Campus', classification: 'Public' },
    { name: 'Camarines Norte State College, Entienza Campus', classification: 'Public' },
    { name: 'Camarines Norte State College, Jose Panganiban Campus', classification: 'Public' },
    { name: 'Camarines Norte State College, Labo Campus', classification: 'Public' },
  ],
  recentActivity: [
    {
      title: 'Admin logged in',
      detail: 'Email: superadmin@pgceap.gov.ph',
      status: 'INFO',
      time: '2026-07-13 17:03:01',
    },
    {
      title: 'Admin logged in',
      detail: 'Email: superadmin@pgceap.gov.ph',
      status: 'INFO',
      time: '2026-07-13 17:01:07',
    },
    {
      title: 'User logged out',
      detail: 'Session closed from dashboard',
      status: 'INFO',
      time: '2026-07-13 16:51:42',
    },
    {
      title: 'Admin logged in',
      detail: 'Email: admin@pgceap.gov.ph',
      status: 'INFO',
      time: '2026-07-13 12:05:08',
    },
  ],
};

function DashboardOverview({ token }) {
  const [overview, setOverview] = useState({ ...superAdminOverview, schoolCatalog: schoolCatalogFromJson });

  useEffect(() => {
    let active = true;
    const loadOverview = async () => {
      try {
        const response = await fetch(`${API_BASE}/dashboard/summary`, { headers: authHeaders(token) });
        if (!response.ok) return;
        const data = await response.json();
        if (active) setOverview({ ...superAdminOverview, ...data, schoolCatalog: schoolCatalogFromJson });
      } catch (error) {
        console.warn('Unable to load dashboard summary:', error);
      }
    };
    loadOverview();
    const refreshTimer = window.setInterval(loadOverview, 30000);
    return () => { active = false; window.clearInterval(refreshTimer); };
  }, [token]);
  return (
    <div className="super-admin-dashboard">
      <header className="dashboard-section-header">
        <div>
          <h2>Dashboard Overview</h2>
          <p>Monitor scholarship applications and program activity.</p>
        </div>
        <span className="dashboard-live-indicator"><i /> Live data</span>
      </header>

      <div className="dashboard-stat-grid">
        {[
          { ...superAdminOverview.stats[0], value: String(overview.stats.activeScholars) },
          { ...superAdminOverview.stats[1], value: String(overview.stats.forfeitedAccounts) },
        ].map((stat) => {
          const Icon = stat.icon;

          return (
            <article key={stat.label} className={`dashboard-stat-card dashboard-stat-card-${stat.tone}`}>
              <div>
                <p className="dashboard-stat-label">{stat.label}</p>
                <h3>{stat.value}</h3>
              </div>
              <div className={`dashboard-stat-icon dashboard-stat-icon-${stat.accent}`}>
                <Icon size={24} strokeWidth={2.1} />
              </div>
            </article>
          );
        })}
      </div>

      <section className="dashboard-surface">
        <div className="dashboard-surface-header">
          <div>
            <h3>Recent Applications</h3>
            <p>Latest applicant records from the scholarship database.</p>
          </div>
          <span className="dashboard-record-count">{overview.recentApplications.length} recent records</span>
        </div>
        <div className="dashboard-table-wrap">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>NAME</th>
                <th>CONTROL NO.</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {overview.recentApplications.map((row) => (
                <tr key={row.controlNo}>
                  <td>{row.name}</td>
                  <td className="dashboard-table-muted">{row.controlNo}</td>
                  <td>
                    <span className={`dashboard-pill dashboard-pill-${row.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="dashboard-surface">
        <div className="dashboard-surface-header">
          <div>
            <h3>School Catalog</h3>
            <p>Manage school classifications · Showing 10 of 10</p>
          </div>
          <button className="dashboard-link-button" type="button">
            View all →
          </button>
        </div>
        <div className="dashboard-table-wrap dashboard-table-wrap-tall">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>SCHOOL NAME</th>
                <th>CLASSIFICATION</th>
              </tr>
            </thead>
            <tbody>
              {overview.schoolCatalog.map((row) => (
                <tr key={row.name}>
                  <td>{row.name}</td>
                  <td>
                    <span className="dashboard-pill dashboard-pill-public">{row.classification}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="dashboard-surface">
        <div className="dashboard-surface-header">
          <div>
            <h3>Recent Activity</h3>
            <p>Live feed from app_log · Latest 15 entries</p>
          </div>
          <button className="dashboard-link-button" type="button">
            View all logs →
          </button>
        </div>
        <div className="dashboard-activity-list">
          {overview.recentActivity.map((entry) => (
            <div key={`${entry.title}-${entry.time}`} className="dashboard-activity-row">
              <div className="dashboard-activity-dot" />
              <div className="dashboard-activity-copy">
                <strong>{entry.title}</strong>
                <p>{entry.detail}</p>
              </div>
              <div className="dashboard-activity-meta">
                <span className="dashboard-activity-tag">{entry.status}</span>
                <small>{entry.time}</small>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const formatDate = (value) => value ? new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Never';
const formatDateTime = (value) => value ? new Date(value).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : 'Never';

function ApplicantsManagement({ token }) {
  const [data, setData] = useState({ stats: { total: 0, scheduled: 0, completed: 0, passed: 0 }, applicants: [] });
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All Status');
  const [municipality, setMunicipality] = useState('All Municipalities');
  const [schoolYear, setSchoolYear] = useState('All School Years');
  const [barangay, setBarangay] = useState('All Barangays');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const response = await fetch(`${API_BASE}/applicants/management`, { headers: authHeaders(token) });
        if (response.ok && active) setData(await response.json());
      } catch (error) { console.warn('Unable to load applicants:', error); }
    };
    load();
    const timer = window.setInterval(load, 30000);
    return () => { active = false; window.clearInterval(timer); };
  }, [token]);

  const values = (key) => [...new Set(data.applicants.map((applicant) => applicant[key]))];
  const barangayOptions = municipality === 'All Municipalities'
    ? [...new Set(barangaysData.map((item) => item.name))]
    : [...new Set(barangaysData.filter((item) => item.municipalityCode === municipalitiesData.find((item) => item.name === municipality)?.code).map((item) => item.name))];
  const filtered = data.applicants.filter((applicant) => {
    const matchesQuery = `${applicant.name} ${applicant.email} ${applicant.controlNo}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (status === 'All Status' || applicant.status === status) && (municipality === 'All Municipalities' || applicant.municipality === municipality) && (schoolYear === 'All School Years' || applicant.schoolYear === schoolYear) && (barangay === 'All Barangays' || applicant.barangay === barangay);
  });
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const paginatedApplicants = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const metricCards = [['Total Applicants', data.stats.total, 'users'], ['Scheduled for Exam', data.stats.scheduled, 'calendar'], ['Exam Completed', data.stats.completed, 'document'], ['Passed Applicants', data.stats.passed, 'passed']];

  return <div className="applicants-management">
    <div className="applicants-heading"><div><h2>Manage Applicants</h2><p>{data.stats.total} applicants</p></div><button type="button" className="applicants-export">♡ &nbsp; Export to CSV</button></div>
    <div className="applicant-metrics">{metricCards.map(([label, value, icon]) => <article key={label}><div><span>{label}</span><strong>{value}</strong></div><i className={`applicant-metric-icon ${icon}`}>{icon === 'calendar' ? '□' : icon === 'document' ? '▤' : icon === 'passed' ? '♙' : '♧'}</i></article>)}</div>
    <div className="applicant-filters"><label className="applicant-search">⌕<input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Name, email, control no..." /></label>
      {[['status', status, setStatus, ['All Status', ...values('status')]], ['municipality', municipality, setMunicipality, ['All Municipalities', ...municipalityNames]], ['schoolYear', schoolYear, setSchoolYear, ['All School Years', ...values('schoolYear')]], ['barangay', barangay, setBarangay, ['All Barangays', ...barangayOptions]]].map(([key, value, setter, options]) => <select key={key} value={value} onChange={(event) => { setter(event.target.value); setPage(1); if (key === 'municipality') setBarangay('All Barangays'); }}>{options.map((option) => <option key={option}>{option}</option>)}</select>)}
    </div>
    <section className="applicant-table-card"><table className="applicant-table"><thead><tr>{['APPLICANT', 'CONTROL NO.', 'EMAIL', 'REGISTERED', 'STATUS', 'LAST LOGIN', 'ACTION'].map((heading) => <th key={heading}>{heading}</th>)}</tr></thead><tbody>{paginatedApplicants.map((applicant) => <tr key={applicant.id}><td><div className="applicant-name"><b>{applicant.initials}</b><span><strong>{applicant.name}</strong><small>{applicant.username}</small></span></div></td><td>{applicant.controlNo}</td><td>{applicant.email}</td><td>{formatDate(applicant.registered)}</td><td><span className={`applicant-status ${applicant.status.toLowerCase().replace(/\s+/g, '-')}`}>{applicant.status}</span></td><td>{formatDateTime(applicant.lastLogin)}</td><td><button type="button" className="applicant-view"><Eye size={13} /> View</button></td></tr>)}</tbody></table><div className="applicant-table-footer"><span>Showing {filtered.length ? (currentPage - 1) * pageSize + 1 : 0}-{Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} applicants</span><div className="applicant-pagination"><button type="button" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>‹</button>{Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => <button type="button" className={pageNumber === currentPage ? 'active' : ''} key={pageNumber} onClick={() => setPage(pageNumber)}>{pageNumber}</button>)}<button type="button" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)}>›</button></div></div></section>
  </div>;
}

function Dashboard({ activeSection = 'Dashboard', user, token }) {
  if (activeSection === 'Dashboard' && ['SuperAdmin', 'RegularAdmin'].includes(user?.role)) {
    return <DashboardOverview token={token} />;
  }
  if (activeSection === 'Applicants' && ['SuperAdmin', 'RegularAdmin'].includes(user?.role)) return <ApplicantsManagement token={token} />;

  const view = sectionViews[activeSection] || sectionViews.Dashboard;

  return (
    <div className="dashboard-shell">
      <div className="dashboard-grid">
        {view.metrics.map((item) => (
          <article key={item.label} className="dashboard-card">
            <div className={`dashboard-card-icon dashboard-card-icon-${item.tone}`}>
              <IconForMetric label={item.label} />
            </div>
            <div>
              <p className="dashboard-card-label">{item.label}</p>
              <h3>{item.value}</h3>
            </div>
          </article>
        ))}
      </div>

      <div className="dashboard-panel-grid">
        <section className="dashboard-panel">
          <div className="panel-heading">
            <h3>{view.primaryTitle}</h3>
            <a href="#">{view.primaryLink}</a>
          </div>
          <ul className="activity-list">
            {view.primaryItems.map((item) => (
              <li key={item.name} className="activity-item">
                <div>
                  <strong>{item.name}</strong>
                  <p>{item.detail}</p>
                </div>
                <div className="activity-meta">
                  <span className={`status-badge status-badge-${item.status.toLowerCase().replace(/\s+/g, '-')}`}>
                    {item.status}
                  </span>
                  <small>{item.time}</small>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="dashboard-panel">
          <div className="panel-heading">
            <h3>{view.secondaryTitle}</h3>
          </div>
          <div className="focus-card">
            <div className="focus-pill">{view.secondaryTag}</div>
            <h4>{view.secondaryHeadline}</h4>
            <p>{view.secondaryText}</p>
          </div>
          <div className="focus-list">
            {view.secondaryItems.map((item) => (
              <div key={item} className="focus-row">
                <span>•</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function IconForMetric({ label }) {
  const Icon = metricIconByLabel[label] || Info;
  return <Icon aria-hidden="true" size={20} strokeWidth={2.25} />;
}

export default Dashboard;
