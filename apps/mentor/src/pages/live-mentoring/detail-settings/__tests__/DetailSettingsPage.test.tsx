import { ApiError } from '@letscareer/api';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type {
  LiveMentoringCategory,
  LiveMentoringSettings,
  LiveMentoringTemplate,
} from '@/api/live-mentoring/liveMentoringSchema';

const saveMock = vi.fn();
let templateData: LiveMentoringTemplate | undefined;
let templateError: unknown = null;

// 모듈을 통째로 갈아끼우지 않고 훅만 대체한다 — 404 판정(`isNotFound`)은 실제 구현을 그대로 쓴다.
vi.mock('@/utils/axios', () => ({ default: { get: vi.fn(), put: vi.fn() } }));
vi.mock('@/api/live-mentoring/liveMentoring', async (importOriginal) => ({
  ...(await importOriginal<
    typeof import('@/api/live-mentoring/liveMentoring')
  >()),
  useLiveMentoringTemplateQuery: () => ({
    data: templateData,
    isError: templateError !== null,
    error: templateError,
  }),
  // 미리보기 헤드라인에 쓸 닉네임만 참조한다.
  useLiveMentoringSettingsQuery: () => ({
    data: { nickname: '쥬디' } as unknown as LiveMentoringSettings,
  }),
  useUpdateLiveMentoringTemplateMutation: () => ({
    mutate: saveMock,
    isPending: false,
  }),
}));

// 이미지 업로드는 파일 API 를 타므로 편집 폼 테스트에서는 라벨만 남긴다.
vi.mock('../ui/ImageField', () => ({
  default: ({ label }: { label: string }) => <div>{label}</div>,
}));

import DetailSettingsPage from '../DetailSettingsPage';

