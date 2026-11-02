import {
  LETSCON_DAY14_SESSIONS,
  LETSCON_DAY15_SESSIONS,
  type LetsconSession,
} from '../data/sessions';

export type LetsconDay15Mode = 'online' | 'offline';

export interface LetsconSelection {
  day14: string[];
  day15: string[];
  mode: LetsconDay15Mode;
}

/** 오프라인은 11/15 두 세션을 함께 신청한다 */
const getDay15SessionIds = ({ day15, mode }: LetsconSelection) =>
  mode === 'offline' ? LETSCON_DAY15_SESSIONS.map(({ id }) => id) : day15;

export const getSelectedSessionCount = (selection: LetsconSelection) =>
  selection.day14.length + getDay15SessionIds(selection).length;

const toTitles = (sessions: LetsconSession[], ids: string[]) =>
  sessions.filter(({ id }) => ids.includes(id)).map(({ title }) => title);

export interface LetsconSelectedDay {
  label: string;
  titles: string[];
}

/** 신청 창 하단에 보여 줄 날짜별 선택 내역. 고른 세션이 없는 날은 뺀다 */
export const getSelectedDays = (
  selection: LetsconSelection,
): LetsconSelectedDay[] =>
  [
    {
      label: '11/14 온라인',
      titles: toTitles(LETSCON_DAY14_SESSIONS, selection.day14),
    },
    {
      label: `11/15 ${selection.mode === 'offline' ? '오프라인' : '온라인'}`,
      titles: toTitles(LETSCON_DAY15_SESSIONS, getDay15SessionIds(selection)),
    },
  ].filter(({ titles }) => titles.length > 0);

/** 마그넷 답변으로 저장한다. Redash 에서 사람이 읽는 값이다 */
export const buildSessionAnswer = (selection: LetsconSelection) => {
  const day14 =
    toTitles(LETSCON_DAY14_SESSIONS, selection.day14).join(', ') || '없음';
  const day15 =
    toTitles(LETSCON_DAY15_SESSIONS, getDay15SessionIds(selection)).join(
      ', ',
    ) || '없음';
  const mode = selection.mode === 'offline' ? '오프라인' : '온라인';

  return `11/14 온라인: ${day14} | 11/15 ${mode}: ${day15}`;
};
