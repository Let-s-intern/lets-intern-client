import { fireEvent, render, waitFor } from '@testing-library/react';

const tryPostMagnetApplicationMock = jest.fn();
const tryPatchUserMock = jest.fn();

jest.mock('@/api/magnet/magnet', () => ({
  usePostMagnetApplicationMutation: () => ({
    mutateAsync: tryPostMagnetApplicationMock,
    isPending: false,
  }),
}));

jest.mock('@/api/user/user', () => ({
  useUserQuery: () => ({ data: undefined }),
  usePatchUser: () => ({
    mutateAsync: tryPatchUserMock,
    isPending: false,
  }),
}));

// 라우터 stub
jest.mock('next/navigation', () => ({
  useRouter: () => ({ back: jest.fn(), push: jest.fn(), refresh: jest.fn() }),
}));

// lucide-react 는 ESM 만 제공하므로 jest 환경에서 트랜스폼 오류가 발생.
// 본 테스트는 아이콘 렌더 검증이 목적이 아니므로 stub.
jest.mock('lucide-react', () => ({
  __esModule: true,
  ArrowLeft: () => null,
}));

// 무거운 폼/스타일 의존 컴포넌트는 본 테스트의 관심사 밖이므로 stub.
jest.mock('../ui/MarketingConsentSection', () => ({
  __esModule: true,
  default: ({
    onCheckedChange,
  }: {
    checked: boolean;
    onCheckedChange: (v: boolean) => void;
  }) => (
    <button
      type="button"
      data-testid="marketing-consent-stub"
      onClick={() => onCheckedChange(true)}
    >
      consent
    </button>
  ),
}));

// CareerInfoForm 은 isSubmitDisabled 를 false 로 만들 만큼의
// value/selections 가 차야 하므로, 마운트 시점에 onChange/onSelectionsChange 를
// 강제로 한 번 호출하여 valid 한 폼 상태를 만든다.
jest.mock('@/domain/mypage/career/CareerInfoForm', () => ({
  __esModule: true,
  default: ({
    onChange,
    onSelectionsChange,
  }: {
    onChange: (value: {
      university: string;
      grade: string;
      major: string;
      wishCompany: string;
      wishEmploymentType: string;
    }) => void;
    onSelectionsChange: (selections: {
      selectedField: string | null;
      selectedPositions: string[];
      selectedIndustries: string[];
    }) => void;
  }) => {
    // useEffect 와 동일한 1회 호출 패턴.
    const triggered = (globalThis as { __careerFormTriggered?: boolean })
      .__careerFormTriggered;
    if (!triggered) {
      (
        globalThis as { __careerFormTriggered?: boolean }
      ).__careerFormTriggered = true;
      Promise.resolve().then(() => {
        onChange({
          university: '서울대',
          grade: '4학년',
          major: '컴퓨터공학',
          wishCompany: '카카오',
          wishEmploymentType: 'FULL_TIME',
        });
        onSelectionsChange({
          selectedField: 'IT',
          selectedPositions: ['프론트엔드'],
          selectedIndustries: ['플랫폼'],
        });
      });
    }
    return null;
  },
}));

