import type { ChallengeMentorGuideItem } from '@/api/challenge-mentor-guide/challengeMentorGuideSchema';
import type { NoticeForm, ContentType } from '../types';

/** API 응답 아이템을 NoticeForm으로 변환 */
export function guideToForm(guide: ChallengeMentorGuideItem): NoticeForm {
  const hasContents = !!guide.contents;
  let contentType: ContentType = 'URL';
  if (hasContents) {
    try {
      const parsed = JSON.parse(guide.contents!);
      contentType = parsed?.root ? 'EDITOR' : 'MARKDOWN';
    } catch {
      contentType = 'MARKDOWN';
    }
  }

  return {
    title: guide.title ?? '',
    link: guide.link ?? '',
    contents: guide.contents ?? '',
    contentType,
    challengeScopeType: (guide.challengeScopeType ??
      'ALL') as NoticeForm['challengeScopeType'],
    mentorScopeType: (guide.mentorScopeType ??
      'ALL_MENTOR') as NoticeForm['mentorScopeType'],
    challengeId: guide.challengeId ? String(guide.challengeId) : '',
    challengeMentorId: guide.challengeMentorId
      ? String(guide.challengeMentorId)
      : '',
    dateType: (guide.dateType ?? 'INFINITE') as NoticeForm['dateType'],
    startDate: guide.startDate ?? '',
    endDate: guide.endDate ?? '',
    isFixed: guide.isFixed ?? false,
  };
}
