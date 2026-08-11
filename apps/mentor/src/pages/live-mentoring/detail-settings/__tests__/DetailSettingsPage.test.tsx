import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type {
  LiveMentoringCategory,
  LiveMentoringSettings,
  LiveMentoringTemplate,
} from '@/api/live-mentoring/liveMentoringSchema';

const saveMock = vi.fn();
const startEditMock = vi.fn();
let openings: { status: 'OPEN' | 'CLOSED' }[] = [];
let templateData: LiveMentoringTemplate | undefined;
let status: LiveMentoringSettings['status'] = 'DRAFT';

// 공개 페이지 미리보기 링크가 mentorId 를 필요로 한다.
vi.mock('@/api/user/user', () => ({
  useUserQuery: () => ({ data: { userId: 500 } }),
}));

vi.mock('@/api/live-mentoring/liveMentoring', () => ({
  useLiveMentoringTemplateQuery: () => ({ data: templateData }),
  // 미리보기 헤드라인에 쓸 닉네임만 참조한다.
  useLiveMentoringSettingsQuery: () => ({
    data: { nickname: '쥬디', status } as unknown as LiveMentoringSettings,
  }),
  useUpdateLiveMentoringTemplateMutation: () => ({
    mutate: saveMock,
    isPending: false,
  }),
  useLiveMentoringOpenStatusQuery: () => ({ data: openings }),
  useStartEditLiveMentoringMutation: () => ({
    mutate: startEditMock,
    isPending: false,
  }),
}));

// 이미지 업로드는 파일 API 를 타므로 편집 폼 테스트에서는 라벨만 남긴다.
vi.mock('../ui/ImageField', () => ({
  default: ({ label }: { label: string }) => <div>{label}</div>,
}));

import DetailSettingsPage from '../DetailSettingsPage';

