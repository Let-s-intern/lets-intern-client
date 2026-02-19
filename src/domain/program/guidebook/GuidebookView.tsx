'use client';

import type { GuidebookData } from '@/schema';
import ProgramDetailNavigation from '../ProgramDetailNavigation';
import GuidebookBasicInfoSection from './ui/GuidebookBasicInfoSection';

const GuidebookView: React.FC<{
  guidebook: GuidebookData;
  id: string;
}> = ({ guidebook }) => {
  return (
    <div className="w-full">
      <GuidebookBasicInfoSection guidebook={guidebook} />
      <ProgramDetailNavigation programType="guidebook" />
    </div>
  );
};

export default GuidebookView;
