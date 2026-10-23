import { WEEK_PLANS } from './coursePlan';
import {
  PLAYBOOK_OUTPUT,
  PLAYBOOK_STRUCTURE,
  PLAYBOOK_WITH,
} from './playbookDashboard';

describe('playbookDashboard (개편 시안 10)', () => {
  describe('WITH LET’S CAREER', () => {
    it('혜택이 4카드다', () => {
      expect(PLAYBOOK_WITH.benefits).toHaveLength(4);
      expect(PLAYBOOK_WITH.benefits.map((item) => item.title)).toEqual([
        '챌린지',
        '현직자 Live 세미나',
        '가이드북 · VOD',
        '현직자 1:1 멘토링',
      ]);
    });

    it('흐름이 STEP 01~05 다음 GOAL 로 끝난다', () => {
      expect(PLAYBOOK_WITH.flow.map((step) => step.no)).toEqual([
        'STEP 01',
        'STEP 02',
        'STEP 03',
        'STEP 04',
        'STEP 05',
        'GOAL',
      ]);
    });
  });

  describe('PLAYBOOK STRUCTURE', () => {
    it('탭이 3개다', () => {
      expect(PLAYBOOK_STRUCTURE.tabs).toHaveLength(3);
      expect(PLAYBOOK_STRUCTURE.tabs.map((tab) => tab.label)).toEqual([
        '10주 취준 계획',
        '마케팅 채용공고 모음',
        '패스 참여자 리더보드',
      ]);
    });

    /*
     * 본문은 순서가 아니라 id 로 찾는다. 탭 순서가 바뀌어도 짝이 어긋나지 않게
     * id 세 개가 그대로인지 못 박아 둔다.
     */
    it('탭 id 세 개가 본문과 짝지어져 있다', () => {
      expect(PLAYBOOK_STRUCTURE.tabs.map((tab) => tab.id)).toEqual([
        'plan',
        'jobs',
        'leaderboard',
      ]);
      expect(PLAYBOOK_STRUCTURE.checklist.length).toBeGreaterThan(0);
      expect(PLAYBOOK_STRUCTURE.jobs.rows.length).toBeGreaterThan(0);
      expect(PLAYBOOK_STRUCTURE.leaderboard.rows.length).toBeGreaterThan(0);
    });

    it('채용공고가 4줄이고 마감 배지가 D-3 · D-7 · D-14 · 상시 다', () => {
      expect(PLAYBOOK_STRUCTURE.jobs.rows).toHaveLength(4);
      expect(PLAYBOOK_STRUCTURE.jobs.rows.map((row) => row.deadline)).toEqual([
        'D-3',
        'D-7',
        'D-14',
        '상시',
      ]);
    });

    /*
     * 배지 색은 '상시' 라는 문구가 아니라 이 값으로 갈린다. 마지막 줄만 회색
     * 테두리이므로 alwaysOpen 도 마지막 줄에만 붙어야 한다.
     */
    it('상시 채용 표시가 마지막 한 줄에만 붙는다', () => {
      expect(PLAYBOOK_STRUCTURE.jobs.rows.map((row) => row.alwaysOpen)).toEqual(
        [false, false, false, true],
      );
    });

    it('모든 공고에 회사 · 제목 · 태그가 있다', () => {
      for (const row of PLAYBOOK_STRUCTURE.jobs.rows) {
        expect(row.company.length).toBeGreaterThan(0);
        expect(row.title.length).toBeGreaterThan(0);
        expect(row.tags.length).toBeGreaterThan(0);
      }
    });

    it('리더보드가 5줄이고 순위가 1~5 로 이어진다', () => {
      expect(PLAYBOOK_STRUCTURE.leaderboard.rows).toHaveLength(5);
      expect(
        PLAYBOOK_STRUCTURE.leaderboard.rows.map((row) => row.rank),
      ).toEqual([1, 2, 3, 4, 5]);
    });

    it('리더보드 진행률이 0~100 이고 순위와 같은 방향으로 내려간다', () => {
      const percents = PLAYBOOK_STRUCTURE.leaderboard.rows.map(
        (row) => row.percent,
      );
      for (const percent of percents) {
        expect(percent).toBeGreaterThanOrEqual(0);
        expect(percent).toBeLessThanOrEqual(100);
      }
      expect(percents).toEqual([...percents].sort((a, b) => b - a));
    });

    /*
     * 강조 줄이 둘이면 어느 쪽이 나인지 알 수 없고, 없으면 강조가 사라진다.
     * 「나의 진행률」은 3위 한 줄뿐이다.
     */
    it('나의 진행률 줄이 정확히 하나이고 3위다', () => {
      const mine = PLAYBOOK_STRUCTURE.leaderboard.rows.filter(
        (row) => row.isMe,
      );
      expect(mine).toHaveLength(1);
      expect(mine[0].rank).toBe(3);
      expect(mine[0].name).toBe('나의 진행률');
    });

    it('체크리스트가 5줄이고 완료는 앞 2줄이다', () => {
      expect(PLAYBOOK_STRUCTURE.checklist).toHaveLength(5);
      expect(PLAYBOOK_STRUCTURE.checklist.map((row) => row.done)).toEqual([
        true,
        true,
        false,
        false,
        false,
      ]);
    });

    /*
     * 목업 제목을 여기 직접 적으면 주차 계획이 바뀔 때 목업만 옛 제목으로 남는다.
     * 같은 값을 가리키는지 못 박아 둔다.
     */
    it('주차 제목을 주차 계획에서 가져온다', () => {
      expect(PLAYBOOK_STRUCTURE.weekTitle).toBe(
        WEEK_PLANS.a[PLAYBOOK_STRUCTURE.weekNo - 1].title,
      );
    });
  });

  describe('OUTPUT', () => {
    it('산출물이 WEEK 01~10 으로 빠짐없이 이어진다', () => {
      expect(PLAYBOOK_OUTPUT.weeks.map((item) => item.week)).toEqual([
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
      ]);
    });

    it('모든 주차에 제목과 설명이 있다', () => {
      for (const item of PLAYBOOK_OUTPUT.weeks) {
        expect(item.title.length).toBeGreaterThan(0);
        expect(item.desc.length).toBeGreaterThan(0);
      }
    });

    /*
     * 산출물은 주차 데이터에서 가져온다. 시안 문구가 다른 네 주차만 덮어쓰고,
     * 나머지 여섯 주차는 `WEEK_PLANS.a[].output` 그 자체여야 한다.
     */
    it('덮어쓰지 않은 주차는 주차 데이터의 산출물을 그대로 쓴다', () => {
      const fromDesign = [5, 6, 7, 10];
      for (const plan of WEEK_PLANS.a) {
        if (fromDesign.includes(plan.week)) continue;
        const item = PLAYBOOK_OUTPUT.weeks[plan.week - 1];
        expect(item.title).toBe(plan.output);
      }
    });
  });
});
