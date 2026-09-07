import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type {
  LiveMentoringCategory,
  LiveMentoringDetailPage,
  LiveMentoringSettings,
} from '@/api/live-mentoring/liveMentoringSchema';

const saveMock = vi.fn();
const openMock = vi.fn();
const closeOpeningMock = vi.fn();
const refetchSettingsMock = vi.fn();
const startEditMock = vi.fn();
let openings: { status: 'OPEN' | 'CLOSED' }[] = [];
let templateData: LiveMentoringDetailPage | undefined;
let status: LiveMentoringSettings['status'] = 'DRAFT';
/*
 * 오픈 버튼 활성 조건(제목·타입·진행시간·상품 존재)을 테스트마다 갈아끼운다.
 * 기본은 비어 있다 — 미리보기 헤드라인만 보던 기존 테스트가 쓰던 모양 그대로다.
 */
let settingsExtra: Partial<LiveMentoringSettings> = {};

// 공개 페이지 미리보기 링크가 mentorId 를 필요로 한다.
vi.mock('@/api/user/user', () => ({
  useUserQuery: () => ({ data: { userId: 500 } }),
}));

vi.mock('@/api/live-mentoring/liveMentoring', () => ({
  useLiveMentoringTemplateQuery: () => ({ data: templateData }),
  // 미리보기 헤드라인에 쓸 닉네임만 참조한다.
  useLiveMentoringSettingsQuery: () => ({
    data: {
      nickname: '쥬디',
      status,
      ...settingsExtra,
    } as unknown as LiveMentoringSettings,
    refetch: refetchSettingsMock,
  }),
  useUpdateLiveMentoringTemplateMutation: () => ({
    mutate: saveMock,
    isPending: false,
  }),
  useLiveMentoringOpenStatusQuery: () => ({ data: openings }),
  // 하단 바의 오픈 버튼이 이 화면에도 생겼다(LC-3273).
  useCreateLiveMentoringOpeningMutation: () => ({
    mutate: openMock,
    isPending: false,
  }),
  useCloseLiveMentoringOpeningMutation: () => ({
    mutate: closeOpeningMock,
    isPending: false,
  }),
  useStartEditLiveMentoringMutation: () => ({
    mutate: startEditMock,
    isPending: false,
  }),
}));

// 이미지 업로드는 파일 API 를 타므로 편집 폼 테스트에서는 라벨만 남긴다.
/*
 * 유형 카드의 관련 태그는 서버가 관리하는 목록에서 고른다.
 * 태그 자체는 이 화면의 관심사가 아니라 두 개만 둔다.
 */
vi.mock('@/api/mentor-hash-tag/mentorHashTag', () => ({
  useMentorHashTagListQuery: () => ({
    data: [
      { id: 1, type: 'STRENGTH', title: '구성 점검' },
      { id: 2, type: 'STRENGTH', title: '역량 강조' },
    ],
  }),
}));

vi.mock('../ui/ImageField', () => ({
  default: ({ label }: { label: string }) => <div>{label}</div>,
}));

// 오픈 설정 스텝은 자기 테스트(OpenSettingsSection.test.tsx)가 따로 있다. 여기서는
// 상세 스텝을 보므로 첫 스텝은 스텁으로 세워 둔다.
vi.mock('../../open-settings/OpenSettingsSection', () => ({
  default: () => <div data-testid="open-settings-section" />,
}));

import LiveMentoringSettingsPage from '../LiveMentoringSettingsPage';

