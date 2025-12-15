interface MissionGuideSkeletonProps {
  className?: string;
  showDeadline?: boolean; // 마감일 표시 여부
  showMaterials?: boolean; // 미션 자료 모음 표시 여부
  variant?: 'regular' | 'zero' | 'bonus'; // 스켈레톤 변형
}

const MissionGuideSkeleton = ({
  className,
  showDeadline = true,
  showMaterials = true,
  variant = 'regular',
}: MissionGuideSkeletonProps) => {
  return (
    <div className={`flex flex-col gap-3 ${className || ''}`}>
      {/* 제목 및 마감일 스켈레톤 */}
      <div className="flex flex-row gap-2">
        <div className="rounded h-6 w-32 animate-pulse bg-neutral-80" />
        {showDeadline && (
          <div className="rounded h-4 w-24 animate-pulse bg-neutral-80" />
        )}
      </div>

      {/* 미션 가이드 섹션 스켈레톤 */}
      <section className="flex flex-col gap-5 rounded-xs border border-neutral-80 px-4 py-4">
        {/* 인트로/설명 섹션 */}
        <section className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            {variant === 'bonus' ? (
              <>
                <div className="rounded mb-2 h-5 w-64 animate-pulse bg-neutral-80" />
                <div className="rounded h-4 w-full animate-pulse bg-neutral-80" />
                <div className="rounded h-4 w-3/4 animate-pulse bg-neutral-80" />
              </>
            ) : (
              <>
                <div className="rounded h-4 w-full animate-pulse bg-neutral-80" />
                <div className="rounded h-4 w-3/4 animate-pulse bg-neutral-80" />
                {variant === 'zero' && (
                  <div className="rounded h-4 w-2/3 animate-pulse bg-neutral-80" />
                )}
              </>
            )}
          </div>
        </section>

        {/* 참여 방법 섹션 (보너스 미션용) */}
        {variant === 'bonus' && (
          <section className="flex flex-col gap-3">
            <div className="rounded h-5 w-48 animate-pulse bg-neutral-80" />
            <div className="flex flex-col gap-2 rounded-xxs bg-neutral-95 p-3">
              <div className="rounded h-4 w-full animate-pulse bg-neutral-80" />
              <div className="rounded h-4 w-3/4 animate-pulse bg-neutral-80" />
              <div className="rounded h-4 w-2/3 animate-pulse bg-neutral-80" />
            </div>
          </section>
        )}

        <div className="h-px bg-neutral-80" />

        {/* 미션 가이드 섹션 */}
        <section className="flex flex-col gap-3">
          <div className="rounded h-5 w-20 animate-pulse bg-neutral-80" />
          <div className="rounded h-4 w-full animate-pulse bg-neutral-80" />
          <div className="rounded h-4 w-2/3 animate-pulse bg-neutral-80" />
        </section>

        {/* 미션 자료 모음 섹션 */}
        {showMaterials && (
          <section className="flex flex-col gap-4 rounded-xxs bg-neutral-95 p-3 pb-5">
            <div className="flex flex-col gap-2">
              <div className="rounded h-5 w-24 animate-pulse bg-neutral-80" />
              <div className="rounded h-4 w-48 animate-pulse bg-neutral-80" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="rounded h-10 w-full animate-pulse bg-neutral-80" />
              <div className="rounded h-10 w-full animate-pulse bg-neutral-80" />
            </div>
          </section>
        )}

        {/* 후기 작성 가이드라인 (보너스 미션용) */}
        {variant === 'bonus' && (
          <section className="flex flex-col gap-4">
            <div className="rounded h-5 w-56 animate-pulse bg-neutral-80" />
            <div className="flex flex-col gap-2 rounded-xxs bg-primary-5 p-3">
              <div className="rounded h-4 w-full animate-pulse bg-neutral-80" />
              <div className="rounded h-4 w-3/4 animate-pulse bg-neutral-80" />
              <div className="rounded h-4 w-2/3 animate-pulse bg-neutral-80" />
            </div>
          </section>
        )}
      </section>
    </div>
  );
};

export default MissionGuideSkeleton;
