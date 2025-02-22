import { CurationItemType } from '@/api/curation';
import CurationInfoSection from '@components/admin/home/curation/section/CurationInfoSection';
import CurationItemsSection from '@components/admin/home/curation/section/CurationItemsSection';
import CurationVisibleSection from '@components/admin/home/curation/section/CurationVisibleSection';
import Header from '@components/admin/ui/header/Header';
import Heading from '@components/admin/ui/heading/Heading';
import { useState } from 'react';

const HomeCurationCreatePage = () => {
  const [curationItems, setCurationItems] = useState<CurationItemType[]>([]);

  return (
    <>
      <div className="mx-6 mb-40 mt-6">
        <Header>
          <Heading>홈 큐레이션 생성</Heading>
        </Header>
        <div className="flex w-full flex-col gap-y-8">
          <div className="flex w-full gap-x-5">
            <CurationInfoSection />
            <CurationVisibleSection />
          </div>
          <CurationItemsSection
            curationItems={curationItems}
            setCurationItems={setCurationItems}
          />
        </div>
      </div>
    </>
  );
};

export default HomeCurationCreatePage;