/** 멘토 편집 대상 전체가 채워진 템플릿을 만든다. */
const makeTemplate = (
  category: LiveMentoringCategory,
): LiveMentoringDetailPage => {
  return {
    category,
    mentoring: {
      liveMentoringId: 1,
      title: '자소서 실전 첨삭 멘토링',
      status,
      categories: [category],
    },
    hero: { bullets: ['이력서, 자기소개서, 포트폴리오 피드백 및 첨삭'] },
    intro: {
      passedCount: 300,
      nickname: '쥬디',
      profileImage: null,
      affiliation: '렛츠커리어 | CEO',
      careerLines: ['(현) 렛츠커리어 대표 멘토'],
      oneLiner: '안녕하세요',
      description: '렛츠커리어 | CEO',
    },
    mentoringTypes: {
      title: '이런 도움을 받을 수 있어요',
      subtitle: '고민에 맞는 유형을 골라보세요.',
      items: [
        {
          typeName: '자기소개서 피드백',
          title: '자기소개서를 다듬고 싶다면',
          description: '문항 의도에 맞게 점검해요.',
          tags: ['문항 분석', '표현 개선'],
        },
      ],
    },
    strategy: {
      visible: true,
      title: '취업 성공 전략',
      subtitle: '멘토링을 통해 다 알려드립니다.',
      points: [{ image: null, title: '핵심 키워드', description: '설명' }],
    },
    video: {
      visible: true,
      title: '이렇게 도와드려요',
      subtitle: '영상으로 미리 확인하세요!',
      videoUrl: 'https://www.youtube.com/embed/xyz',
      caption: '서류 완성도 UP!',
    },
    results: {
      visible: true,
      title: '함께 완성해요',
      subtitle: '결과 사례',
      cases: [
        {
          beforeImage: null,
          afterImage: null,
          beforeCaption: '추상적인 지원동기',
          afterCaption: '경험 연결',
        },
      ],
    },
    reviews: { visible: true, selectedReviewIds: [1, 2] },
  };
};

/** 스텝 이름(라벨 일부)으로 스텝을 연다. 접근성 이름은 "라벨 필수|선택" 형태다. */
const openTab = (name: string) =>
  fireEvent.click(screen.getByRole('tab', { name: new RegExp(name) }));

const renderAtOpenStep = (
  category: LiveMentoringCategory = 'PERSONAL_STATEMENT',
) => {
  templateData = makeTemplate(category);
  return render(
    <MemoryRouter>
      <LiveMentoringSettingsPage />
    </MemoryRouter>,
  );
};

/**
 * 첫 스텝은 오픈 설정이다(LC-3264). 이 파일의 테스트는 상세 스텝을 보므로
 * 렌더 직후 핵심 소개로 옮긴다. 스텝 줄 자체는 `renderAtOpenStep` 으로 본다.
 */
const renderPage = (category: LiveMentoringCategory = 'PERSONAL_STATEMENT') => {
  const result = renderAtOpenStep(category);
  openTab('핵심 소개');
  return result;
};

afterEach(() => {
  saveMock.mockReset();
  templateData = undefined;
  status = 'DRAFT';
  startEditMock.mockReset();
  openings = [];
  settingsExtra = {};
});

/** 히어로 탭에서 소개 문구를 하나 추가해 미저장 변경 상태를 만든다. */
const addHeroBullet = () => {
  const heroSection = screen
    .getByRole('heading', { name: '핵심 소개' })
    .closest('section');
  if (!heroSection) throw new Error('히어로 섹션을 찾을 수 없습니다');
  fireEvent.click(
    within(heroSection).getByRole('button', { name: '소개 문구 추가 +' }),
  );
};

