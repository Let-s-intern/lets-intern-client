import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { useMentorGuideListQuery } from '@/api/challenge-mentor-guide/challengeMentorGuide';
import { useMentorChallengeListQuery } from '@/api/user/user';
import type { ChallengeMentorGuideItem } from '@/api/challenge-mentor-guide/challengeMentorGuideSchema';

function getRelativeDate(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return '오늘';
  if (diffDays === 1) return '1일 전';
  return `${diffDays}일 전`;
}

function NoticeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-6 md:gap-10">
      <h1 className="text-medium22 text-neutral-0 font-semibold">공지사항</h1>
      {children}
    </div>
  );
}

function GuideRow({
  guide,
  challengeName,
}: {
  guide: ChallengeMentorGuideItem;
  challengeName?: string;
}) {
  const hasContents = !!guide.contents;
  const hasLink = !!guide.link;

  const badges = (
    <div className="flex items-center gap-2">
      {guide.createDate && (
        <span className="border-neutral-80 text-xxsmall12 text-neutral-40 w-fit shrink-0 rounded border px-2.5 py-0.5 md:px-3 md:py-1">
          {getRelativeDate(guide.createDate)}
        </span>
      )}
      {challengeName && (
        <span className="bg-primary-5 text-primary shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium">
          {challengeName}
        </span>
      )}
    </div>
  );

  const title = (
    <span className="text-xsmall14 text-neutral-10 md:text-xsmall16 break-words">
      {guide.title}
    </span>
  );

  const rowClass =
    'flex flex-col gap-2 border-b border-neutral-80 px-4 py-3 transition-colors last:border-b-0 hover:bg-neutral-95 md:flex-row md:items-center md:gap-4 md:px-6 md:py-4';

  if (hasContents) {
    return (
      <Link to={`/notice/${guide.challengeMentorGuideId}`} className={rowClass}>
        {badges}
        {title}
      </Link>
    );
  }

  return (
    <a
      href={hasLink ? guide.link! : '#'}
      target={hasLink ? '_blank' : undefined}
      rel={hasLink ? 'noopener noreferrer' : undefined}
      className={rowClass}
    >
      {badges}
      {title}
    </a>
  );
}

export default function NoticeListPage() {
  const { data, isLoading } = useMentorGuideListQuery();
  const guides = data?.challengeMentorGuideList ?? [];
  const { data: challengeData } = useMentorChallengeListQuery();

  // challengeId → 챌린지 이름 매핑
  const challengeNameMap = useMemo(() => {
    const map = new Map<number, string>();
    for (const c of challengeData?.myChallengeMentorVoList ?? []) {
      map.set(c.challengeId, c.title);
    }
    return map;
  }, [challengeData]);

  // 노출 가능한 공지만 필터 → 고정/일반 분리
  const visibleGuides = useMemo(() => {
    const now = new Date();
    return guides.filter((g) => {
      if (g.isVisible === false) return false;
      if (g.dateType === 'CUSTOM') {
        if (g.startDate && new Date(g.startDate) > now) return false;
        if (g.endDate && new Date(g.endDate) < now) return false;
      }
      return true;
    });
  }, [guides]);

  const fixedGuides = useMemo(
    () => visibleGuides.filter((g) => g.isFixed),
    [visibleGuides],
  );
  const normalGuides = useMemo(
    () => visibleGuides.filter((g) => !g.isFixed),
    [visibleGuides],
  );

  if (isLoading) {
    return (
      <NoticeLayout>
        <div className="text-xsmall14 text-neutral-40 py-20 text-center">
          불러오는 중...
        </div>
      </NoticeLayout>
    );
  }

  if (visibleGuides.length === 0) {
    return (
      <NoticeLayout>
        <div className="text-xsmall14 text-neutral-40 py-20 text-center">
          등록된 공지가 없습니다.
        </div>
      </NoticeLayout>
    );
  }

  return (
    <NoticeLayout>
      {fixedGuides.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="text-small18 text-neutral-0 font-semibold">
            중요 공지
          </h2>
          <div className="border-neutral-80 flex flex-col rounded-[16px] border">
            {fixedGuides.map((guide) => (
              <GuideRow
                key={guide.challengeMentorGuideId}
                guide={guide}
                challengeName={
                  guide.challengeId
                    ? challengeNameMap.get(guide.challengeId)
                    : undefined
                }
              />
            ))}
          </div>
        </section>
      )}

      <section className="flex flex-col gap-4">
        <h2 className="text-small18 text-neutral-0 font-semibold">
          프로그램 공지
        </h2>
        {normalGuides.length > 0 ? (
          <div className="border-neutral-80 flex flex-col rounded-[16px] border">
            {normalGuides.map((guide) => (
              <GuideRow
                key={guide.challengeMentorGuideId}
                guide={guide}
                challengeName={
                  guide.challengeId
                    ? challengeNameMap.get(guide.challengeId)
                    : undefined
                }
              />
            ))}
          </div>
        ) : (
          <div className="text-xsmall14 text-neutral-40 py-10 text-center">
            등록된 프로그램 공지가 없습니다.
          </div>
        )}
      </section>
    </NoticeLayout>
  );
}
