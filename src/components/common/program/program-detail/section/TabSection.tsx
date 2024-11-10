import { useState } from 'react';

import TabBar from '../tab/tab-bar/TabBar';
import DetailTabContent from '../tab/tab-content/DetailTabContent';
import FAQTabContent from '../tab/tab-content/FAQTabContent';
import ReviewTabContent from '../tab/tab-content/ReviewTabContent';

interface TabSectionProps {
  programId: number;
  programType: string;
  isNewProgram: boolean;
}

const TabSection = ({
  programId,
  programType,
  isNewProgram,
}: TabSectionProps) => {
  const [tabIndex, setTabIndex] = useState<number>(0);

  return (
    <section className="flex-1 bg-static-100">
      <TabBar tabIndex={tabIndex} setTabIndex={setTabIndex} />
      {!isNewProgram && (
        <div>
          {tabIndex === 0 && (
            <DetailTabContent programId={programId} programType={programType} />
          )}
          {tabIndex === 1 && (
            <ReviewTabContent programId={programId} programType={programType} />
          )}
          {tabIndex === 2 && (
            <FAQTabContent programId={programId} programType={programType} />
          )}
        </div>
      )}
    </section>
  );
};

export default TabSection;