describe('LiveMentoringSettingsPage — 탭', () => {
  it('7개 스텝을 렌더하고, 처음에는 오픈 설정이 열린다', () => {
    renderAtOpenStep();

    expect(screen.getAllByRole('tab')).toHaveLength(7);
    expect(screen.getByTestId('open-settings-section')).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: '핵심 소개' }),
    ).not.toBeInTheDocument();

    openTab('핵심 소개');
    expect(
      screen.queryByTestId('open-settings-section'),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '핵심 소개' })).toBeVisible();
    // 다른 탭의 섹션은 렌더되지 않는다
    expect(
      screen.queryByRole('heading', { name: '멘토링 유형' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: '결과 사례' }),
    ).not.toBeInTheDocument();
  });

  /*
   * 필수·선택 칩은 탭 줄에 있다. 번호 배지만 섹션 카드 헤더(`DetailSectionHeader`)에 남는다.
   */
  it('두 화면을 합친 제목과 부제를 보여준다', () => {
    renderAtOpenStep();

    expect(
      screen.getByRole('heading', { name: '1대1 라이브 멘토링 설정' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/오픈 설정에서 타이틀·타입·진행시간과 일정을 정하고/),
    ).toBeInTheDocument();
  });

  it('스텝 7개에 라벨과 (필수)·(선택) 표시가 함께 보인다', () => {
    renderAtOpenStep();

    // 번호 배지는 탭에 붙지 않는다 — 카드 헤더에만 있다.
    // 표시는 배지가 아니라 웹 신청 시트와 같은 괄호 텍스트다.
    expect(screen.getAllByRole('tab').map((tab) => tab.textContent)).toEqual([
      '오픈 설정(필수)',
      '핵심 소개(필수)',
      '멘토 정보(필수)',
      '멘토링 유형(필수)',
      '취업 성공 전략(선택)',
      '소개 영상(선택)',
      '결과 사례(선택)',
    ]);
  });

  /**
   * 완료 여부는 체크 아이콘이 `aria-hidden` 이라 탭 이름이 대신 전한다.
   * 필수 여부는 칩이 글자로 보이므로 칩을 `aria-hidden` 으로 두고 이름에만 한 번 남긴다.
   */
  it('필수 여부와 완료 여부를 탭 이름으로 전하되 중복해 읽히지 않는다', () => {
    renderPage();

    expect(
      screen.getAllByRole('tab').map((tab) => tab.getAttribute('aria-label')),
    ).toEqual(
      expect.arrayContaining([
        expect.stringContaining('핵심 소개 필수'),
        expect.stringContaining('멘토 정보 필수'),
        expect.stringContaining('멘토링 유형 필수'),
        expect.stringContaining('취업 성공 전략 선택'),
        expect.stringContaining('소개 영상 선택'),
        expect.stringContaining('결과 사례 선택'),
      ]),
    );
    // 칩이 `aria-hidden` 이라 접근성 이름에 '필수'/'선택'이 두 번 들어가지 않는다.
    for (const tab of screen.getAllByRole('tab')) {
      const label = tab.getAttribute('aria-label') ?? '';
      expect(label.match(/필수|선택/g)).toHaveLength(1);
    }
  });

  /** 섹션 카드 헤더(`DetailSectionHeader`) 영역. 번호 배지가 리스트 순번과 겹치지 않게 좁힌다. */
  const cardHeaderOf = (name: string) => {
    const header = screen
      .getByRole('heading', { name })
      .closest('header') as HTMLElement | null;
    if (!header) throw new Error(`${name} 카드 헤더를 찾을 수 없습니다`);
    return header;
  };

  it('섹션 카드 헤더에 번호 배지와 시안의 큰 제목이 있고 칩은 없다', () => {
    renderPage();

    const hero = cardHeaderOf('핵심 소개');
    expect(within(hero).getByText('1')).toBeVisible();
    // 필수 칩은 탭 줄로 옮겼다.
    expect(within(hero).queryByText('필수')).not.toBeInTheDocument();
    expect(screen.getByText('이 멘토링을 간단히 소개해 주세요')).toBeVisible();
  });

  it('선택 섹션 카드 헤더에는 노출 토글이 있고 선택 칩은 없다', () => {
    renderPage();
    openTab('소개 영상');

    const video = cardHeaderOf('소개 영상');
    expect(within(video).getByText('5')).toBeVisible();
    expect(within(video).queryByText('선택')).not.toBeInTheDocument();
    expect(within(video).getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByText('멘토링 소개 영상을 등록해 주세요')).toBeVisible();
  });

  it('탭을 클릭하면 그 탭의 섹션만 보인다', () => {
    renderPage();

    openTab('멘토링 유형');
    expect(screen.getByRole('heading', { name: '멘토링 유형' })).toBeVisible();
    expect(
      screen.queryByRole('heading', { name: '핵심 소개' }),
    ).not.toBeInTheDocument();

    openTab('소개 영상');
    expect(screen.getByRole('heading', { name: '소개 영상' })).toBeVisible();
    expect(
      screen.queryByRole('heading', { name: '멘토링 유형' }),
    ).not.toBeInTheDocument();
  });

  it('필수 항목이 채워지면 완료 표시가 붙고, 비우면 사라진다', () => {
    renderPage();

    expect(
      screen.getByRole('tab', { name: '핵심 소개 필수 완료' }),
    ).toBeInTheDocument();

    const heroSection = screen
      .getByRole('heading', { name: '핵심 소개' })
      .closest('section');
    if (!heroSection) throw new Error('히어로 섹션을 찾을 수 없습니다');
    fireEvent.change(within(heroSection).getAllByRole('textbox')[0], {
      target: { value: '   ' },
    });

    expect(
      screen.queryByRole('tab', { name: '핵심 소개 필수 완료' }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('tab', { name: '핵심 소개 필수' }),
    ).toBeInTheDocument();
  });

  it('선택 탭은 내용이 있을 때만 완료 표시가 붙는다', () => {
    renderPage();

    // 목 템플릿에는 영상 링크가 있고, 결과 사례 설명도 채워져 있다.
    expect(
      screen.getByRole('tab', { name: '소개 영상 선택 완료' }),
    ).toBeInTheDocument();

    openTab('소개 영상');
    fireEvent.change(screen.getByLabelText('YouTube 영상 링크'), {
      target: { value: '' },
    });

    expect(
      screen.queryByRole('tab', { name: '소개 영상 선택 완료' }),
    ).not.toBeInTheDocument();
  });

  it('탭을 옮겼다 돌아와도 입력한 값은 남는다', () => {
    renderPage();

    const heroSection = screen
      .getByRole('heading', { name: '핵심 소개' })
      .closest('section');
    if (!heroSection) throw new Error('히어로 섹션을 찾을 수 없습니다');
    fireEvent.change(within(heroSection).getAllByRole('textbox')[0], {
      target: { value: '바꾼 소개 문구' },
    });

    openTab('결과 사례');
    openTab('핵심 소개');

    expect(screen.getByDisplayValue('바꾼 소개 문구')).toBeInTheDocument();
  });

  it('멘토 정보 탭은 프로필 값을 읽기 전용으로 보여준다', () => {
    renderPage();

    openTab('멘토 정보');

    // 미리보기에도 같은 값이 나오므로 편집 카드 안으로 범위를 좁힌다.
    const section = screen
      .getByRole('heading', { name: '멘토 정보' })
      .closest('section') as HTMLElement;

    expect(
      within(section).getByText('상세 페이지에 표시될 프로필을 확인해 주세요'),
    ).toBeVisible();
    // 서버 intro 응답이 그대로 표시된다
    expect(within(section).getByText('쥬디')).toBeVisible();
    expect(within(section).getByText('렛츠커리어 | CEO')).toBeVisible();
    expect(
      within(section).getByText('(현) 렛츠커리어 대표 멘토'),
    ).toBeVisible();
    expect(within(section).getByText('멘토님의 한마디')).toBeVisible();
    expect(within(section).getByText('안녕하세요')).toBeVisible();
  });

  it('멘토 정보 탭에는 편집 가능한 입력이 없고 프로필 수정하기로만 나간다', () => {
    renderPage();

    openTab('멘토 정보');

    const section = screen
      .getByRole('heading', { name: '멘토 정보' })
      .closest('section') as HTMLElement;
    expect(within(section).queryByRole('textbox')).not.toBeInTheDocument();
    expect(within(section).queryByRole('checkbox')).not.toBeInTheDocument();
    expect(
      within(section).getByRole('link', { name: '프로필 수정하기' }),
    ).toHaveAttribute('href', '/profile');
    expect(screen.queryByLabelText('합격시킨 인원 수')).not.toBeInTheDocument();
  });
});

