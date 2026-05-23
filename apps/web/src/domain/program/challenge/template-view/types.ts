import { ReactNode } from 'react';

// ---- IntroSection ----

export interface IntroBubbleConfig {
  text: ReactNode;
  align: 'left' | 'right' | 'center';
}

export interface IntroSectionConfig {
  primaryColor: string;
  lightAccentColor: string;
  backgroundColor: string;
  titleLine1: string;
  description: ReactNode;
  bubbles: IntroBubbleConfig[];
  userImageSrc: string;
}

// ---- IntroFeaturesSection ----

export interface FeatureCardConfig {
  title: ReactNode;
  description: ReactNode;
  mobileImg: string;
  desktopImg: string;
  alt: string;
}

export interface IntroFeaturesSectionConfig {
  primaryColor: string;
  getTitle: (weekText: string) => ReactNode;
  description: ReactNode;
  cards: FeatureCardConfig[];
  cardGradient: string;
}

// ---- CheckListSection ----

export interface CheckListItemConfig {
  title: string[];
  content: string[][];
}

export interface CheckListSectionConfig {
  primaryColor: string;
  lightAccentColor: string;
  items: CheckListItemConfig[];
}

// ---- CurriculumPointsSection ----

export interface CurriculumPointCardConfig {
  title: string;
  description: ReactNode;
}

export interface CurriculumPointsSectionConfig {
  primaryColor: string;
  getTitle: (weekText: string) => ReactNode;
  getCurriculumCards?: (lectureCount: number) => CurriculumPointCardConfig[];
}

// ---- DifferentiatorsSection ----

export interface ChecklistItemConfig {
  text: string;
}

export interface DifferentiatorItemConfig {
  number: string;
  title: string;
  before: ChecklistItemConfig[];
  after: ChecklistItemConfig[];
}

export interface FeedbackBenefitConfig {
  title: string;
  description: ReactNode;
}

export interface DifferentiatorsSectionConfig {
  primaryColor: string;
  lightAccentColor: string;
  subtitle: string;
  title: ReactNode;
  differentiators: DifferentiatorItemConfig[];
}

// ---- ReviewSection ----

export interface ReviewSectionConfig {
  primaryColor: string;
  lightAccentColor: string;
  bubbleBgColor: string;
  buttonBgColor: string;
}

// ---- OverviewSection ----

export interface OverviewSectionConfig {
  primaryColor: string;
  backgroundColor: string;
  stepBadgeBackgroundColor: string;
  getTitle: (weekText: string) => string;
}

// ---- CurriculumSection ----

export interface CalendarItemConfig {
  number: number;
  title: string;
  description: ReactNode;
}

export interface CurriculumSectionConfig {
  primaryColor: string;
  lightAccentColor: string;
  getTitle: (lectureCount: number, weekText: string) => ReactNode;
  description: ReactNode;
  getCalendarItems: (lectureCount: number) => CalendarItemConfig[];
}
