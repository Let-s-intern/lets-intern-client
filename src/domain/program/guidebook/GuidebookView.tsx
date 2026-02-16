'use client';

import type { GuidebookData } from '@/api/guidebook/guidebookSchema';
import ProgramDetailNavigation from '../ProgramDetailNavigation';
import GuidebookBasicInfoSection from './ui/GuidebookBasicInfoSection';

interface GuidebookViewProps {
  guidebook: GuidebookData;
  id: string;
}

const GuidebookView = ({ guidebook }: GuidebookViewProps) => {
  return (
    <div className="w-full">
      <GuidebookBasicInfoSection guidebook={guidebook} />
      <ProgramDetailNavigation programType="guidebook" />
    </div>
  );
};

export default GuidebookView;
