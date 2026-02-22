'use client';

import type { GuidebookIdSchema } from '@/schema';
import ProgramDetailNavigation from '../ProgramDetailNavigation';
import GuidebookBasicInfoSection from './ui/GuidebookBasicInfoSection';

const GuidebookView: React.FC<{
  guidebook: GuidebookIdSchema;
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
