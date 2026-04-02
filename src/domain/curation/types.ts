export type PersonaId =
  | 'starter'
  | 'resume'
  | 'coverLetter'
  | 'portfolio'
  | 'specialized'
  | 'interview'
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
  /** step1 value this option belongs to (for step2 filtering) */
  group?: string;
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
  | 'interview'
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
  image?: string;
}