/** 멘토 편집 대상 전체가 채워진 템플릿을 만든다. 기본은 편집 가능한 `DRAFT` 상품이다. */
const makeTemplate = (
  category: LiveMentoringCategory,
): LiveMentoringTemplate => {
  return {
    mentoring: {
      liveMentoringId: 1,
      title: '자기소개서 첨삭 멘토링',
      status: 'DRAFT',
      editable: true,
      category,
    },
    currentOpening: null,
    category,
    hero: { bullets: ['이력서, 자기소개서, 포트폴리오 피드백 및 첨삭'] },
    intro: {
      passedCount: 300,
      profileImage: null,
      affiliation: '렛츠커리어 | CEO',
      careerLines: ['(현) 렛츠커리어 대표 멘토'],
      oneLiner: '안녕하세요',
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

const renderPage = (
  category: LiveMentoringCategory = 'PERSONAL_STATEMENT',
  patch?: (template: LiveMentoringTemplate) => void,
) => {
  templateData = makeTemplate(category);
  patch?.(templateData);
  return render(
    <MemoryRouter>
      <DetailSettingsPage />
    </MemoryRouter>,
  );
};

/** 활성 개설 1건 — `mentoring.editable` 이 false 인 이유가 개설임을 나타낸다. */
const activeOpening: NonNullable<LiveMentoringTemplate['currentOpening']> = {
  openingId: 10,
  status: 'OPEN',
  durationPrices: [{ duration: 30, price: 35000 }],
  feedbackStartDate: '2026-08-01',
  feedbackEndDate: '2026-08-31',
};

/** 인터셉터가 재포장해 던지는 것과 같은 형태의 서버 오류. */
const apiError = (status: number, code: string) =>
  new ApiError({
    code,
    message: '오류',
    status,
    endpoint: '/mentor/live-mentoring/template',
    method: 'GET',
  });

/** 조회 실패 상태로 렌더한다 — 이때 템플릿 데이터는 없다. */
const renderError = (error: unknown) => {
  templateError = error;
  return render(
    <MemoryRouter>
      <DetailSettingsPage />
    </MemoryRouter>,
  );
};

afterEach(() => {
  saveMock.mockReset();
  templateData = undefined;
  templateError = null;
});

describe('DetailSettingsPage — 편집 영역', () => {
  it('시안 1~5 섹션을 모두 편집 폼으로 렌더한다', () => {
    renderPage();

    // 멘토 소개는 프로필·서버 소유라 편집 폼이 아니라 안내만 있다
    expect(screen.getByRole('heading', { name: '멘토 소개' })).toBeVisible();
    expect(screen.getByRole('link', { name: '프로필 페이지' })).toHaveAttribute(
      'href',
      '/profile',
    );
    expect(screen.queryByLabelText('합격시킨 인원 수')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '멘토링 유형' })).toBeVisible();
    expect(
      screen.getByRole('heading', { name: '취업 성공 전략' }),
    ).toBeVisible();
    expect(
      screen.getByRole('heading', { name: '이렇게 도와드려요 (영상)' }),
    ).toBeVisible();
    expect(screen.getByRole('heading', { name: '결과 사례' })).toBeVisible();
  });

  it('노출 토글을 끄면 미리보기에서 해당 섹션이 제외된다고 알린다', () => {
    renderPage();

    // 첫 번째 노출 토글 = 취업 성공 전략
    fireEvent.click(screen.getAllByRole('checkbox')[0]);

    expect(
      screen.getByText(/취업 성공 전략 섹션은 노출 안 함 상태입니다/),
    ).toBeInTheDocument();
  });

  it('기본은 읽기 모드 — 수정하기·오픈하러 가기만 보인다', () => {
    renderPage();

    expect(screen.getByRole('button', { name: '수정하기' })).toBeVisible();
    expect(screen.getByRole('link', { name: '오픈하러 가기' })).toHaveAttribute(
      'href',
      '/live-mentoring/open-settings',
    );
    expect(
      screen.queryByRole('button', { name: '저장하기' }),
    ).not.toBeInTheDocument();
  });

  it('수정하기를 누르면 저장하기·취소로 바뀌고, 저장 시 읽기 모드로 돌아온다', () => {
    renderPage();

    fireEvent.click(screen.getByRole('button', { name: '수정하기' }));
    expect(screen.getByRole('button', { name: '취소' })).toBeVisible();

    fireEvent.click(screen.getByRole('button', { name: '저장하기' }));
    expect(saveMock).toHaveBeenCalledTimes(1);
  });

  it('취소하면 읽기 모드로 돌아간다', () => {
    renderPage();

    fireEvent.click(screen.getByRole('button', { name: '수정하기' }));
    fireEvent.click(screen.getByRole('button', { name: '취소' }));
    expect(screen.getByRole('button', { name: '수정하기' })).toBeVisible();
  });
});

describe('DetailSettingsPage — 저장 직전 검증', () => {
  it('이미지·영상을 넣지 않으면 빈 문자열이 아니라 null 로 보낸다', () => {
    renderPage('PERSONAL_STATEMENT', (template) => {
      template.strategy.points[0].image = '';
      template.results.cases[0].beforeImage = '';
      template.video.videoUrl = '';
    });

    fireEvent.click(screen.getByRole('button', { name: '수정하기' }));
    fireEvent.click(screen.getByRole('button', { name: '저장하기' }));

    const payload = saveMock.mock.calls[0][0] as LiveMentoringTemplate;
    expect(payload.strategy.points[0].image).toBeNull();
    expect(payload.results.cases[0].beforeImage).toBeNull();
    expect(payload.video.videoUrl).toBeNull();
  });

  it('영상 URL 형식이 맞지 않으면 저장을 보내지 않고 허용 형식을 알린다', () => {
    renderPage('PERSONAL_STATEMENT', (template) => {
      template.video.videoUrl = 'https://www.youtube.com/watch?v=abc';
    });

    fireEvent.click(screen.getByRole('button', { name: '수정하기' }));
    fireEvent.click(screen.getByRole('button', { name: '저장하기' }));

    expect(saveMock).not.toHaveBeenCalled();
    expect(
      screen.getByText('영상 임베드 URL 형식이 올바르지 않습니다.'),
    ).toBeVisible();
  });

  it('필수 문자열이 공백이면 저장을 보내지 않고 어느 항목인지 알린다', () => {
    renderPage('PERSONAL_STATEMENT', (template) => {
      template.hero.bullets[0] = '   ';
    });

    fireEvent.click(screen.getByRole('button', { name: '수정하기' }));
    fireEvent.click(screen.getByRole('button', { name: '저장하기' }));

    expect(saveMock).not.toHaveBeenCalled();
    expect(screen.getByText('아직 채우지 않은 항목이 있습니다.')).toBeVisible();
    expect(screen.getByText(/히어로 · 소개 불릿 1번/)).toBeVisible();
  });
});

describe('DetailSettingsPage — 편집 잠금', () => {
  it('활성 개설이 있으면 오픈 중 배너를 노출하고 수정 버튼을 감춘다', () => {
    renderPage('PERSONAL_STATEMENT', (template) => {
      template.mentoring.status = 'APPROVED';
      template.mentoring.editable = false;
      template.currentOpening = activeOpening;
    });

    const banner = screen.getByRole('status');
    expect(within(banner).getByText('오픈 중')).toBeInTheDocument();
    expect(
      within(banner).getByText(/진행 중인 개설이 있어/),
    ).toBeInTheDocument();
    expect(
      within(banner).getByRole('link', { name: '오픈 설정으로 이동' }),
    ).toHaveAttribute('href', '/live-mentoring/open-settings');
    expect(
      screen.queryByRole('button', { name: '수정하기' }),
    ).not.toBeInTheDocument();
  });

  it('검토 중이면 검토 중 문구로 잠근다', () => {
    renderPage('PERSONAL_STATEMENT', (template) => {
      template.mentoring.status = 'PENDING_REVIEW';
      template.mentoring.editable = false;
    });

    const banner = screen.getByRole('status');
    expect(within(banner).getByText('검토 중')).toBeInTheDocument();
    expect(within(banner).getByText(/관리자 검토 중이라/)).toBeInTheDocument();
  });

  it('승인 완료면 승인 문구로 잠근다', () => {
    renderPage('PERSONAL_STATEMENT', (template) => {
      template.mentoring.status = 'APPROVED';
      template.mentoring.editable = false;
    });

    const banner = screen.getByRole('status');
    expect(within(banner).getByText('승인 완료')).toBeInTheDocument();
    expect(
      within(banner).getByText(/승인된 상세 페이지는 수정할 수 없습니다/),
    ).toBeInTheDocument();
  });

  it('비활성 상품이면 비활성 문구로 잠근다', () => {
    renderPage('PERSONAL_STATEMENT', (template) => {
      template.mentoring.status = 'INACTIVE';
      template.mentoring.editable = false;
    });

    const banner = screen.getByRole('status');
    expect(within(banner).getByText('비활성')).toBeInTheDocument();
    expect(within(banner).getByText(/비활성 상품이라/)).toBeInTheDocument();
  });

  it('editable 이면 배너를 렌더하지 않는다', () => {
    renderPage();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: '수정하기' })).toBeVisible();
  });
});

