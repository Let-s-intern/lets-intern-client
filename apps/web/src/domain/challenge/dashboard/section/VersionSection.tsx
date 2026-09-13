'use client';

import { useApplicationVersionQuery } from '@/api/application';
import { useState } from 'react';
import VersionChangeModal from '../modal/VersionChangeModal';

interface VersionSectionProps {
  applicationId: string;
}

/**
 * 대시보드의 `내 버전` 줄. 서버가 준 changeable 로 `변경` 노출을 정한다.
 * 버전이 없는 챌린지와 LIGHT 는 버전을 쓰지 않으므로 그리지 않는다 (설계안 D1).
 */
const VersionSection = ({ applicationId }: VersionSectionProps) => {
  const { data: version } = useApplicationVersionQuery(applicationId);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (
    !version?.currentVersion ||
    version.unavailableReason === 'NO_VERSION' ||
    version.unavailableReason === 'LIGHT'
  ) {
    return null;
  }

  return (
    <section className="mt-2 flex items-center gap-2">
      <span className="text-xsmall14 text-neutral-40">내 버전</span>
      <span className="text-xsmall14 font-semibold">
        {version.currentVersion.title}
      </span>
      {version.changeable && (
        <button
          type="button"
          className="text-xsmall14 text-primary"
          onClick={() => setIsModalOpen(true)}
        >
          변경
        </button>
      )}
      {isModalOpen && (
        <VersionChangeModal
          applicationId={applicationId}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </section>
  );
};

export default VersionSection;