jest.mock('./MagnetApplyInfoCard', () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock('./MagnetSurveySection', () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock('./LaunchAlertProgramSection', () => ({
  __esModule: true,
  default: () => null,
}));

// EventExtraMagnetSection 은 외부에 useState 만 노출하면 충분.
// 테스트에서 직접 selectedMagnetIds 변경을 트리거할 수 있도록 buttons 노출.
jest.mock('./EventExtraMagnetSection', () => ({
  __esModule: true,
  default: ({
    selectedMagnetIds,
    onSelectedMagnetIdsChange,
  }: {
    selectedMagnetIds: number[];
    onSelectedMagnetIdsChange: (ids: number[]) => void;
  }) => (
    <div>
      <button
        type="button"
        data-testid="select-extra-101"
        onClick={() => onSelectedMagnetIdsChange([...selectedMagnetIds, 101])}
      >
        add-101
      </button>
      <button
        type="button"
        data-testid="select-extra-102"
        onClick={() => onSelectedMagnetIdsChange([...selectedMagnetIds, 102])}
      >
        add-102
      </button>
      <button
        type="button"
        data-testid="select-extra-103"
        onClick={() => onSelectedMagnetIdsChange([...selectedMagnetIds, 103])}
      >
        add-103
      </button>
    </div>
  ),
}));

const MagnetApplyContent = require('./MagnetApplyContent').default;

/**
 * isSubmitDisabled 가 false 가 되도록 내부 상태(value/selections/marketingAgree)를
 * 모두 채워야 클릭 핸들러가 동작한다. 본 테스트는 handleSubmit 자체의 동작
 * (메인 신청 + 추가 마그넷 N+1 신청 + alert) 을 검증하는 것이 목적이므로,
 * 컴포넌트 내부 isSubmitDisabled 가 disabled 를 풀지 않는 환경에서도
 * 호출 자체를 검증하기 위해 disabled 우회 클릭을 사용한다.
 */
const clickSubmit = async (
  container: HTMLElement,
  getByTestId: (id: string) => HTMLElement,
) => {
  // 1) marketing consent 동의
  fireEvent.click(getByTestId('marketing-consent-stub'));

  // 2) form 유효 + consent 가 모두 true 가 되어 disabled 가 풀릴 때까지 대기
  const findSubmit = () =>
    container.querySelector('button.bg-primary') as HTMLButtonElement | null;
  await waitFor(() => {
    const btn = findSubmit();
    if (!btn) throw new Error('submit button not found');
    if (btn.disabled) throw new Error('still disabled');
  });

  // 3) 신청하기 클릭
  const submitButton = findSubmit()!;
  fireEvent.click(submitButton);
};

describe('MagnetApplyContent — handleSubmit (EVENT 추가 마그넷 N+1 신청)', () => {
  let alertSpy: jest.SpyInstance;

  beforeEach(() => {
    tryPostMagnetApplicationMock.mockReset();
    tryPatchUserMock.mockReset();
    tryPatchUserMock.mockResolvedValue(undefined);
    alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    // CareerInfoForm 의 마운트-1회 트리거 플래그 리셋.
    (globalThis as { __careerFormTriggered?: boolean }).__careerFormTriggered =
      false;
  });

  afterEach(() => {
    alertSpy.mockRestore();
  });

  it('EVENT + 추가 마그넷 3개 선택 시 메인 1회 + 추가 3회 신청 호출', async () => {
    tryPostMagnetApplicationMock.mockResolvedValue({});

    const { container, getByTestId } = render(
      <MagnetApplyContent
        magnetId={1}
        magnetType="EVENT"
        title="EVENT 마그넷"
        thumbnail={null}
        questions={[]}
        variant="apply"
      />,
    );

    fireEvent.click(getByTestId('select-extra-101'));
    fireEvent.click(getByTestId('select-extra-102'));
    fireEvent.click(getByTestId('select-extra-103'));

    await clickSubmit(container, getByTestId);

    await waitFor(() => {
      expect(tryPostMagnetApplicationMock).toHaveBeenCalledTimes(4);
    });

    // 메인 신청
    expect(tryPostMagnetApplicationMock).toHaveBeenNthCalledWith(1, {
      magnetId: 1,
      body: { magnetAnswerList: [] },
    });
    // 추가 마그넷 신청 (빈 답변)
    const extraCalls = tryPostMagnetApplicationMock.mock.calls
      .slice(1)
      .map((args) => args[0]);
    expect(extraCalls).toEqual(
      expect.arrayContaining([
        { magnetId: 101, body: { magnetAnswerList: [] } },
        { magnetId: 102, body: { magnetAnswerList: [] } },
        { magnetId: 103, body: { magnetAnswerList: [] } },
      ]),
    );
  });

  it('추가 마그넷 일부 실패 시 alert 으로 실패 magnetId 안내 + 성공 alert 미표시 (Gemini 리뷰 #2 반영)', async () => {
    // 메인(1) 성공, 추가 101 성공, 102 실패, 103 실패
    tryPostMagnetApplicationMock.mockImplementation(
      ({ magnetId }: { magnetId: number }) => {
        if (magnetId === 102 || magnetId === 103) {
          return Promise.reject(new Error('boom'));
        }
        return Promise.resolve({});
      },
    );

    const { container, getByTestId } = render(
      <MagnetApplyContent
        magnetId={1}
        magnetType="EVENT"
        title="EVENT 마그넷"
        thumbnail={null}
        questions={[]}
        variant="apply"
      />,
    );

    fireEvent.click(getByTestId('select-extra-101'));
    fireEvent.click(getByTestId('select-extra-102'));
    fireEvent.click(getByTestId('select-extra-103'));

    await clickSubmit(container, getByTestId);

    await waitFor(() => {
      const failureCall = alertSpy.mock.calls.find((args) =>
        String(args[0]).includes('일부 자료집 신청에 실패'),
      );
      expect(failureCall).toBeDefined();
      expect(String(failureCall?.[0])).toContain('102');
      expect(String(failureCall?.[0])).toContain('103');
      expect(String(failureCall?.[0])).not.toContain('101');
    });

    // 일부 실패 시 "신청이 완료되었습니다." 는 표시되지 않아야 한다.
    const successCall = alertSpy.mock.calls.find((args) =>
      String(args[0]).includes('신청이 완료되었습니다'),
    );
    expect(successCall).toBeUndefined();
  });

  it('메인 EVENT 가 이미 신청(409)이어도 추가 마그넷 신청은 진행된다', async () => {
    // 메인(1) → 409, 추가 101/102 성공
    tryPostMagnetApplicationMock.mockImplementation(
      ({ magnetId }: { magnetId: number }) => {
        if (magnetId === 1) {
          return Promise.reject({
            response: { status: 409, data: { message: '이미 존재하는 신청 내역입니다.' } },
            status: 409,
          });
        }
        return Promise.resolve({});
      },
    );

    const { container, getByTestId } = render(
      <MagnetApplyContent
        magnetId={1}
        magnetType="EVENT"
        title="EVENT 마그넷"
        thumbnail={null}
        questions={[]}
        variant="apply"
      />,
    );

    fireEvent.click(getByTestId('select-extra-101'));
    fireEvent.click(getByTestId('select-extra-102'));

    await clickSubmit(container, getByTestId);

    // 메인 1회 시도 + 추가 101, 102 호출되었는지 확인
    await waitFor(() => {
      expect(tryPostMagnetApplicationMock).toHaveBeenCalledTimes(3);
    });
    const calls = tryPostMagnetApplicationMock.mock.calls.map((args) => args[0].magnetId);
    expect(calls).toContain(1);
    expect(calls).toContain(101);
    expect(calls).toContain(102);

    // alert 에 "이미 신청한 자료집이에요" 포함
    await waitFor(() => {
      const conflictCall = alertSpy.mock.calls.find((args) =>
        String(args[0]).includes('이미 신청한 자료집'),
      );
      expect(conflictCall).toBeDefined();
    });
  });

  it('EVENT 가 아니면 추가 마그넷 신청 로직이 실행되지 않는다', async () => {
    tryPostMagnetApplicationMock.mockResolvedValue({});

    const { container, getByTestId } = render(
      <MagnetApplyContent
        magnetId={1}
        magnetType="MATERIAL"
        title="MATERIAL 마그넷"
        thumbnail={null}
        questions={[]}
        variant="apply"
      />,
    );

    await clickSubmit(container, getByTestId);

    await waitFor(() => {
      expect(tryPostMagnetApplicationMock).toHaveBeenCalledTimes(1);
    });
    expect(tryPostMagnetApplicationMock).toHaveBeenCalledWith({
      magnetId: 1,
      body: { magnetAnswerList: [] },
    });
  });

  it('EVENT 이지만 추가 마그넷이 0개면 메인 신청만 호출', async () => {
    tryPostMagnetApplicationMock.mockResolvedValue({});

    const { container, getByTestId } = render(
      <MagnetApplyContent
        magnetId={1}
        magnetType="EVENT"
        title="EVENT 마그넷"
        thumbnail={null}
        questions={[]}
        variant="apply"
      />,
    );

    await clickSubmit(container, getByTestId);

    await waitFor(() => {
      expect(tryPostMagnetApplicationMock).toHaveBeenCalledTimes(1);
    });
  });
});
