import { ReactNode } from 'react';

// ---- IntroSection ----

export interface IntroBubbleConfig {
  text: ReactNode;
  align: 'left' | 'right' | 'center';
}

export interface IntroSectionConfig {
  backgroundColor: string;
  primaryColor: string;
  bubbleBackgroundColor: string;
  bubbleTextColor: string;
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
  getTitle: (weekText: string) => ReactNode;
  description: ReactNode;
  cards: FeatureCardConfig[];
  primaryColor: string;
  cardGradient: string;
}

// ---- CheckListSection ----

export interface CheckListItemConfig {
  title: string[];
  content: string[][];
}

export interface CheckListSectionConfig {
  items: CheckListItemConfig[];
  boxBackgroundColor: string;
  badgeBackgroundColor: string;
  checkboxColor: string;
}

// ---- CurriculumPointsSection ----

export interface CurriculumPointCardConfig {
  title: string;
  description: ReactNode;
}

export interface CurriculumPointsSectionConfig {
  getTitle: (weekText: string) => ReactNode;
  getCurriculumCards?: (lectureCount: number) => CurriculumPointCardConfig[];
  primaryColor: string;
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
  subtitle: string;
  title: ReactNode;
  differentiators: DifferentiatorItemConfig[];
  primaryColor: string;
  activeBoxBgColor: string;
}

// ---- ReviewSection ----

export interface ReviewSectionConfig {
  reviewLinkQuery: Record<string, string>;
  starBadgeBgColor: string;
  starColor: string;
  bubbleBgColor: string;
  buttonBgColor: string;
}

// ---- OverviewSection ----

export interface OverviewSectionConfig {
  backgroundColor: string;
  stepBadgeBackgroundColor: string;
  titleBadgeColor: string;
  getTitle: (weekText: string) => string;
}