describe('LiveMentoringSettingsPage — 편집 영역', () => {
  it('노출 토글을 끄면 미리보기에서 해당 섹션이 제외된다고 알린다', () => {
    renderPage();

    openTab('취업 성공 전략');
    fireEvent.click(screen.getAllByRole('checkbox')[0]);

    expect(
      screen.getByText(/취업 성공 전략 섹션은 노출 안 함 상태입니다/),
    ).toBeInTheDocument();
  });

  it('초안이면 수정하기 없이 바로 편집할 수 있고, 손댄 게 없으면 저장 바가 저장됨 상태다', () => {
    renderPage();

    expect(
      screen.queryByRole('button', { name: '수정하기' }),
    ).not.toBeInTheDocument();
    expect(screen.getByText('저장된 상태예요.')).toBeVisible();
    expect(screen.getByRole('button', { name: '저장' })).toBeDisabled();
  });

  it('값을 바꾸면 미저장 상태가 되고, 저장하면 다시 저장됨으로 돌아간다', () => {
    renderPage();
    addHeroBullet();

    expect(screen.getByText('저장하지 않은 변경사항이 있어요.')).toBeVisible();
    expect(screen.getByRole('button', { name: '저장' })).toBeEnabled();

    fireEvent.click(screen.getByRole('button', { name: '저장' }));
    expect(saveMock).toHaveBeenCalledTimes(1);
  });

  it('히어로 불릿에 빈 칸을 추가하고 안 채운 채 저장하면, 빈 칸을 걸러내고 보낸다', () => {
    // 회귀 케이스: 서버가 hero.bullets 각 항목에 공백을 막아(@NotBlank) 그대로
    // 보내면 "[hero.bullets[1]] 공백일 수 없습니다 (BAD_REQUEST)" 로 저장 전체가 실패했다.
    renderPage();

    // "+ 추가" 버튼은 유형 카드·Point·Before/After 리스트에도 있어 히어로 섹션
    // 안으로 범위를 좁혀야 한다.
    const heroSection = screen
      .getByRole('heading', { name: '핵심 소개' })
      .closest('section');
    if (!heroSection) throw new Error('히어로 섹션을 찾을 수 없습니다');
    fireEvent.click(
      within(heroSection).getByRole('button', { name: '소개 문구 추가 +' }),
    );

    fireEvent.click(screen.getByRole('button', { name: '저장' }));

    expect(saveMock).toHaveBeenCalledTimes(1);
    const [payload] = saveMock.mock.calls[0];
    expect(payload.hero.bullets).toEqual([
      '이력서, 자기소개서, 포트폴리오 피드백 및 첨삭',
    ]);
  });

  it('빈 결과 사례를 추가하고 안 채운 채 저장하면, 그 사례를 걸러내고 보낸다', () => {
    /*
     * 회귀 케이스: ResultCaseRequest 의 beforeCaption·afterCaption 이 @NotBlank 라
     * 빈 사례가 하나라도 있으면 저장 전체가 400 이다. 유형 카드와 같은 함정이다.
     */
    renderPage();

    openTab('결과 사례');
    const before = screen.getAllByLabelText(/멘토링 전 설명$/).length;
    fireEvent.click(screen.getByRole('button', { name: '변화 사례 추가 +' }));
    expect(screen.getAllByLabelText(/멘토링 전 설명$/)).toHaveLength(
      before + 1,
    );

    fireEvent.click(screen.getByRole('button', { name: '저장' }));

    expect(saveMock).toHaveBeenCalledTimes(1);
    const [payload] = saveMock.mock.calls[0];
    expect(payload.results.cases).toHaveLength(before);
    expect(
      payload.results.cases.every(
        (item: { beforeCaption: string; afterCaption: string }) =>
          item.beforeCaption && item.afterCaption,
      ),
    ).toBe(true);
  });

  it('영상 네 필드가 서버 필드에 맞게 담긴다', () => {
    renderPage();

    openTab('소개 영상');
    fireEvent.change(screen.getByLabelText('영상 제목'), {
      target: { value: '멘토는 이렇게' },
    });
    fireEvent.change(screen.getByLabelText('영상 설명'), {
      target: { value: '영상 설명입니다' },
    });
    fireEvent.change(screen.getByLabelText('영상 아래 안내 문구'), {
      target: { value: '안내 문구입니다' },
    });

    fireEvent.click(screen.getByRole('button', { name: '저장' }));

    const [payload] = saveMock.mock.calls[0];
    expect(payload.video.title).toBe('멘토는 이렇게');
    expect(payload.video.subtitle).toBe('영상 설명입니다');
    expect(payload.video.caption).toBe('안내 문구입니다');
  });

  it('빈 유형 카드를 추가하고 안 채운 채 저장하면, 그 카드를 걸러내고 보낸다', () => {
    /*
     * 회귀 케이스: TypeCardRequest 의 typeName·title·description 이 모두 @NotBlank 라
     * 빈 카드가 하나라도 있으면 "[mentoringTypes.items[3].title] 공백일 수 없습니다
     * (BAD_REQUEST)" 로 저장 전체가 실패했다. 실제 화면에서 재현된 문제다.
     */
    renderPage();

    openTab('멘토링 유형');
    const before = screen.getAllByLabelText(/번 카드 유형 제목$/).length;
    fireEvent.click(screen.getByRole('button', { name: '소개 카드 추가 +' }));
    expect(screen.getAllByLabelText(/번 카드 유형 제목$/)).toHaveLength(
      before + 1,
    );

    fireEvent.click(screen.getByRole('button', { name: '저장' }));

    expect(saveMock).toHaveBeenCalledTimes(1);
    const [payload] = saveMock.mock.calls[0];
    expect(payload.mentoringTypes.items).toHaveLength(before);
    expect(
      payload.mentoringTypes.items.every(
        (item: { typeName: string; title: string; description: string }) =>
          item.typeName && item.title && item.description,
      ),
    ).toBe(true);
  });

  it('저장 payload 에는 서버 요청 DTO에 없는 intro 를 담지 않는다', () => {
    // 멘토 정보는 프로필 도메인 소유라 이 요청으로 저장되지 않는다.
    renderPage();

    const heroSection = screen
      .getByRole('heading', { name: '핵심 소개' })
      .closest('section');
    if (!heroSection) throw new Error('히어로 섹션을 찾을 수 없습니다');
    fireEvent.click(
      within(heroSection).getByRole('button', { name: '소개 문구 추가 +' }),
    );
    fireEvent.click(screen.getByRole('button', { name: '저장' }));

    const [payload] = saveMock.mock.calls[0];
    expect(payload).not.toHaveProperty('intro');
    expect(Object.keys(payload).sort()).toEqual([
      'hero',
      'mentoringTypes',
      'results',
      'reviews',
      'strategy',
      'video',
    ]);
  });
});

