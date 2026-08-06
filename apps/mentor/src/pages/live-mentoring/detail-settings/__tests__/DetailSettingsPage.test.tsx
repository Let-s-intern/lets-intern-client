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

describe('DetailSettingsPage — 상태 잠금', () => {
  // 상품 상태(APPROVED)가 아니라 "지금 열려 있는지"로 말해야 오해가 없다.
  it('오픈 중이면 오픈 중으로 알리고 종료하러 갈 링크를 준다', () => {
    status = 'APPROVED';
    openings = [{ status: 'OPEN' }];
    renderPage();

    const banner = screen.getByRole('status');
    expect(within(banner).getByText('오픈 중')).toBeInTheDocument();
    expect(
      within(banner).getByRole('link', { name: '오픈 현황 보기' }),
    ).toHaveAttribute('href', '/live-mentoring/open-status');
    // 노출 중에는 수정도, 상세 수정 시작도 불가하다.
    expect(
      screen.queryByRole('button', { name: '수정하기' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: '상세 수정하기' }),
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
      screen.getByRole('button', { name: '상세 수정하기' }),
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

  it('오픈 처리 중에도 잠그고, 상태를 그대로 알린다', () => {
    status = 'PENDING_REVIEW';
    renderPage();

    expect(
      within(screen.getByRole('status')).getByText('오픈 처리 중'),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: '수정하기' }),
    ).not.toBeInTheDocument();
  });

  it('초안이면 배너 없이 편집할 수 있다', () => {
    renderPage();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: '수정하기' })).toBeVisible();
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
