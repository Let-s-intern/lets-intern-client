import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { seedOneTimeFormApplications } from '@/mocks/seed/oneTimeForm';

import OneTimeFormApplicantsPage from './OneTimeFormApplicantsPage';

const applicationsQuery = vi.fn();
const navigate = vi.fn();

vi.mock('@/api/one-time-form/oneTimeFormQueries', () => ({
  useOneTimeFormApplicationsQuery: (formId: number) =>
    applicationsQuery(formId),
}));

vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-router-dom')>()),
  useNavigate: () => navigate,
}));

// 화면이 갈래를 나누는 네 경우(결제, 취소, 무료, 0원)를 한 목록에 모은다
const applications = seedOneTimeFormApplications.map(
  ({ formId: _formId, ...application }) => application,
);

const form = {
  formId: 7,
  title: '현직자와 함께하는 포트폴리오 집중 클래스',
  slug: 'portfolio-1115',
  isPaid: true,
};

const loaded = (rows = applications) => ({
  data: { form, questions: [], optionGroups: [], applications: rows },
  isLoading: false,
  isError: false,
});

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/one-time-form/7/applications']}>
      <Routes>
        <Route
          path="/one-time-form/:formId/applications"
          element={<OneTimeFormApplicantsPage />}
        />
      </Routes>
    </MemoryRouter>,
  );

const rowOf = (name: string) =>
  screen.getByText(name).closest('[role="row"]') as HTMLElement;

beforeEach(() => {
  navigate.mockReset();
  applicationsQuery.mockReset();
  applicationsQuery.mockReturnValue(loaded());
});

describe('OneTimeFormApplicantsPage', () => {
  it('URL 의 폼 ID 로 조회하고 폼 제목을 머리에 둔다', () => {
    renderPage();

    expect(applicationsQuery).toHaveBeenCalledWith(7);
    expect(
      screen.getByText('현직자와 함께하는 포트폴리오 집중 클래스 신청자'),
    ).toBeInTheDocument();
  });

  it('PRD 5절 열을 그린다', () => {
    renderPage();

    for (const header of [
      '신청일시',
      '계정',
      '이름',
      '이메일',
      '전화번호',
      '고른 옵션',
      '결제 금액',
      '상태',
      'utm_source',
      'utm_campaign',
    ]) {
      expect(
        screen.getByRole('columnheader', { name: header }),
      ).toBeInTheDocument();
    }
  });

  it('옵션을 여러 개 고른 신청은 이름을 모두 보여준다', () => {
    renderPage();

    const row = rowOf('김렛커');
    expect(
      within(row).getByText('온라인 라이브, 포트폴리오 1:1 첨삭'),
    ).toBeInTheDocument();
    expect(within(row).getByText('2026.11.02 13:24')).toBeInTheDocument();
    expect(within(row).getByText('58231')).toBeInTheDocument();
    expect(within(row).getByText('49,000원')).toBeInTheDocument();
    expect(within(row).getByText('결제 완료')).toBeInTheDocument();
    expect(within(row).getByText('instagram')).toBeInTheDocument();
    expect(within(row).getByText('portfolio_1115')).toBeInTheDocument();
  });

  it('취소한 신청은 환불 금액과 함께 취소로 표시하고 흐리게 둔다', () => {
    renderPage();

    const row = rowOf('박서현');
    expect(within(row).getByText('취소(환불 39,000원)')).toBeInTheDocument();
    expect(row).toHaveClass('text-neutral-40');
    expect(rowOf('김렛커')).not.toHaveClass('text-neutral-40');
  });

  it('무료 폼 신청은 결제 금액과 상태가 무료, 0원 결제는 0원이다', () => {
    renderPage();

    const free = rowOf('이유저');
    expect(within(free).getAllByText('무료')).toHaveLength(2);
    expect(within(free).getByText('없음')).toBeInTheDocument();

    const zero = rowOf('안한나');
    expect(within(zero).getByText('0원')).toBeInTheDocument();
    expect(within(zero).getByText('결제 완료')).toBeInTheDocument();
  });

  it('계정이 없으면 탈퇴로 표시한다', () => {
    applicationsQuery.mockReturnValue(
      loaded([{ ...applications[0], user: null }]),
    );
    renderPage();

    expect(within(rowOf('김렛커')).getByText('탈퇴')).toBeInTheDocument();
  });

  it('행을 누르면 신청 상세로 간다', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByText('박서현'));

    expect(navigate).toHaveBeenCalledWith('/one-time-form/7/applications/1043');
  });

  it('신청이 없으면 빈 목록 문구를 보여준다', () => {
    applicationsQuery.mockReturnValue(loaded([]));
    renderPage();

    expect(screen.getByText('아직 신청자가 없습니다.')).toBeInTheDocument();
  });

  it('조회에 실패하면 안내 문구를 보여준다', () => {
    applicationsQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });
    renderPage();

    expect(
      screen.getByText('신청자 목록을 불러오지 못했습니다.'),
    ).toBeInTheDocument();
  });
});