/*
 * 미리보기는 전체를 그리고 스크롤하는 방식이 아니라, 지금 편집 중인 섹션 하나만 그린다.
 * "이 섹션이 멘티에게 어떻게 보이는지" 를 보여주는 것이 목적이라 다른 섹션은 방해가 된다.
 */
describe('LiveMentoringSettingsPage — 미리보기는 활성 탭 섹션만 그린다', () => {
  it('탭을 옮기면 그 섹션만 남고 다른 섹션은 사라진다', () => {
    renderPage();

    // 핵심 소개 탭 — 히어로가 보이고 멘토 소개 섹션 문구는 없다
    expect(screen.queryByText('멘토님의 한마디')).not.toBeInTheDocument();

    openTab('멘토 정보');
    expect(screen.getByText('멘토님의 한마디')).toBeInTheDocument();

    openTab('멘토링 유형');
    expect(screen.queryByText('멘토님의 한마디')).not.toBeInTheDocument();
  });
});

describe('LiveMentoringSettingsPage — 이탈 경고', () => {
  it('저장하지 않은 변경이 있으면 앱 내 링크로 이동할 때 경고 모달을 띄운다', () => {
    renderPage();

    const heroSection = screen
      .getByRole('heading', { name: '핵심 소개' })
      .closest('section');
    if (!heroSection) throw new Error('히어로 섹션을 찾을 수 없습니다');
    fireEvent.click(
      within(heroSection).getByRole('button', { name: '소개 문구 추가 +' }),
    );

    // 앱 내부 링크는 멘토 정보 탭의 "프로필 수정하기" 를 쓴다.
    openTab('멘토 정보');
    fireEvent.click(screen.getByRole('link', { name: '프로필 수정하기' }));

    expect(
      screen.getByText('변경사항이 저장되지 않았습니다'),
    ).toBeInTheDocument();
  });

  it('변경사항이 없으면 링크 이동 시 경고 없이 바로 이동한다', () => {
    renderPage();

    openTab('멘토 정보');
    fireEvent.click(screen.getByRole('link', { name: '프로필 수정하기' }));

    expect(
      screen.queryByText('변경사항이 저장되지 않았습니다'),
    ).not.toBeInTheDocument();
  });
});

