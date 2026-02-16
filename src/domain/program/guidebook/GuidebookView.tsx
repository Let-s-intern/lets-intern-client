'use client';

import type { GuidebookData } from '@/api/guidebook/guidebookSchema';
import GuidebookBasicInfoSection from './ui/GuidebookBasicInfoSection';

interface GuidebookViewProps {
  guidebook: GuidebookData;
  id: string;
}

const GuidebookView = ({ guidebook }: GuidebookViewProps) => {
  return (
    <div className="w-full">
      <GuidebookBasicInfoSection guidebook={guidebook} />
    </div>
  );
};

export default GuidebookView;