/** 멘토 편집 대상 전체가 채워진 템플릿을 만든다. */
const makeTemplate = (
  category: LiveMentoringCategory,
): LiveMentoringTemplate => {
  return {
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

const renderPage = (category: LiveMentoringCategory = 'PERSONAL_STATEMENT') => {
  templateData = makeTemplate(category);
  return render(
    <MemoryRouter>
      <DetailSettingsPage />
    </MemoryRouter>,
  );
};

afterEach(() => {
  saveMock.mockReset();
  templateData = undefined;
  status = 'DRAFT';
  startEditMock.mockReset();
  openings = [];
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

  it('초안이면 수정하기 없이 바로 편집할 수 있고, 손댄 게 없으면 저장하기는 비활성이다', () => {
    renderPage();

    expect(
      screen.queryByRole('button', { name: '수정하기' }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: '저장하기' })).toBeDisabled();
    expect(screen.getByRole('link', { name: '오픈하러 가기' })).toHaveAttribute(
      'href',
      '/live-mentoring/open-settings',
    );
    expect(
      screen.queryByRole('button', { name: '수정 취소' }),
    ).not.toBeInTheDocument();
  });

  it('값을 바꾸면 저장하기가 활성화되고, 저장하면 다시 비활성화된다', () => {
    renderPage();

    const heroSection = screen
      .getByRole('heading', { name: '히어로 (최상단)' })
      .closest('section');
    if (!heroSection) throw new Error('히어로 섹션을 찾을 수 없습니다');
    fireEvent.click(within(heroSection).getByRole('button', { name: '+ 추가' }));

    expect(screen.getByRole('button', { name: '저장하기' })).toBeEnabled();
    expect(screen.getByRole('button', { name: '수정 취소' })).toBeVisible();

    fireEvent.click(screen.getByRole('button', { name: '저장하기' }));
    expect(saveMock).toHaveBeenCalledTimes(1);
  });

  it('수정 취소하면 변경사항을 되돌리고 버튼이 사라진다', () => {
    renderPage();

    const heroSection = screen
      .getByRole('heading', { name: '히어로 (최상단)' })
      .closest('section');
    if (!heroSection) throw new Error('히어로 섹션을 찾을 수 없습니다');
    fireEvent.click(within(heroSection).getByRole('button', { name: '+ 추가' }));

    fireEvent.click(screen.getByRole('button', { name: '수정 취소' }));

    expect(screen.getByRole('button', { name: '저장하기' })).toBeDisabled();
    expect(
      screen.queryByRole('button', { name: '수정 취소' }),
    ).not.toBeInTheDocument();
  });

  it('히어로 불릿에 빈 칸을 추가하고 안 채운 채 저장하면, 빈 칸을 걸러내고 보낸다', () => {
    // 회귀 케이스: 서버가 hero.bullets 각 항목에 공백을 막아(@NotBlank) 그대로
    // 보내면 "[hero.bullets[1]] 공백일 수 없습니다 (BAD_REQUEST)" 로 저장 전체가 실패했다.
    renderPage();

    // "+ 추가" 버튼은 유형 카드·Point·Before/After 리스트에도 있어 히어로 섹션
    // 안으로 범위를 좁혀야 한다.
    const heroSection = screen
      .getByRole('heading', { name: '히어로 (최상단)' })
      .closest('section');
    if (!heroSection) throw new Error('히어로 섹션을 찾을 수 없습니다');
    fireEvent.click(within(heroSection).getByRole('button', { name: '+ 추가' }));

    fireEvent.click(screen.getByRole('button', { name: '저장하기' }));

    expect(saveMock).toHaveBeenCalledTimes(1);
    const [payload] = saveMock.mock.calls[0];
    expect(payload.hero.bullets).toEqual([
      '이력서, 자기소개서, 포트폴리오 피드백 및 첨삭',
    ]);
  });
});

describe('DetailSettingsPage — 미리보기 자동 스크롤', () => {
  it('편집 폼에서 섹션에 포커스하면 미리보기가 해당 섹션으로 스크롤한다', () => {
    const scrollIntoViewMock = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoViewMock;
    renderPage();

    fireEvent.focus(screen.getByLabelText('섹션 제목'));

    expect(scrollIntoViewMock).toHaveBeenCalled();
  });
});

describe('DetailSettingsPage — 이탈 경고', () => {
  it('저장하지 않은 변경이 있으면 앱 내 링크로 이동할 때 경고 모달을 띄운다', () => {
    renderPage();

    const heroSection = screen
      .getByRole('heading', { name: '히어로 (최상단)' })
      .closest('section');
    if (!heroSection) throw new Error('히어로 섹션을 찾을 수 없습니다');
    fireEvent.click(within(heroSection).getByRole('button', { name: '+ 추가' }));

    fireEvent.click(screen.getByRole('link', { name: '프로필 페이지' }));

    expect(
      screen.getByText('변경사항이 저장되지 않았습니다'),
    ).toBeInTheDocument();
  });

  it('변경사항이 없으면 링크 이동 시 경고 없이 바로 이동한다', () => {
    renderPage();

    fireEvent.click(screen.getByRole('link', { name: '프로필 페이지' }));

    expect(
      screen.queryByText('변경사항이 저장되지 않았습니다'),
    ).not.toBeInTheDocument();
  });
});

describe('DetailSettingsPage — 상태 잠금', () => {
  // 상품 상태(APPROVED)가 아니라 "지금 열려 있는지"로 말해야 오해가 없다.
  it('오픈 중이면 오픈 중으로 알리고 오픈 설정으로 갈 링크를 준다', () => {
    // 오픈 현황 화면이 폐지되면서, 종료는 오픈 설정 화면 상단에서 한다.
    status = 'APPROVED';
    openings = [{ status: 'OPEN' }];
    renderPage();

    const banner = screen.getByRole('status');
    expect(within(banner).getByText('오픈 중')).toBeInTheDocument();
    expect(
      within(banner).getByRole('link', { name: '오픈 설정으로' }),
    ).toHaveAttribute('href', '/live-mentoring/open-settings');
    // 노출 중에는 수정도, 상세 수정 시작도 불가하다.
    expect(
      screen.queryByRole('button', { name: '수정하기' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: '수정' }),
    ).not.toBeInTheDocument();
  });

  it('오픈이 닫혀 있으면 이 화면에서 바로 상세 수정을 시작할 수 있다', () => {
    status = 'APPROVED';
    openings = [{ status: 'CLOSED' }];
    renderPage();

    const banner = screen.getByRole('status');
    expect(within(banner).getByText('오픈 종료됨')).toBeInTheDocument();
    // 글로만 다른 화면으로 보내지 않고 여기서 누를 수 있어야 한다.
    expect(
      screen.getByRole('button', { name: '수정' }),
    ).toBeInTheDocument();
  });

  it('잠긴 상태에서는 없는 수정하기 버튼을 안내하지 않는다', () => {
    status = 'APPROVED';
    openings = [{ status: 'CLOSED' }];
    renderPage();

    expect(
      screen.queryByText(/고치려면 수정하기를 눌러주세요/),
    ).not.toBeInTheDocument();
  });

  it('초안이면 배너 없이 편집할 수 있다', () => {
    renderPage();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: '저장하기' })).toBeVisible();
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
