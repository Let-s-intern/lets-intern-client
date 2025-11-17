import SolidButton from '@components/ui/button/SolidButton';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';

const ExperienceCreateButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className="relative">
      <SolidButton
        variant="secondary"
        size="xs"
        icon={<Plus size={16} />}
        onClick={onClick}
      >
        경험 작성
      </SolidButton>

      <div className="absolute right-[calc(100%+10px)] top-1/2 z-10 hidden -translate-y-1/2 md:block">
        <RightTooltip>
          <div>
            <p>인턴, 프로젝트, 동아리 등 다양한 경험을 하나씩 작성해보세요.</p>
            <p>차곡차곡 쌓인 경험들이 당신의 커리어 스토리가 됩니다.</p>
          </div>
        </RightTooltip>
      </div>

      <div className="absolute left-[calc(100%+10px)] top-1/2 z-10 -translate-y-1/2 md:hidden">
        <LeftTooltip>
          <div className="w-[9.375rem]">
            <p>인턴, 프로젝트, 동아리 등 다양한 경험을 하나씩 작성해보세요.</p>
            <p>차곡차곡 쌓인 경험들이 당신의 커리어 스토리가 됩니다.</p>
          </div>
        </LeftTooltip>
      </div>
    </div>
  );
};

export default ExperienceCreateButton;

const RightTooltip = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="relative flex items-center gap-1 whitespace-nowrap rounded-xs bg-neutral-10 py-2 pl-2.5 pr-0.5 text-xs text-white">
      {children}
      <X
        size={16}
        onClick={() => setIsOpen(false)}
        className="m-2 cursor-pointer"
      />

      {/* 꼬리 (SVG) */}
      <svg
        width="7"
        height="10"
        viewBox="0 0 7 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute right-[-6px] top-1/2 -translate-y-1/2"
      >
        <path
          d="M5.86077 5.81373C6.41912 5.41491 6.41912 4.58509 5.86077 4.18627L-1.19249e-07 8.34742e-08L0 10L5.86077 5.81373Z"
          fill="#21272A"
        />
      </svg>
    </div>
  );
};

const LeftTooltip = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="relative flex items-center gap-1 rounded-xs bg-neutral-10 py-2 pl-2.5 pr-0.5 text-xs text-white">
      {children}
      <X
        size={16}
        onClick={() => setIsOpen(false)}
        className="m-2 cursor-pointer"
      />

      {/* 꼬리 (SVG) */}
      <svg
        width="7"
        height="10"
        viewBox="0 0 7 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute left-[-6px] top-1/2 -translate-y-1/2"
      >
        <path
          d="M1.13923 5.81373C0.580878 5.41491 0.580878 4.58509 1.13923 4.18627L7 8.34742e-08L7 10L1.13923 5.81373Z"
          fill="#21272A"
        />
      </svg>
    </div>
  );
};
