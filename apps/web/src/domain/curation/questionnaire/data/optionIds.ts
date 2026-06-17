/**
 * Shared option-value constants for curation questions and engine.
 * Both questions.ts and curationEngine.ts import from here
 * so a typo or rename is caught at compile time.
 */

/* ── starter ── */
export const STARTER_S1 = {
  HAS_EXPERIENCE: 'has-experience',
  NEEDS_RESUME: 'needs-resume',
  NEEDS_BUNDLE: 'needs-bundle',
} as const;

export const STARTER_S2 = {
  SELF_GUIDE: 'self-guide',
  WITH_FEEDBACK: 'with-feedback',
  WITH_RESUME: 'with-resume',
  FAST_RESUME: 'fast-resume',
  MENTOR_RESUME: 'mentor-resume',
  WITH_COVER: 'with-cover',
  FAST_BUNDLE: 'fast-bundle',
  COVER_FEEDBACK: 'cover-feedback',
  PORTFOLIO_FEEDBACK: 'portfolio-feedback',
} as const;

/* ── resume ── */
export const RESUME_S1 = {
  FIRST_RESUME: 'first-resume',
  REFRESH: 'refresh',
  CAREER_SHIFT: 'career-shift',
} as const;

export const RESUME_S2 = {
  WEEK_DRAFT: 'week-draft',
  MENTOR_2_3WEEKS: 'mentor-2-3weeks',
  MONTH_EXPERIENCE: 'month-experience',
  FAST_FIX: 'fast-fix',
  MENTOR_IMPROVE: 'mentor-improve',
  FULL_REWRITE: 'full-rewrite',
  SHIFT_FAST: 'shift-fast',
  SHIFT_WITH_COVER: 'shift-with-cover',
  SHIFT_MONTH: 'shift-month',
} as const;

/* ── coverLetter ── */
export const COVER_S1 = {
  GENERAL_COVER: 'general-cover',
  ENTERPRISE_COVER: 'enterprise-cover',
  PORTFOLIO_LINKED: 'portfolio-linked',
} as const;

export const COVER_S2 = {
  SELF_WRITE: 'self-write',
  LIVE_1: 'live-1',
  DEEP_FEEDBACK: 'deep-feedback',
  ENTERPRISE_SELF: 'enterprise-self',
  ENTERPRISE_MENTOR: 'enterprise-mentor',
  ENTERPRISE_INTENSIVE: 'enterprise-intensive',
  PORTFOLIO_GUIDE: 'portfolio-guide',
  PORTFOLIO_MENTOR: 'portfolio-mentor',
  PORTFOLIO_BOTH: 'portfolio-both',
} as const;

/* ── portfolio ── */
export const PORTFOLIO_S1 = {
  PORTFOLIO_CORE: 'portfolio-core',
  MARKETING_TRACK: 'marketing-track',
  HR_TRACK: 'hr-track',
} as const;

export const PORTFOLIO_S2 = {
  HAS_DRAFT: 'has-draft',
  NEED_EXAMPLE: 'need-example',
  NEED_FEEDBACK: 'need-feedback',
  MKT_GUIDE: 'mkt-guide',
  MKT_MENTOR: 'mkt-mentor',
  MKT_PREMIUM: 'mkt-premium',
  HR_GUIDE: 'hr-guide',
  HR_MENTOR: 'hr-mentor',
  HR_PREMIUM: 'hr-premium',
} as const;

/* ── specialized ── */
export const SPECIAL_S1 = {
  ENTERPRISE: 'enterprise',
  MARKETING: 'marketing',
  HR: 'hr',
} as const;

export const SPECIAL_S2 = {
  ENT_EXPERIENCE: 'ent-experience',
  ENT_INTENSIVE: 'ent-intensive',
  ENT_GUIDE: 'ent-guide',
  MKT_EXPERIENCE: 'mkt-experience',
  MKT_INTENSIVE: 'mkt-intensive',
  MKT_FAST: 'mkt-fast',
  HR_EXPERIENCE: 'hr-experience',
  HR_INTENSIVE: 'hr-intensive',
  HR_FAST: 'hr-fast',
} as const;

/* ── interview ── */
export const INTERVIEW_S1 = {
  FAILING_INTERVIEW: 'failing-interview',
  FIRST_INTERVIEW: 'first-interview',
  DOCS_AND_INTERVIEW: 'docs-and-interview',
} as const;

export const INTERVIEW_S2 = {
  SELF_PREP: 'self-prep',
  MOCK_1: 'mock-1',
  MOCK_2_SPECIAL: 'mock-2-special',
  FIRST_SELF: 'first-self',
  FIRST_MOCK: 'first-mock',
  FIRST_FULL: 'first-full',
  DOCS_FIRST: 'docs-first',
  DOCS_THEN_INTERVIEW: 'docs-then-interview',
  BOTH_INTENSIVE: 'both-intensive',
} as const;

/* ── dontKnow ── */
export const DONT_KNOW_S1 = {
  JUST_STARTED: 'just-started',
  WORKING_ON_DOCS: 'working-on-docs',
  ALMOST_READY: 'almost-ready',
} as const;

export const DONT_KNOW_S2 = {
  START_SLOW: 'start-slow',
  START_FAST: 'start-fast',
  START_QUALITY: 'start-quality',
  RESET_DIRECTION: 'reset-direction',
  FINISH_FAST: 'finish-fast',
  MENTOR_QUALITY: 'mentor-quality',
  FINAL_CHECK: 'final-check',
  QUICK_FINISH: 'quick-finish',
  FINAL_MENTOR: 'final-mentor',
} as const;
