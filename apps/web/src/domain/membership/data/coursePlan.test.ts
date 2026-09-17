import {
  CATEGORIES,
  COURSE_PLAN_BODY,
  COURSE_PLAN_HEADER,
  COURSE_PLAN_TYPES,
  COURSE_TAG_LABEL,
  type CourseTag,
  LIVE_SEMINAR_CELLS,
  MATRIX_CELL_MAPS,
  matrixCellKey,
  MONTH_GROUPS,
  Owner,
  PLAYBOOK_CAPTION_LINES,
  PLAYBOOK_SHOT_ALT,
  PLAYBOOK_SHOT_SIZE,
  PLAYBOOK_SHOT_SRC,
  PRESTART_SEMINAR,
  STEPS,
  TYPE_A_MATRIX_CELLS,
  TYPE_B_MATRIX_CELLS,
  WEEK_FLOW,
  WEEK_PLANS,
  weekMonth,
  weekPhase,
  WEEKS,
} from './coursePlan';

const VALID_OWNERS: Owner[] = ['self', 'free', 'challenge', 'challenge-deep'];
const VALID_TAGS: CourseTag[] = [
  'free',
  'template',
  'checklist',
  'vod',
  'challenge',
  'live',
  'mentoring',
];

// 유형 분리 전 MATRIX_CELLS(41칸)를 step|category|owner|tag|title|desc|when 으로 떠 둔 것.
const BEFORE_SPLIT_FINGERPRINT = [
  'step01|job|free|free|세부 직무 6종 훑기|그로스·퍼포먼스·콘텐츠·바이럴·인플루언서·브랜드|',
  'step02|job|free|vod|현직자 직무 세미나 VOD|하는 일과 보는 숫자 비교하기|',
  'step03|job|free|free|관심 산업 2~3개 좁히기|시장·주요 브랜드·최근 캠페인|',
  'step04|job|free|vod|인하우스 vs 대행사|첫 커리어로 어디가 나은지 판단|',
  'step05|job|self|template|면접용 기업 심화|최근 캠페인에 내 의견 붙이기|',
  'step01|experience|free|checklist|경험 진단 체크리스트|지금 경험이 어느 직무에 닿는지|',
  'step02|experience|challenge|challenge|경험을 STAR로 정리|챌린지 미션으로 소재 구조화|',
  'step03|experience|self|template|경험 ↔ JD 키워드 매칭|공고 언어로 바꿔 쓰기|',
  'step04|experience|free|free|사이드 프로젝트 설계|직무별로 뭘 해야 티가 나는지|',
  'step05|experience|self|template|면접 소재화|STAR 경험을 90초 답변으로|',
  'step01|resume|free|free|합격 자소서 가이드북|구조·문항 감 잡기|',
  'step02|resume|challenge|challenge|마케팅 챌린지|이력서·자소서 초안 완성|',
  'step03|resume|self|template|JD별 서류 변형|공고 3개 맞춤 3세트|',
  'step04|resume|free|free|지원동기 40분 워크플로우|막히는 문항 빠르게 뚫기|',
  'step05|resume|self|template|서류 기반 질문 예측|내가 쓴 문장에서 나올 질문|',
  'step01|portfolio|free|free|포폴 기본 구조|무엇을 담고 무엇을 뺄지|',
  'step02|portfolio|challenge|challenge|마케팅 챌린지|포트폴리오 초안 1본 완성|',
  'step03|portfolio|self|template|JD별 포폴 변형|지원 직무에 맞춰 첫 장 바꾸기|',
  'step04|portfolio|free|free|SNS·사이드 프로젝트로 채우기|콘텐츠 4~6개 발행하고 기록|',
  'step05|portfolio|free|checklist|제출본 최종 점검|파일명·용량·링크 권한 확인|',
  'step01|data|free|free|마케터의 툴 지도|GA4·메타·피그마·캡컷·노션|',
  'step02|data|free|vod|CMO·CPO의 필수 역량 강의|뽑는 사람이 보는 기준|',
  'step03|data|free|free|집행 경험 없이 퍼포먼스 지원하기|경험이 없어도 쓸 수 있는 것|',
  'step04|data|free|vod|광고 지표 기준선|CTR·CVR·CPA·ROAS 어느 정도가 평타인가|',
  'step05|data|free|free|AI 활용 경험 쓰는 법|툴 나열은 감점이 되는 이유|',
  'step01|interview|free|free|면접 기본 가이드|면접 유형과 평가 포인트|',
  'step02|interview|self|template|1분 자기소개 초안|기본 스크립트 작성|',
  'step03|interview|free|free|채용공고 채널 지도|원티드·링크드인·자사 ATS·오픈채팅|',
  'step04|interview|free|free|과제 전형·사전 인터뷰 대비|숏폼 기획·콘텐츠 제작 모의 과제|',
  'step05|interview|challenge|challenge|면접 준비 챌린지|모의면접·녹화 피드백|',
  'step05|interview|challenge-deep|mentoring|현직 마케터 커피챗|답변 점검과 지원 복기|',
  'step01|live|challenge|live|마케터 세부 직무 톺아보기|놀유니버스 CRM 마케터|9.20 일 11:00',
  'step01|live|challenge|live|AE가 가져야 할 역량과 포폴 작성법|대학내일 AE|9.22 화 20:00',
  'step02|live|challenge|live|마케팅의 기본|클래스101 콘텐츠 마케터|9.28 월 20:00',
  'step02|live|challenge|live|마케팅 커리어 방향 설정법|CJ 계열사 마케터|10.1 목 20:00',
  'step02|live|challenge|live|사이드 프로젝트로 그로스 사이클 경험하기|네이버 계열사 마케터|10.8 목 20:00',
  'step03|live|challenge|live|AI 주제로 6개월 만에 팔로워 6,000명 만든 방법|팔로워 6,000명 계정 운영자|10.22 목 20:00',
  'step04|live|challenge|live|혼자서도 할 수 있는 메타 광고로 경험 쌓기|위그로스 CEO|10.29 목 20:00',
  'step05|live|challenge|live|마케팅 포트폴리오 A to Z 끝장|렛츠커리어 쥬디 멘토|11.10 화 20:00',
  'step05|live|challenge|live|포트폴리오 놓고 실제로 묻는 질문 — 실무 면접 시연|현직 마케터|11.19 목 20:00',
  'step05|live|challenge|live|인턴·계약직·정규직 오퍼, 무엇을 보고 고르나|현직 마케터|11.26 목 20:00',
];

