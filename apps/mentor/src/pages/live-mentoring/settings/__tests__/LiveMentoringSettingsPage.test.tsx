import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type {
  LiveMentoringCategory,
  LiveMentoringDetailPage,
  LiveMentoringSettings,
} from '@/api/live-mentoring/liveMentoringSchema';

/*
 * 미리보기 iframe 이 띄우는 웹 오리진. 테스트 환경에는 VITE_WEB_URL 이 없으므로 고정한다 —
 * 오리진 검사가 이 값 기준으로 도므로 프로덕션과 같은 조건이 된다.
 */
const WEB_ORIGIN = 'http://localhost:3000';
vi.stubEnv('VITE_WEB_URL', WEB_ORIGIN);

const saveMock = vi.fn().mockResolvedValue(undefined);
const openMock = vi.fn();
const closeOpeningMock = vi.fn();
const refetchSettingsMock = vi.fn();
const startEditMock = vi.fn();
let openings: { openingId: number; status: 'OPEN' | 'CLOSED' }[] = [];
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
  // 페이지가 저장 완료를 기다린다(오픈 직전 자동 저장). mutate 가 아니라 mutateAsync 다.
  useUpdateLiveMentoringTemplateMutation: () => ({
    mutateAsync: saveMock,
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
  saveMock.mockReset().mockResolvedValue(undefined);
  templateData = undefined;
  status = 'DRAFT';
  startEditMock.mockReset();
  openMock.mockReset();
  closeOpeningMock.mockReset();
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
      screen.getByRole('heading', { name: '1:1 LIVE 멘토링 설정' }),
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
  /*
    노출 여부는 미리보기(iframe)에서 그 섹션이 사라지는 것으로 확인된다(LC-3268).
    여기서는 토글이 값을 실제로 뒤집는지만 본다.
  */
  it('노출 토글을 끄면 그 섹션 입력이 잠긴다', () => {
    renderPage();

    openTab('취업 성공 전략');
    const toggle = screen.getAllByRole('checkbox')[0];
    expect(toggle).toBeChecked();
    expect(screen.getByLabelText(/^섹션 제목/)).toBeEnabled();

    fireEvent.click(toggle);

    expect(toggle).not.toBeChecked();
    // 흐리게만 두면 만질 수 있다. fieldset 으로 잠가 탭 순서에서도 빠진다.
    expect(screen.getByLabelText(/^섹션 제목/)).toBeDisabled();
    // 다시 켤 수 있어야 하므로 스위치 자신은 잠기지 않는다.
    expect(toggle).toBeEnabled();
  });

  it('초안이면 수정하기 없이 바로 편집할 수 있고, 손댄 게 없으면 저장 바가 저장됨 상태다', () => {
    renderPage();

    expect(
      screen.queryByRole('button', { name: '수정하기' }),
    ).not.toBeInTheDocument();
    expect(screen.getByText('저장된 상태예요.')).toBeVisible();
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
    openings = [{ openingId: 100, status: 'OPEN' }];
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

  it('오픈 중에도 편집이 열려 있고 저장 바가 상태를 알린다', () => {
    renderWhileOpen();

    expect(screen.getByText('저장된 상태예요.')).toBeVisible();
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

/*
 * LC-3268 — 미리보기는 공개 페이지를 iframe 으로 띄운다.
 *
 * 예전에는 공개 상세의 마크업을 멘토 앱에 복제해 그렸다. 웹이 바뀔 때마다 따라 고쳐야
 * 했고 실제로 어긋난 채 방치됐다. 지금은 편집 중인 템플릿만 postMessage 로 보낸다.
 */
describe('LiveMentoringSettingsPage — 미리보기', () => {
  const previewFrame = () =>
    screen.getByTitle('상세 페이지 미리 보기') as HTMLIFrameElement;

  /** 웹 미리보기 라우트가 보내는 "받을 준비 됐다" 신호를 흉내낸다. */
  const signalFrameReady = () =>
    fireEvent(
      window,
      new MessageEvent('message', {
        data: { type: 'letscareer:live-mentoring-preview:ready' },
        origin: WEB_ORIGIN,
      }),
    );

  it('공개 상세의 미리보기 주소를 띄운다', () => {
    renderPage();

    expect(previewFrame()).toHaveAttribute(
      'src',
      `${WEB_ORIGIN}/live-mentoring/preview/500`,
    );
  });

  it('받을 준비가 되면 편집 중인 템플릿과 열린 탭을 보낸다', () => {
    renderPage();
    const post = vi.fn();
    Object.defineProperty(previewFrame(), 'contentWindow', {
      value: { postMessage: post },
      configurable: true,
    });

    signalFrameReady();

    expect(post).toHaveBeenCalled();
    const [message, origin] = post.mock.calls[post.mock.calls.length - 1];
    expect(origin).toBe(WEB_ORIGIN);
    expect(message.type).toBe('letscareer:live-mentoring-preview');
    expect(message.activeTab).toBe('hero');
    // 저장 전 값이 그대로 실린다 — 미리보기가 저장을 기다리지 않는 이유다.
    expect(message.template.intro.nickname).toBe('쥬디');
  });

  /*
    유형 카드가 서너 개로 늘면 섹션까지만 따라가서는 몇 번째를 쓰는지 알 수 없다.
    포커스가 들어간 카드 번호를 함께 보내, 미리보기가 그 카드를 화면 가운데 둔다.
  */
  it('편집 중인 카드 번호를 함께 보낸다', () => {
    renderPage();
    const post = vi.fn();
    Object.defineProperty(previewFrame(), 'contentWindow', {
      value: { postMessage: post },
      configurable: true,
    });
    signalFrameReady();

    openTab('멘토링 유형');
    // 탭을 막 열었을 때는 어느 카드도 고르지 않은 상태다.
    expect(
      post.mock.calls[post.mock.calls.length - 1][0].activeItem,
    ).toBeNull();

    const firstCard = document.querySelector('[data-preview-index="0"]');
    const input = firstCard?.querySelector('input, textarea');
    if (!input) throw new Error('첫 카드의 입력을 찾을 수 없습니다');
    fireEvent.focusIn(input);

    const [message] = post.mock.calls[post.mock.calls.length - 1];
    expect(message.activeItem).toBe(0);
  });

  /*
    회귀 케이스 — 결과 사례는 전·후가 **각자 번호를 갖는다.**

    사례 하나에 번호를 하나만 주면 미리보기는 카드 전체를 화면 가운데 맞추는데, 이미지
    두 장이 들어간 카드는 미리보기 화면보다 커서 그 가운데가 보인다. 맨 아래인
    「멘토링 후 변화」는 몇 번을 고쳐도 화면 밖에 남아, 고쳐도 안 따라오는 것처럼 보였다.
  */
  it('결과 사례는 멘토링 전과 후에 서로 다른 번호를 보낸다', () => {
    renderPage();
    const post = vi.fn();
    Object.defineProperty(previewFrame(), 'contentWindow', {
      value: { postMessage: post },
      configurable: true,
    });
    signalFrameReady();

    openTab('결과 사례');

    fireEvent.focusIn(screen.getByLabelText('1번 사례 멘토링 전 상황'));
    expect(post.mock.calls[post.mock.calls.length - 1][0].activeItem).toBe(0);

    fireEvent.focusIn(screen.getByLabelText('1번 사례 멘토링 후 변화'));
    expect(post.mock.calls[post.mock.calls.length - 1][0].activeItem).toBe(1);
  });

  it('탭을 옮기면 그 탭을 함께 보낸다', () => {
    renderPage();
    const post = vi.fn();
    Object.defineProperty(previewFrame(), 'contentWindow', {
      value: { postMessage: post },
      configurable: true,
    });
    signalFrameReady();

    openTab('결과 사례');

    const [message] = post.mock.calls[post.mock.calls.length - 1];
    expect(message.activeTab).toBe('results');
  });
});

/*
 * LC-3282 · LC-3283 — 하단 바는 스텝 이동, 공개는 머리의 토글.
 *
 * 저장 버튼이 사라지고 입력이 멎으면 알아서 나간다. 오픈은 스텝과 무관한 화면 전체의
 * 상태라 머리로 옮겼다. 하단 바에는 스텝 이동과 "저장이 지금 어디까지 갔는지"만 남는다.
 */
/*
 * 작성 예시는 섹션 아래 **하나**다. 입력 그룹마다 접이식 상자를 두면 같은 화면에 같은
 * 모양이 여러 개 쌓여, 어느 것이 무엇의 예시인지 오히려 헷갈린다.
 */
describe('LiveMentoringSettingsPage — 작성 예시', () => {
  it('멘토링 유형 스텝의 안내는 하나이고, 두 입력 그룹을 나눠 보여준다', () => {
    renderPage();
    openTab('멘토링 유형');

    expect(
      screen.getAllByRole('button', { name: /작성 예시 보기/ }),
    ).toHaveLength(1);

    const guide = screen
      .getByRole('button', { name: /작성 예시 보기/ })
      .closest('div');
    if (!guide) throw new Error('작성 예시를 찾을 수 없습니다');
    expect(within(guide).getByText('유형 안내 문구')).toBeVisible();
    expect(within(guide).getByText('멘토링 소개 카드')).toBeVisible();
  });

  /* 예시의 라벨이 입력 칸 이름과 다르면 어느 칸을 말하는지 다시 짚어봐야 한다. */
  it('예시 라벨이 입력 칸 이름과 같다', () => {
    renderPage();
    openTab('멘토링 유형');

    for (const name of ['멘토링 유형 섹션 제목', '멘토링 유형 설명']) {
      // 입력 칸 라벨 1개 + 예시 줄 1개
      expect(
        screen.getAllByText(new RegExp(`^${name}`)).length,
      ).toBeGreaterThan(1);
    }
  });
});

describe('LiveMentoringSettingsPage — 하단 바', () => {
  it('저장 버튼 대신 스텝 이동 버튼이 있다', () => {
    renderPage();

    expect(
      screen.queryByRole('button', { name: '저장' }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '이전으로' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '다음으로' }),
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

  it('다음으로가 스텝 줄의 다음 탭을 연다', () => {
    renderPage();

    fireEvent.click(screen.getByRole('button', { name: '다음으로' }));

    expect(screen.getByRole('tab', { name: /멘토 정보/ })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('이전으로가 스텝 줄의 앞 탭을 연다', () => {
    renderPage();

    fireEvent.click(screen.getByRole('button', { name: '이전으로' }));

    expect(screen.getByRole('tab', { name: /오픈 설정/ })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  /* 첫 스텝에서는 갈 곳이 없다. 숨기지 않고 잠근다 — 자리가 바뀌면 어디를 눌러야 할지 흔들린다. */
  it('첫 스텝에서는 이전으로가 잠긴다', () => {
    renderAtOpenStep();

    expect(screen.getByRole('button', { name: '이전으로' })).toBeDisabled();
  });

  /*
    마지막 스텝에는 갈 다음 스텝이 없다. 잠긴 「다음으로」 대신 마지막에 할 일을 둔다.
  */
  it('마지막 스텝에서는 다음으로 자리에 공개하기가 온다', () => {
    renderPage();
    openTab('결과 사례');

    expect(
      screen.queryByRole('button', { name: '다음으로' }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '공개하기' }),
    ).toBeInTheDocument();
  });

  it('이미 공개 중이면 마지막 스텝 버튼이 공개 중으로 잠긴다', () => {
    status = 'APPROVED';
    openings = [{ openingId: 100, status: 'OPEN' }];
    settingsExtra = {
      title: '자기소개서 첨삭',
      categories: ['PERSONAL_STATEMENT'],
      durations: [30],
      liveMentoringId: 7,
    } as Partial<LiveMentoringSettings>;
    renderPage();
    openTab('결과 사례');

    expect(
      screen.getByRole('button', { name: '공개 중이에요' }),
    ).toBeDisabled();
  });
});

/*
 * LC-3282 — 실시간 저장.
 *
 * 서버 요청 DTO 가 `@NotBlank` 투성이라 반쯤 채운 카드가 있으면 저장 전체가 400 이다.
 * 타이핑 도중에 계속 나가는 저장이므로, 보내기 전에 막고 하단 바에 이유만 남긴다.
 */
describe('LiveMentoringSettingsPage — 실시간 저장', () => {
  const 입력이_멎기를_기다린다 = async () => {
    await act(async () => {
      vi.advanceTimersByTime(2000);
    });
  };

  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('입력이 멎으면 저장한다', async () => {
    renderPage();
    addHeroBullet();

    expect(screen.getByText('입력을 멈추면 자동으로 저장돼요.')).toBeVisible();
    await 입력이_멎기를_기다린다();

    expect(saveMock).toHaveBeenCalledTimes(1);
    expect(screen.getByText('저장된 상태예요.')).toBeVisible();
  });

  /*
    「+ 추가」로 만든 빈 카드를 걸러내서 보내면 서버는 받지만, 이제 쓰려는 카드를
    저장이 지워 버린다. 채우거나 지울 때까지 보내지 않는다.
  */
  it('빈 유형 카드가 있으면 보내지 않고 무엇을 채우면 되는지 적는다', async () => {
    renderPage();
    openTab('멘토링 유형');
    fireEvent.click(screen.getByRole('button', { name: '소개 카드 추가 +' }));

    await 입력이_멎기를_기다린다();

    expect(saveMock).not.toHaveBeenCalled();
    expect(
      screen.getByText(
        '저장 대기 · 「멘토링 유형」의 2번 유형 이름을 채우면 저장돼요',
      ),
    ).toBeVisible();
  });

  /*
    빈 결과 사례도 같다. `beforeCaption`·`afterCaption` 이 `@NotBlank` 라 걸러내지 않으면
    400 이지만, 걸러내면 방금 만든 사례가 사라진다.
  */
  it('빈 결과 사례가 있으면 보내지 않는다', async () => {
    renderPage();
    openTab('결과 사례');
    fireEvent.click(screen.getByRole('button', { name: '사례 추가 +' }));

    await 입력이_멎기를_기다린다();

    expect(saveMock).not.toHaveBeenCalled();
    expect(
      screen.getByText(
        '저장 대기 · 「결과 사례」의 2번 멘토링 전 상황을 채우면 저장돼요',
      ),
    ).toBeVisible();
  });

  /*
    히어로의 빈 줄은 막지 않고 걸러서 보낸다. 카드와 달리 지울 의사와 채울 의사를
    구분할 방법이 없고, 줄 하나는 지워져도 다시 만들기 쉽다.
  */
  it('히어로의 빈 줄은 걸러내고 보낸다', async () => {
    renderPage();
    addHeroBullet();

    await 입력이_멎기를_기다린다();

    const [payload] = saveMock.mock.calls[0];
    expect(payload.hero.bullets).toEqual([
      '이력서, 자기소개서, 포트폴리오 피드백 및 첨삭',
    ]);
  });

  it('영상 네 필드가 서버 필드에 맞게 담긴다', async () => {
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

    await 입력이_멎기를_기다린다();

    const [payload] = saveMock.mock.calls[0];
    expect(payload.video.title).toBe('멘토는 이렇게');
    expect(payload.video.subtitle).toBe('영상 설명입니다');
    expect(payload.video.caption).toBe('안내 문구입니다');
  });

  it('저장 payload 에는 서버 요청 DTO에 없는 intro 를 담지 않는다', async () => {
    // 멘토 정보는 프로필 도메인 소유라 이 요청으로 저장되지 않는다.
    renderPage();
    addHeroBullet();

    await 입력이_멎기를_기다린다();

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

  /* 서버 문구를 그대로 띄우면 `[mentoringTypes.title] 공백일 수 없습니다` 가 된다. */
  it('저장이 실패하면 화면에 적힌 칸 이름으로 알린다', async () => {
    saveMock.mockRejectedValueOnce({
      code: 'BAD_REQUEST',
      message: '[hero.bullets[0]] 공백일 수 없습니다',
    });
    renderPage();
    addHeroBullet();

    await 입력이_멎기를_기다린다();

    expect(
      screen.getByText('저장 실패 · 핵심 소개의 1번 소개 문구를 채워 주세요.'),
    ).toBeVisible();
  });
});

/*
 * LC-3283 — 머리의 공개/비공개 토글과 상세 페이지 바로가기.
 *
 * 오픈은 스텝과 무관한 화면 전체의 상태다. 하단 바에 두면 스텝을 옮길 때마다 같은
 * 버튼을 다시 찾게 되고, 스텝 이동 버튼과 자리를 다툰다.
 */
describe('LiveMentoringSettingsPage — 공개 토글', () => {
  const 갖춰진_설정: Partial<LiveMentoringSettings> = {
    title: '자기소개서 첨삭',
    categories: ['PERSONAL_STATEMENT'],
    durations: [30],
    liveMentoringId: 7,
  } as Partial<LiveMentoringSettings>;

  const 공개토글 = () =>
    screen.getByRole('switch', { name: '상세 페이지 공개' });

  it('상세 페이지 바로가기와 공개 토글이 머리에 있다', () => {
    renderPage();

    expect(
      screen.getByRole('button', { name: '상세 페이지 바로가기' }),
    ).toBeInTheDocument();
    expect(공개토글()).toBeInTheDocument();
  });

  it('제목·타입·진행시간이 덜 찼으면 토글이 잠기고 이유를 적는다', () => {
    renderPage();

    expect(공개토글()).toBeDisabled();
    expect(
      screen.getByText('오픈 설정에서 타이틀을 정하면 공개할 수 있어요.'),
    ).toBeVisible();
  });

  it('설정이 갖춰지면 토글을 켤 수 있다', () => {
    settingsExtra = 갖춰진_설정;
    renderPage();

    expect(공개토글()).toBeEnabled();
    expect(공개토글()).toHaveAttribute('aria-checked', 'false');
  });

  it('상품이 아직 없으면 공개할 수 없다', () => {
    // `POST /openings` 는 기존 상품을 찾아 개설한다 — 저장을 한 번 거쳐야 한다.
    settingsExtra = { ...갖춰진_설정, liveMentoringId: null };
    renderPage();

    expect(공개토글()).toBeDisabled();
  });

  it('오픈 중이면 공개로 켜져 있다', () => {
    status = 'APPROVED';
    openings = [{ openingId: 100, status: 'OPEN' }];
    settingsExtra = 갖춰진_설정;
    renderPage();

    expect(공개토글()).toHaveAttribute('aria-checked', 'true');
    expect(
      screen.getByText('멘토링을 판매 중이에요. 멘티가 신청할 수 있어요.'),
    ).toBeVisible();
  });

  /*
    공개는 "지금 이 상세를 내보낸다" 는 행동이다. 실시간 저장이 아직 못 보낸 내용이
    남아 있으면 멘티가 옛 페이지를 보게 되므로, 먼저 보내고 연다.
  */
  it('아직 보내지 못한 변경이 있으면 공개 전에 먼저 저장한다', async () => {
    settingsExtra = 갖춰진_설정;
    renderPage();
    addHeroBullet();

    fireEvent.click(공개토글());
    const dialog = screen.getByRole('dialog', {
      name: '오픈 전 상세 페이지 확인',
    });
    fireEvent.click(within(dialog).getByRole('checkbox'));
    fireEvent.click(within(dialog).getByRole('button', { name: '오픈하기' }));

    await waitFor(() => expect(saveMock).toHaveBeenCalledTimes(1));
  });

  it('바뀐 게 없으면 공개할 때 저장하지 않는다', async () => {
    settingsExtra = 갖춰진_설정;
    renderPage();

    fireEvent.click(공개토글());
    const dialog = screen.getByRole('dialog', {
      name: '오픈 전 상세 페이지 확인',
    });
    fireEvent.click(within(dialog).getByRole('checkbox'));
    fireEvent.click(within(dialog).getByRole('button', { name: '오픈하기' }));

    await waitFor(() => expect(openMock).toHaveBeenCalled());
    expect(saveMock).not.toHaveBeenCalled();
  });
});

/*
 * LC-3283 — 공개/비공개를 실제로 실행하는 경로.
 *
 * 예전에는 오픈 설정 본문이 이 버튼을 들고 있어 그쪽 테스트에 있었다. 토글이 머리로
 * 옮겨오면서 훅도 이 화면이 하나만 부르므로, 요청과 확인 절차도 여기서 지킨다.
 */
describe('LiveMentoringSettingsPage — 공개/비공개 실행', () => {
  const 갖춰진_설정: Partial<LiveMentoringSettings> = {
    title: '자기소개서 첨삭',
    categories: ['PERSONAL_STATEMENT'],
    durations: [30, 60],
    liveMentoringId: 7,
  } as Partial<LiveMentoringSettings>;

  const 공개토글 = () =>
    screen.getByRole('switch', { name: '상세 페이지 공개' });

  const 확인모달 = () =>
    screen.getByRole('dialog', { name: '오픈 전 상세 페이지 확인' });

  it('제목·타입·진행시간을 한 요청에 담아 개설한다', async () => {
    settingsExtra = 갖춰진_설정;
    renderPage();

    fireEvent.click(공개토글());
    fireEvent.click(within(확인모달()).getByRole('checkbox'));
    fireEvent.click(
      within(확인모달()).getByRole('button', { name: '오픈하기' }),
    );

    await waitFor(() => expect(openMock).toHaveBeenCalledTimes(1));
    // 날짜는 담지 않는다 — 예약 가능 일정은 슬롯으로 따로 등록한다.
    expect(openMock.mock.calls[0][0]).toEqual({
      title: '자기소개서 첨삭',
      categories: ['PERSONAL_STATEMENT'],
      durations: [30, 60],
    });
  });

  // 오픈은 되돌리는 비용이 크고, 잘못 나간 상세는 멘티에게 그대로 보인다.
  it('확인 체크 전에는 진행 버튼이 열리지 않는다', () => {
    settingsExtra = 갖춰진_설정;
    renderPage();

    fireEvent.click(공개토글());

    expect(
      within(확인모달()).getByRole('button', { name: '오픈하기' }),
    ).toBeDisabled();
    // 확인할 주소를 바로 열 수 있어야 확인이 형식적이지 않다.
    expect(
      within(확인모달()).getByRole('link', { name: '상세 페이지 열어보기' }),
    ).toHaveAttribute('href', expect.stringContaining('/live-mentoring/500'));

    fireEvent.click(within(확인모달()).getByRole('checkbox'));
    expect(
      within(확인모달()).getByRole('button', { name: '오픈하기' }),
    ).toBeEnabled();
    expect(openMock).not.toHaveBeenCalled();
  });

  it('취소하면 아무것도 실행하지 않는다', () => {
    settingsExtra = 갖춰진_설정;
    renderPage();

    fireEvent.click(공개토글());
    fireEvent.click(within(확인모달()).getByRole('button', { name: '취소' }));

    expect(openMock).not.toHaveBeenCalled();
    expect(
      screen.queryByRole('dialog', { name: '오픈 전 상세 페이지 확인' }),
    ).not.toBeInTheDocument();
  });

  /*
    오픈했다는 사실만 알린다(LC-3280). 예전에는 "이상하면 바로 종료하세요" 안내 모달을
    띄웠는데, 방금 동의하고 누른 직후에 취소를 권하니 잘못된 줄 알고 멈추게 된다.
  */
  it('개설에 성공하면 안내 모달 없이 알림만 띄운다', async () => {
    openMock.mockImplementation((_body, options) =>
      options?.onSuccess?.({ liveMentoringId: 7, openings: [] }),
    );
    settingsExtra = 갖춰진_설정;
    renderPage();

    fireEvent.click(공개토글());
    fireEvent.click(within(확인모달()).getByRole('checkbox'));
    fireEvent.click(
      within(확인모달()).getByRole('button', { name: '오픈하기' }),
    );

    await waitFor(() =>
      expect(screen.getByText('오픈했어요.')).toBeInTheDocument(),
    );
    expect(screen.queryByRole('dialog', { name: '오픈 완료 안내' })).toBeNull();
    expect(closeOpeningMock).not.toHaveBeenCalled();
  });

  it('공개 중에 토글을 끄면 확인을 거쳐 오픈을 종료한다', () => {
    status = 'APPROVED';
    openings = [{ openingId: 100, status: 'OPEN' }];
    settingsExtra = 갖춰진_설정;
    renderPage();

    fireEvent.click(공개토글());
    // 되돌릴 수 없는 동작이라 확인 절차를 한 번 거친다.
    expect(screen.getByText('이 오픈을 종료할까요?')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '종료하기' }));
    expect(closeOpeningMock).toHaveBeenCalledTimes(1);
    expect(closeOpeningMock.mock.calls[0][0]).toBe(100);
  });

  /*
    슬롯이 챌린지 라이브 피드백과 공유되면서 종료는 더 이상 슬롯을 지우지 않는다.
    삭제 경고를 남겨 두면 멘토가 슬롯을 잃을까 봐 오픈을 못 닫는다.
  */
  it('종료 확인에 일정 삭제 경고가 없고 일정이 남는다고 알린다', () => {
    status = 'APPROVED';
    openings = [{ openingId: 100, status: 'OPEN' }];
    settingsExtra = 갖춰진_설정;
    renderPage();

    fireEvent.click(공개토글());

    expect(screen.queryByText(/일정이 모두 삭제/)).not.toBeInTheDocument();
    expect(screen.getByText(/등록한 일정은 그대로 남아요/)).toBeInTheDocument();
  });
});
