import { CATEGORY_TEMPLATE_DEFAULTS } from '@letscareer/mocks';
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type {
  LiveMentoringCategory,
  LiveMentoringTemplate,
} from '@/api/live-mentoring/liveMentoringSchema';

const saveMock = vi.fn();
let templateData: LiveMentoringTemplate | undefined;

vi.mock('@/api/live-mentoring/liveMentoring', () => ({
  useLiveMentoringTemplateQuery: () => ({ data: templateData }),
  useUpdateLiveMentoringTemplateMutation: () => ({
    mutate: saveMock,
    isPending: false,
  }),
}));

import DetailSettingsPage from '../DetailSettingsPage';

/** 타입별 기본값(공유 목) + 편집분을 합쳐 완전한 템플릿을 만든다. */
const makeTemplate = (
  category: LiveMentoringCategory,
): LiveMentoringTemplate => {
  const base = CATEGORY_TEMPLATE_DEFAULTS[category];
  return {
    category,
    faq: base.faq,
    process: base.process,
    submissionSpec: base.submissionSpec,
    checklist: base.checklist,
    introduction: '안녕하세요',
    careers: [
      {
        company: '네이버',
        position: '기획',
        period: '2019-2026',
        visible: true,
      },
    ],
    mentoringPoints: '핵심 위주',
    reviews: { visible: true, selectedReviewIds: [1, 2] },
  };
};

const renderPage = (category: LiveMentoringCategory = 'PERSONAL_STATEMENT') => {
  templateData = makeTemplate(category);
  return render(<DetailSettingsPage />);
};

afterEach(() => {
  saveMock.mockReset();
  templateData = undefined;
});

describe('DetailSettingsPage — 편집 가능/불가 경계', () => {
  it('편집 가능 필드는 입력 요소로 렌더된다', () => {
    renderPage();
    expect(screen.getByLabelText('멘토 자기소개')).toBeInTheDocument();
    expect(screen.getByLabelText('멘토링 포인트')).toBeInTheDocument();
  });

  it('FAQ·피드백 과정·제출물 설정은 "편집 불가" 로 표시된다', () => {
    renderPage();
    expect(screen.getAllByText('편집 불가')).toHaveLength(3);
  });

  it('편집 불가 영역(FAQ)에는 편집용 입력 요소가 없다', () => {
    renderPage();
    // FAQ 질문 텍스트는 노출되지만 textbox 로 편집 불가
    const faqQuestion = CATEGORY_TEMPLATE_DEFAULTS.PERSONAL_STATEMENT.faq[0].q;
    expect(screen.getAllByText(`Q. ${faqQuestion}`).length).toBeGreaterThan(0);
    expect(
      screen.queryByDisplayValue(faqQuestion),
    ).not.toBeInTheDocument();
  });
});

describe('DetailSettingsPage — 체크리스트 3모드', () => {
  it('멘토 커스텀 선택 시 커스텀 문구 입력이 나타난다', () => {
    renderPage();
    const label = CATEGORY_TEMPLATE_DEFAULTS.PERSONAL_STATEMENT.checklist[0].label;

    const group = screen.getByRole('radiogroup', {
      name: `${label} 노출 모드`,
    });
    fireEvent.click(
      screen.getAllByRole('radio', { name: '멘토 커스텀' })[0],
    );

    expect(group).toBeInTheDocument();
    const customInput = screen.getByLabelText(`${label} 커스텀 문구`);
    fireEvent.change(customInput, { target: { value: '이력서 최신본' } });
    // 미리보기에 커스텀 문구 반영
    expect(screen.getByText(/이력서 최신본/)).toBeInTheDocument();
  });

  it('비노출 선택 시 미리보기 체크리스트에서 사라진다', () => {
    renderPage();
    const label = CATEGORY_TEMPLATE_DEFAULTS.PERSONAL_STATEMENT.checklist[0].label;

    // 편집폼 라벨(1) + 미리보기(1) 최소 노출 확인
    expect(screen.getAllByText(label).length).toBeGreaterThanOrEqual(1);

    fireEvent.click(screen.getAllByRole('radio', { name: '비노출' })[0]);

    // 첫 항목 라벨이 편집폼에만 남고 미리보기에서는 제거됨 → 총 1개
    expect(screen.getAllByText(label)).toHaveLength(1);
  });
});

describe('DetailSettingsPage — 타입에 따른 기본 템플릿 로드', () => {
  it('RESUME 템플릿은 이력서용 FAQ 를 로드한다', () => {
    renderPage('RESUME');
    const q = CATEGORY_TEMPLATE_DEFAULTS.RESUME.faq[0].q;
    expect(screen.getAllByText(`Q. ${q}`).length).toBeGreaterThan(0);
  });

  it('PORTFOLIO 템플릿은 포트폴리오용 FAQ 를 로드한다', () => {
    renderPage('PORTFOLIO');
    const q = CATEGORY_TEMPLATE_DEFAULTS.PORTFOLIO.faq[0].q;
    expect(screen.getAllByText(`Q. ${q}`).length).toBeGreaterThan(0);
    // 다른 타입의 FAQ 는 노출되지 않음
    const otherQ = CATEGORY_TEMPLATE_DEFAULTS.RESUME.faq[0].q;
    expect(screen.queryByText(`Q. ${otherQ}`)).not.toBeInTheDocument();
  });
});

describe('DetailSettingsPage — 저장', () => {
  it('편집한 자기소개를 담아 mutate 를 호출한다', () => {
    renderPage();
    fireEvent.change(screen.getByLabelText('멘토 자기소개'), {
      target: { value: '수정된 소개' },
    });
    fireEvent.click(screen.getByRole('button', { name: '저장' }));

    expect(saveMock).toHaveBeenCalledTimes(1);
    const payload = saveMock.mock.calls[0][0] as LiveMentoringTemplate;
    expect(payload.introduction).toBe('수정된 소개');
  });
});