/*
  승인 잠금이 사라졌다(LC-3262). 오픈 중이어도 상세 페이지는 그대로 고칠 수 있어야
  한다 — 예전에 잠금을 못박던 자리에 그 반대를 둔다.
*/
describe('LiveMentoringSettingsPage — 오픈 중에도 편집할 수 있다', () => {
  const renderWhileOpen = () => {
    status = 'APPROVED';
    openings = [{ status: 'OPEN' }];
    renderPage();
  };

  it('오픈 중에도 입력 필드가 활성이다', () => {
    renderWhileOpen();

    const heroSection = screen
      .getByRole('heading', { name: '핵심 소개' })
      .closest('section');
    if (!heroSection) throw new Error('히어로 섹션을 찾을 수 없습니다');
    expect(within(heroSection).getAllByRole('textbox')[0]).toBeEnabled();
    expect(
      within(heroSection).getByRole('button', { name: '소개 문구 추가 +' }),
    ).toBeEnabled();
  });

  it('오픈 중에도 저장 바에 저장 버튼이 있다', () => {
    renderWhileOpen();

    expect(screen.getByRole('button', { name: '저장' })).toBeVisible();
    // "수정" 으로 잠금을 푸는 단계는 사라졌다.
    expect(
      screen.queryByRole('button', { name: '수정' }),
    ).not.toBeInTheDocument();
  });

  it('오픈 중에도 탭 이동은 동작한다', () => {
    renderWhileOpen();

    expect(screen.getByRole('tab', { name: /결과 사례/ })).toBeEnabled();
    openTab('결과 사례');

    expect(screen.getByRole('heading', { name: '결과 사례' })).toBeVisible();
  });

  it('오픈 중에도 미리보기는 살아 있다', () => {
    renderWhileOpen();

    // 미리보기는 활성 탭 섹션만 그리므로 멘토 정보 탭으로 옮겨 확인한다.
    openTab('멘토 정보');
    expect(screen.getByText('멘토님의 한마디')).toBeInTheDocument();
  });

  it('편집할 수 있으면 입력이 활성이다', () => {
    renderPage();

    const heroSection = screen
      .getByRole('heading', { name: '핵심 소개' })
      .closest('section');
    if (!heroSection) throw new Error('히어로 섹션을 찾을 수 없습니다');
    expect(within(heroSection).getAllByRole('textbox')[0]).toBeEnabled();
  });
});

