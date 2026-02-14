export type PersonaId =
  | 'starter'
  | 'resume'
  | 'coverLetter'
  | 'portfolio'
  | 'specialized'
  | 'dontKnow';

export type PlanId = 'basic' | 'standard' | 'premium';

export interface Persona {
  id: PersonaId;
  title: string;
  description: string;
  badge?: string;
}

export interface QuestionOption {
  value: string;
  title: string;
  description?: string;
  accent?: string;
}

export interface CurationQuestion {
  id: 'step1' | 'step2';
  title: string;
  helper?: string;
  options: QuestionOption[];
}

export type ProgramId =
  | 'experience'
  | 'resume'
  | 'coverLetter'
  | 'portfolio'
  | 'enterpriseCover'
  | 'marketingAllInOne'
  | 'hrAllInOne';

export interface ProgramPlan {
  id: PlanId;
  name: string;
  price: string;
  note?: string;
  feedback?: string;
}

export interface ProgramContent {
  id: ProgramId;
  title: string;
  subtitle: string;
  badge?: string;
  category?: string;
  target: string;
  duration: string;
  deliverable: string;
  feedback: string;
  curriculum: string[];
  features?: string[];
  plans: ProgramPlan[];
}

export interface FormValues {
  personaId?: PersonaId;
  step1: string;
  step2: string;
}

export interface ProgramRecommendation {
  programId: ProgramId;
  emphasis: 'primary' | 'secondary';
  reason: string;
  suggestedPlanId?: PlanId;
}

export interface CurationResult {
  personaId: PersonaId;
  headline: string;
  summary: string;
  recommendations: ProgramRecommendation[];
  emphasisNotes?: string[];
}

export interface ChallengeComparisonRow {
  programId: ProgramId;
  label: string;
  target: string;
  duration: string;
  pricing: string;
  feedback: string;
  deliverable: string;
  features?: string[];
}

export interface FrequentComparisonItem {
  title: string;
  left: string;
  right: string;
  rows: { label: string; left: string; right: string }[];
}

export interface FAQItem {
  question: string;
  answer: string;
}
