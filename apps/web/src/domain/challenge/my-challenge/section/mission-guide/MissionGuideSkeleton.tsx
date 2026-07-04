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
        <div className="bg-neutral-80 h-6 w-32 animate-pulse rounded" />
        {showDeadline && (
          <div className="bg-neutral-80 h-4 w-24 animate-pulse rounded" />
        )}
      </div>

      {/* 미션 가이드 섹션 스켈레톤 */}
      <section className="rounded-xs border-neutral-80 flex flex-col gap-5 border px-4 py-4">
        {/* 인트로/설명 섹션 */}
        <section className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            {variant === 'bonus' ? (
              <>
                <div className="bg-neutral-80 mb-2 h-5 w-64 animate-pulse rounded" />
                <div className="bg-neutral-80 h-4 w-full animate-pulse rounded" />
                <div className="bg-neutral-80 h-4 w-3/4 animate-pulse rounded" />
              </>
            ) : (
              <>
                <div className="bg-neutral-80 h-4 w-full animate-pulse rounded" />
                <div className="bg-neutral-80 h-4 w-3/4 animate-pulse rounded" />
                {variant === 'zero' && (
                  <div className="bg-neutral-80 h-4 w-2/3 animate-pulse rounded" />
                )}
              </>
            )}
          </div>
        </section>

        {/* 참여 방법 섹션 (보너스 미션용) */}
        {variant === 'bonus' && (
          <section className="flex flex-col gap-3">
            <div className="bg-neutral-80 h-5 w-48 animate-pulse rounded" />
            <div className="rounded-xxs bg-neutral-95 flex flex-col gap-2 p-3">
              <div className="bg-neutral-80 h-4 w-full animate-pulse rounded" />
              <div className="bg-neutral-80 h-4 w-3/4 animate-pulse rounded" />
              <div className="bg-neutral-80 h-4 w-2/3 animate-pulse rounded" />
            </div>
          </section>
        )}

        <div className="bg-neutral-80 h-px" />

        {/* 미션 가이드 섹션 */}
        <section className="flex flex-col gap-3">
          <div className="bg-neutral-80 h-5 w-20 animate-pulse rounded" />
          <div className="bg-neutral-80 h-4 w-full animate-pulse rounded" />
          <div className="bg-neutral-80 h-4 w-2/3 animate-pulse rounded" />
        </section>

        {/* 미션 자료 모음 섹션 */}
        {showMaterials && (
          <section className="rounded-xxs bg-neutral-95 flex flex-col gap-4 p-3 pb-5">
            <div className="flex flex-col gap-2">
              <div className="bg-neutral-80 h-5 w-24 animate-pulse rounded" />
              <div className="bg-neutral-80 h-4 w-48 animate-pulse rounded" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="bg-neutral-80 h-10 w-full animate-pulse rounded" />
              <div className="bg-neutral-80 h-10 w-full animate-pulse rounded" />
            </div>
          </section>
        )}

        {/* 후기 작성 가이드라인 (보너스 미션용) */}
        {variant === 'bonus' && (
          <section className="flex flex-col gap-4">
            <div className="bg-neutral-80 h-5 w-56 animate-pulse rounded" />
            <div className="rounded-xxs bg-primary-5 flex flex-col gap-2 p-3">
              <div className="bg-neutral-80 h-4 w-full animate-pulse rounded" />
              <div className="bg-neutral-80 h-4 w-3/4 animate-pulse rounded" />
              <div className="bg-neutral-80 h-4 w-2/3 animate-pulse rounded" />
            </div>
          </section>
        )}
      </section>
    </div>
  );
};

export default MissionGuideSkeleton;
