import { Link } from 'react-router-dom';
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

interface NotificationDropdownProps {
  guides: ChallengeMentorGuideItem[];
  isRead: (id: number) => boolean;
  onMarkRead: (id: number) => void;
  onClose: () => void;
}

export default function NotificationDropdown({
  guides,
  isRead,
  onMarkRead,
  onClose,
}: NotificationDropdownProps) {
  const recentGuides = guides.slice(0, 20);

  const handleClick = (guide: ChallengeMentorGuideItem) => {
    onMarkRead(guide.challengeMentorGuideId);
    if (!guide.contents && guide.link) {
      window.open(guide.link, '_blank', 'noopener,noreferrer');
    }
    onClose();
  };

  return (
    <div className="border-neutral-80 absolute left-0 top-full z-50 mt-2 w-[320px] rounded-xl border bg-white shadow-lg">
      <div className="border-neutral-90 border-b px-4 py-3">
        <span className="text-xsmall14 text-neutral-10 font-semibold">
          알림
        </span>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {recentGuides.length === 0 ? (
          <div className="text-xsmall14 text-neutral-40 px-4 py-8 text-center">
            알림이 없습니다
          </div>
        ) : (
          recentGuides.map((guide) => {
            const read = isRead(guide.challengeMentorGuideId);
            const hasContents = !!guide.contents;

            const content = (
              <div
                className={`border-neutral-90 hover:bg-neutral-95 flex flex-col gap-1 border-b px-4 py-3 transition-colors last:border-b-0 ${
                  read ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  {!read && (
                    <span className="h-2 w-2 shrink-0 rounded-full bg-red-500" />
                  )}
                  <span className="text-xsmall14 text-neutral-10 truncate font-medium">
                    {guide.title}
                  </span>
                </div>
                {guide.createDate && (
                  <span className="text-xxsmall12 text-neutral-40">
                    {getRelativeDate(guide.createDate)}
                  </span>
                )}
              </div>
            );

            if (hasContents) {
              return (
                <Link
                  key={guide.challengeMentorGuideId}
                  to={`/mentor/notice/${guide.challengeMentorGuideId}`}
                  onClick={() => handleClick(guide)}
                >
                  {content}
                </Link>
              );
            }

            return (
              <button
                key={guide.challengeMentorGuideId}
                type="button"
                className="w-full text-left"
                onClick={() => handleClick(guide)}
              >
                {content}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