describe('LiveMentoringSettingsPage — 미리보기', () => {
  /** 미리보기는 활성 탭 섹션만 그리므로 문구도 그 탭에서 확인한다. */
  it('공개 상세와 같은 헤드라인·섹션 문구를 보여준다', () => {
    renderPage();

    openTab('멘토 정보');
    expect(
      screen.getByText('확실한 전략으로 300명을 합격시킨 쥬디 멘토가 함께해요'),
    ).toBeInTheDocument();
    expect(screen.getByText('멘토님의 한마디')).toBeInTheDocument();

    // `✓ 경험 연결` 은 결과 사례의 afterCaption 이다. 멘토링 유형이 아니다.
    openTab('결과 사례');
    expect(screen.getByText('✓ 경험 연결')).toBeInTheDocument();
  });

  it('파생 섹션은 편집 대상이 아님을 미리보기 하단에 안내한다', () => {
    renderPage();

    expect(
      screen.getByText(/오픈 설정과 운영 값에서 자동으로 채워집니다/),
    ).toBeInTheDocument();
  });
});

/*
 * LC-3273 — 하단 바는 모든 스텝에서 같다.
 *
 * 오픈 설정과 상세 페이지 설정이 한 화면이 된 뒤로(LC-3264) 하단 바만 두 벌로 남아
 * 있었다. 상세 스텝에서도 저장과 오픈 두 개만 보여야 한다.
 */