describe('DetailSettingsPage — 조회 실패 분기', () => {
  it('404 는 오류가 아니라 상품을 먼저 만들라는 안내와 오픈 설정 링크로 분기한다', () => {
    renderError(apiError(404, 'LIVE_MENTORING_NOT_FOUND'));

    expect(screen.getByText('아직 만들어진 상품이 없습니다.')).toBeVisible();
    expect(
      screen.getByText(/오픈 설정에서 제목·카테고리를 먼저 저장하면/),
    ).toBeVisible();
    expect(
      screen.getByRole('link', { name: '오픈 설정으로 이동' }),
    ).toHaveAttribute('href', '/live-mentoring/open-settings');
    // 어느 화면인지 알 수 있도록 제목은 남긴다
    expect(screen.getByText('상세 페이지 설정')).toBeVisible();
  });

  it('그 외 오류는 일반 오류 문구로 되돌린다', () => {
    renderError(apiError(500, 'INTERNAL_SERVER_ERROR'));

    expect(
      screen.getByText('상세 페이지를 불러오지 못했습니다.'),
    ).toBeVisible();
    expect(
      screen.queryByRole('link', { name: '오픈 설정으로 이동' }),
    ).not.toBeInTheDocument();
  });
});

describe('DetailSettingsPage — 미리보기', () => {
  it('공개 상세와 같은 헤드라인·섹션 문구를 보여준다', () => {
    renderPage();

    expect(
      screen.getByText('확실한 전략으로 300명을 합격시킨 쥬디 멘토가 함께해요'),
    ).toBeInTheDocument();
    expect(screen.getByText('💬 멘토님의 한마디')).toBeInTheDocument();
    expect(screen.getByText('✓ 경험 연결')).toBeInTheDocument();
  });

  it('파생 섹션은 편집 대상이 아님을 미리보기 하단에 안내한다', () => {
    renderPage();

    expect(
      screen.getByText(/오픈 설정과 운영 값에서 자동으로 채워집니다/),
    ).toBeInTheDocument();
  });
});