describe('coursePlan 데이터 무결성', () => {
  describe('매트릭스 차원', () => {
    it('단계는 5종(STEP01~05)이다', () => {
      expect(STEPS).toHaveLength(5);
    });

    it('카테고리는 7종이다 (시안 8)', () => {
      expect(CATEGORIES).toHaveLength(7);
    });

    /*
     * 셀 개수를 못 박아 둔다. 표가 41칸이라 손으로 넣다 한 줄 빠뜨려도 화면에서는
     * 빈 칸이 원래 그런 것처럼 보인다 — 숫자로 잡는 게 유일한 방법이다.
     */
    it('셀은 41개다 (시안 8)', () => {
      expect(TYPE_A_MATRIX_CELLS).toHaveLength(41);
    });

    /*
     * 유형별로 나누기 전 한 벌이던 매트릭스(41칸)를 그대로 TYPE A 로 옮겼다(PRD Q1).
     * 옮기면서 칸 하나라도 바뀌면 화면이 달라진다 — 모든 필드를 순서까지 고정한다.
     */
    it('TYPE A 매트릭스는 유형 분리 전 매트릭스와 순서·내용이 같다', () => {
      const fingerprint = TYPE_A_MATRIX_CELLS.map((cell) =>
        [
          cell.step,
          cell.category,
          cell.owner,
          cell.tag,
          cell.title,
          cell.desc,
          cell.when ?? '',
        ].join('|'),
      );
      expect(fingerprint).toEqual(BEFORE_SPLIT_FINGERPRINT);
    });

    it('TYPE A 의 라이브 세미나 줄은 공유 데이터 그 자체다', () => {
      const live = TYPE_A_MATRIX_CELLS.filter(
        (cell) => cell.category === 'live',
      );
      expect(live).toHaveLength(LIVE_SEMINAR_CELLS.length);
      live.forEach((cell, i) => expect(cell).toBe(LIVE_SEMINAR_CELLS[i]));
    });

    // 시안 8 은 STEP05 의 면접·지원 실행과 라이브 세미나에 한 칸당 여러 항목을 넣는다.
    it('한 칸에 여러 항목이 들어가는 자리가 있다', () => {
      const key = matrixCellKey('step05', 'interview');
      expect(MATRIX_CELL_MAPS.a.get(key)).toHaveLength(2);
    });

    it('모든 (단계, 카테고리) 조합이 최소 하나의 셀로 존재한다', () => {
      for (const step of STEPS) {
        for (const category of CATEGORIES) {
          const cells = MATRIX_CELL_MAPS.a.get(
            matrixCellKey(step.id, category.id),
          );
          expect(cells).toBeDefined();
          expect(cells?.length).toBeGreaterThanOrEqual(1);
        }
      }
    });

    it('모든 셀의 owner·title·desc 가 유효하다', () => {
      for (const cell of TYPE_A_MATRIX_CELLS) {
        expect(VALID_OWNERS).toContain(cell.owner);
        expect(cell.title.length).toBeGreaterThan(0);
        expect(cell.desc.length).toBeGreaterThan(0);
      }
    });

    it('일정은 desc 가 아니라 when 에 들어간다', () => {
      // desc 에 "연사 · 10.8 목 20:00" 처럼 한 문자열로 두면, 좁은 셀에서
      // "10.8 목" / "20:00" 으로 갈려 다른 날 일정처럼 읽힌다. when 은 화면에서
      // nowrap 한 덩어리로 렌더된다(.cpm-cell-when).
      const schedule = /\d+\.\d+\s[월화수목금토일]\s\d+:\d+/;
      for (const cell of TYPE_A_MATRIX_CELLS) {
        expect(cell.desc).not.toMatch(schedule);
      }
    });

    it('라이브 세미나 셀은 모두 일정(when)을 갖는다', () => {
      const live = TYPE_A_MATRIX_CELLS.filter((cell) => cell.tag === 'live');
      expect(live.length).toBeGreaterThan(0);
      for (const cell of live) {
        expect(cell.when).toMatch(/^\d+\.\d+ [월화수목금토일] \d+:\d+$/);
      }
    });

    it('모든 셀이 배지(tag) 4종 중 하나를 갖고 라벨이 비어 있지 않다', () => {
      for (const cell of TYPE_A_MATRIX_CELLS) {
        expect(VALID_TAGS).toContain(cell.tag);
        expect(COURSE_TAG_LABEL[cell.tag].length).toBeGreaterThan(0);
      }
    });

    it('배지 라벨은 시안 8 범례 7종이다', () => {
      expect(Object.keys(COURSE_TAG_LABEL)).toHaveLength(7);
      for (const label of Object.values(COURSE_TAG_LABEL)) {
        expect(label.length).toBeGreaterThan(0);
      }
    });
  });

  describe('TYPE B 매트릭스', () => {
    const own = TYPE_B_MATRIX_CELLS.filter((cell) => cell.category !== 'live');

    // 시안 image.png — 6개 영역 × 5단계에 면접·지원 실행 STEP05 만 2장이다.
    it('라이브 세미나를 뺀 카드는 31장이다', () => {
      expect(own).toHaveLength(31);
    });

    it('6개 영역 × 5단계를 모두 채우고, 면접·지원 실행 STEP05 만 2장이다', () => {
      for (const step of STEPS) {
        for (const category of CATEGORIES) {
          if (category.id === 'live') continue;
          const count = own.filter(
            (cell) => cell.step === step.id && cell.category === category.id,
          ).length;
          const expected =
            step.id === 'step05' && category.id === 'interview' ? 2 : 1;
          expect(count).toBe(expected);
        }
      }
    });

    it('모든 태그가 COURSE_TAG_LABEL 안에 있다', () => {
      for (const cell of TYPE_B_MATRIX_CELLS) {
        expect(Object.keys(COURSE_TAG_LABEL)).toContain(cell.tag);
      }
    });

    // 시안 image.png 의 연보라 배경은 STEP 02 챌린지 3장뿐이다. 태그가 챌린지·멘토링이어도
    // 다른 단계 카드는 흰 배경이다(면접 준비 챌린지, 현직 마케터 커피챗·과제 피드백).
    it('연보라로 강조되는 카드는 STEP 02 챌린지 3장뿐이다', () => {
      const provided = own.filter(
        (cell) => cell.owner === 'challenge' || cell.owner === 'challenge-deep',
      );
      expect(provided.map((cell) => [cell.step, cell.title])).toEqual([
        ['step02', '경험 재정렬'],
        ['step02', '마케팅 챌린지'],
        ['step02', '마케팅 챌린지'],
      ]);
    });

    it('9.20 세미나는 일시 뒤에 「시작 전」을 따로 단다', () => {
      const first = LIVE_SEMINAR_CELLS.find(
        (cell) => cell.when === '9.20 일 11:00',
      );
      expect(first?.whenNote).toBe('시작 전');
      // when 에 합치면 주 단위 보기의 「시작 전」 딱지와 두 번 찍힌다
      expect(first?.when).not.toContain('시작 전');
    });

    it('라이브 세미나 줄은 TYPE A 와 같은 공유 데이터다', () => {
      const live = TYPE_B_MATRIX_CELLS.filter(
        (cell) => cell.category === 'live',
      );
      expect(live).toHaveLength(LIVE_SEMINAR_CELLS.length);
      live.forEach((cell, i) => expect(cell).toBe(LIVE_SEMINAR_CELLS[i]));
    });
  });

  describe('헤더 카피', () => {
    it('섹션 헤더는 배지·제목·설명을 갖는다', () => {
      expect(COURSE_PLAN_HEADER.badge.length).toBeGreaterThan(0);
      expect(COURSE_PLAN_HEADER.titleLines.length).toBeGreaterThan(0);
      expect(COURSE_PLAN_HEADER.subLines.length).toBeGreaterThan(0);
    });

    it('섹션 헤더의 강조 어절이 제목 안에 실제로 존재한다', () => {
      const title = COURSE_PLAN_HEADER.titleLines.join(' ');
      for (const word of COURSE_PLAN_HEADER.titleHighlights) {
        expect(title).toContain(word);
      }
    });

    it('본문 도입부와 매트릭스 캡션 문구가 비어 있지 않다', () => {
      expect(COURSE_PLAN_BODY.titleLines.length).toBeGreaterThan(0);
      expect(COURSE_PLAN_BODY.sub.length).toBeGreaterThan(0);
      expect(COURSE_PLAN_BODY.matrixTitle.a.length).toBeGreaterThan(0);
      expect(COURSE_PLAN_BODY.matrixTitle.b.length).toBeGreaterThan(0);
      expect(COURSE_PLAN_BODY.matrixSub.length).toBeGreaterThan(0);
      expect(COURSE_PLAN_BODY.matrixFootnote.length).toBeGreaterThan(0);
    });

    it('매트릭스 위 문구는 유형마다 다르고, 뒤 문장은 두 유형이 같다', () => {
      expect(COURSE_PLAN_BODY.matrixTitle.a).not.toBe(
        COURSE_PLAN_BODY.matrixTitle.b,
      );
      // 뒤 문장은 유형별로 두지 않고 한 벌만 둔다
      expect(COURSE_PLAN_BODY.matrixSub).toBe(
        '10주 동안 현직자 라이브 세미나 10회가 함께 열려요.',
      );
    });

    it('유형마다 매트릭스 위 문구가 있다', () => {
      for (const type of COURSE_PLAN_TYPES) {
        expect(COURSE_PLAN_BODY.matrixTitle[type.id].length).toBeGreaterThan(0);
      }
    });
  });

  describe('10주 흐름과 월 구분', () => {
    it('흐름 막대는 3개다', () => {
      expect(WEEK_FLOW.map((phase) => phase.id)).toEqual([
        'documents',
        'weapons',
        'apply',
      ]);
    });

    // 구간은 월이 아니라 주차로 정한다 — 11월 첫 주인 7주차가 초록(weapons)이다
    it.each([
      [1, 'documents'],
      [3, 'documents'],
      [4, 'weapons'],
      [7, 'weapons'],
      [8, 'apply'],
      [10, 'apply'],
    ])('%i주차의 구간은 %s 다', (week, phase) => {
      expect(weekPhase(week)).toBe(phase);
    });

    it.each([
      [2, '9월'],
      [3, '10월'],
      [6, '10월'],
      [7, '11월'],
    ])('%i주차의 월은 %s 이다', (week, month) => {
      expect(weekMonth(week)).toBe(month);
    });

    it('시작 전 행은 공유 라이브 세미나의 9.20 세미나다', () => {
      expect(PRESTART_SEMINAR).toBe(LIVE_SEMINAR_CELLS[0]);
      expect(PRESTART_SEMINAR.when).toBe('9.20 일 11:00');
      expect(PRESTART_SEMINAR.whenNote).toBe('시작 전');
    });
  });

  describe.each(['a'] as const)('주 단위 계획 TYPE %s', (type) => {
    const weeks = WEEK_PLANS[type];

    it('주차가 1~10 연속이다', () => {
      expect(weeks.map((plan) => plan.week)).toEqual([
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
      ]);
    });

    it('각 주의 할 일은 정확히 2줄이고 산출물이 비어 있지 않다', () => {
      for (const plan of weeks) {
        expect(plan.todos).toHaveLength(2);
        plan.todos.forEach((todo) => expect(todo.length).toBeGreaterThan(0));
        expect(plan.output.length).toBeGreaterThan(0);
      }
    });

    it('함께합니다 항목의 태그가 COURSE_TAG_LABEL 안에 있다', () => {
      for (const plan of weeks) {
        for (const support of plan.supports) {
          expect(Object.keys(COURSE_TAG_LABEL)).toContain(support.tag);
        }
      }
    });

    // 일시·제목·연사를 따로 적으면 일정이 바뀔 때 매트릭스와 따로 논다
    it('라이브 세미나 항목은 공유 데이터의 1~9번 세미나를 차례로 가리킨다', () => {
      const live = weeks.flatMap((plan) =>
        plan.supports.filter((support) => support.tag === 'live'),
      );
      expect(live).toEqual(
        LIVE_SEMINAR_CELLS.slice(1).map((cell) => ({
          tag: 'live',
          title: cell.title,
          when: cell.when,
          speaker: cell.desc,
        })),
      );
    });
  });

  describe('13주 타임라인', () => {
    it('월 그룹은 3종(SEP/OCT/NOV)이며 액센트색을 갖는다', () => {
      expect(MONTH_GROUPS).toHaveLength(3);
      expect(MONTH_GROUPS.map((m) => m.month)).toEqual(['SEP', 'OCT', 'NOV']);
      for (const m of MONTH_GROUPS) {
        expect(m.accent).toMatch(/^#[0-9a-f]{6}$/i);
      }
    });

    it('카드는 12개이며 12주차가 13주까지 묶음으로 13주를 커버한다', () => {
      expect(WEEKS).toHaveLength(12);
      const last = WEEKS[WEEKS.length - 1];
      expect(last.week).toBe(12);
      expect(last.weekEnd).toBe(13);
    });

    it('주차가 1부터 빠짐없이 13까지 이어진다', () => {
      const covered = new Set<number>();
      for (const item of WEEKS) {
        const end = item.weekEnd ?? item.week;
        for (let w = item.week; w <= end; w += 1) {
          covered.add(w);
        }
      }
      expect([...covered].sort((a, b) => a - b)).toEqual([
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      ]);
    });

    it('모든 주차에 title 이 비어있지 않다', () => {
      for (const item of WEEKS) {
        expect(item.title.length).toBeGreaterThan(0);
      }
    });
  });

  describe('플레이북 화면 컷', () => {
    it('반입 이미지는 WebP 다', () => {
      // PRD 7-3: PNG·JPG 반입 금지.
      expect(PLAYBOOK_SHOT_SRC.endsWith('.webp')).toBe(true);
    });

    it('표시 폭 300px 의 @2x 크기다', () => {
      // 시안에서 매트릭스(1080px) 대비 27.65% 로 잰 값이다.
      // 이 비율이 깨지면 시안과 화면이 어긋난다.
      expect(PLAYBOOK_SHOT_SIZE.width).toBe(600);
      expect(PLAYBOOK_SHOT_SIZE.height).toBe(1070);
    });

    it('alt 는 이름표가 아니라 화면 내용을 옮긴 문장이다', () => {
      expect(PLAYBOOK_SHOT_ALT.length).toBeGreaterThan(30);
    });

    it('마무리 문구가 의도된 줄바꿈 단위로 나뉘어 있다', () => {
      expect(PLAYBOOK_CAPTION_LINES).toHaveLength(2);
      for (const line of PLAYBOOK_CAPTION_LINES) {
        expect(line.length).toBeGreaterThan(0);
      }
    });
  });
});