describe('LiveMentoringSettingsPage — 하단 바', () => {
  const 갖춰진_설정: Partial<LiveMentoringSettings> = {
    title: '자기소개서 첨삭',
    categories: ['PERSONAL_STATEMENT'],
    durations: [30],
    liveMentoringId: 7,
  } as Partial<LiveMentoringSettings>;

  it('상세 스텝에도 저장과 오픈 버튼이 있다', () => {
    renderPage();

    expect(screen.getByRole('button', { name: '저장' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '오픈하기' }),
    ).toBeInTheDocument();
  });

  it('되돌리기와 상세 페이지 보기는 하단 바에 없다', () => {
    renderPage();

    expect(
      screen.queryByRole('button', { name: '변경사항 되돌리기' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: '멘토링 상세 페이지 보기' }),
    ).not.toBeInTheDocument();
  });

  it('제목·타입·진행시간이 덜 찼으면 오픈 버튼이 비활성이다', () => {
    renderPage();

    expect(screen.getByRole('button', { name: '오픈하기' })).toBeDisabled();
  });

  it('설정이 갖춰지면 오픈 버튼이 활성이다', () => {
    settingsExtra = 갖춰진_설정;
    renderPage();

    expect(screen.getByRole('button', { name: '오픈하기' })).toBeEnabled();
  });

  it('상품이 아직 없으면 오픈할 수 없다', () => {
    // `POST /openings` 는 기존 상품을 찾아 개설한다 — 저장을 한 번 거쳐야 한다.
    settingsExtra = { ...갖춰진_설정, liveMentoringId: null };
    renderPage();

    expect(screen.getByRole('button', { name: '오픈하기' })).toBeDisabled();
  });

  it('오픈 중이면 오픈 닫기로 바뀐다', () => {
    status = 'APPROVED';
    openings = [{ status: 'OPEN' }];
    settingsExtra = 갖춰진_설정;
    renderPage();

    expect(
      screen.getByRole('button', { name: '오픈 닫기' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: '오픈하기' }),
    ).not.toBeInTheDocument();
  });

  it('열었다 닫은 적이 있으면 다시 오픈하기로 바뀐다', () => {
    status = 'APPROVED';
    openings = [{ status: 'CLOSED' }];
    settingsExtra = 갖춰진_설정;
    renderPage();

    expect(
      screen.getByRole('button', { name: '다시 오픈하기' }),
    ).toBeInTheDocument();
  });
});
