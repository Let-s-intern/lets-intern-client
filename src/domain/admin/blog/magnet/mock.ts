// TODO: 각 함수별 API 준비 후 src/api/magnet/ 폴더로 이동하고 실제 API 호출로 교체
import {
  CommonFormData,
  CommonFormReqBody,
  MANAGEABLE_MAGNET_TYPES,
  MagnetFormData,
  MagnetFormReqBody,
  MagnetListItem,
  MagnetWithFormSummary,
} from './types';

const MOCK_MAGNETS: MagnetListItem[] = [
  {
    magnetId: 5,
    type: 'MATERIAL',
    title: 'HR 직무 자료집',
    startDate: '2026-01-15T00:00:00',
    endDate: '2026-06-30T23:59:59',
    isVisible: false,
    applicationCount: 9,
  },
  {
    magnetId: 4,
    type: 'VOD',
    title: '취준생이 모르면 안되는 AI 역량 VOD',
    startDate: '2026-01-10T00:00:00',
    endDate: '2026-07-31T23:59:59',
    isVisible: true,
    applicationCount: 99,
  },
  {
    magnetId: 3,
    type: 'FREE_TEMPLATE',
    title: '자유양식 이력서 템플릿',
    startDate: '2026-01-05T00:00:00',
    endDate: '2026-12-31T23:59:59',
    isVisible: true,
    applicationCount: 999,
  },
  {
    magnetId: 2,
    type: 'LAUNCH_ALERT',
    title: '리틀리 프로그램',
    startDate: null,
    endDate: null,
    isVisible: false,
    applicationCount: 0,
  },
  {
    magnetId: 1,
    type: 'EVENT',
    title: '리틀리 프로그램',
    startDate: null,
    endDate: null,
    isVisible: false,
    applicationCount: 0,
  },
];

// TODO: API 준비 후 React Query 훅으로 교체
export function fetchManageableMagnets(): MagnetListItem[] {
  return MOCK_MAGNETS.filter((m) =>
    MANAGEABLE_MAGNET_TYPES.includes(m.type),
  );
}

// --- 마그넷 신청폼 관리 ---

const MOCK_MAGNET_FORMS: Record<number, MagnetFormData> = {
  5: {
    magnetId: 5,
    questions: [
      {
        questionId: 'q1',
        questionType: 'SUBJECTIVE',
        isRequired: 'REQUIRED',
        question: '이름을 입력해주세요',
        description: '',
        selectionMethod: 'SINGLE',
        items: [],
      },
      {
        questionId: 'q2',
        questionType: 'OBJECTIVE',
        isRequired: 'REQUIRED',
        question: '관심 직무를 선택해주세요',
        description: '복수 선택이 가능합니다',
        selectionMethod: 'MULTIPLE',
        items: [
          { itemId: 'i1', value: '마케팅', isOther: false },
          { itemId: 'i2', value: '기획', isOther: false },
          { itemId: 'i3', value: '개발', isOther: false },
          { itemId: 'i4', value: '디자인', isOther: false },
          { itemId: 'i5', value: '기타(직접입력)', isOther: true },
        ],
      },
      {
        questionId: 'q3',
        questionType: 'SUBJECTIVE',
        isRequired: 'OPTIONAL',
        question: '자료집을 알게 된 경로를 알려주세요',
        description: '선택사항입니다',
        selectionMethod: 'SINGLE',
        items: [],
      },
    ],
  },
};

function buildDefaultForm(magnetId: number): MagnetFormData {
  return { magnetId, questions: [] };
}

// TODO: API 준비 후 server-side fetch로 교체
export async function fetchMagnetForm(
  magnetId: number,
): Promise<MagnetFormData> {
  return MOCK_MAGNET_FORMS[magnetId] ?? buildDefaultForm(magnetId);
}

// TODO: API 준비 후 useSaveMagnetFormMutation React Query 훅으로 교체
export async function saveMagnetForm(
  body: MagnetFormReqBody,
): Promise<void> {
  MOCK_MAGNET_FORMS[body.magnetId] = {
    magnetId: body.magnetId,
    questions: body.questions,
  };
}

// TODO: API 준비 후 React Query 훅으로 교체
export function fetchMagnetsWithForm(): MagnetWithFormSummary[] {
  return Object.entries(MOCK_MAGNET_FORMS).map(([id, data]) => {
    const magnet = MOCK_MAGNETS.find((m) => m.magnetId === Number(id));
    return {
      id: Number(id),
      title: magnet?.title ?? `마그넷 ${id}`,
      type: magnet?.type ?? 'MATERIAL',
      questionCount: data.questions.length,
    };
  });
}

// --- 공통 신청폼 관리 ---

let MOCK_COMMON_FORM: CommonFormData = {
  questions: [
    {
      questionId: 'common-q1',
      questionType: 'OBJECTIVE',
      isRequired: 'REQUIRED',
      question: '관심 직무를 선택해주세요',
      description: '복수 선택이 가능합니다',
      selectionMethod: 'MULTIPLE',
      items: [
        { itemId: 'common-i1', value: '마케팅', isOther: false },
        { itemId: 'common-i2', value: '기획', isOther: false },
        { itemId: 'common-i3', value: '개발', isOther: false },
        { itemId: 'common-i4', value: '디자인', isOther: false },
        { itemId: 'common-i5', value: '기타(직접입력)', isOther: true },
      ],
    },
    {
      questionId: 'common-q2',
      questionType: 'SUBJECTIVE',
      isRequired: 'OPTIONAL',
      question: '이름을 입력해주세요',
      description: '',
      selectionMethod: 'SINGLE',
      items: [],
    },
  ],
};

// TODO: API 준비 후 server-side fetch로 교체
export async function fetchCommonForm(): Promise<CommonFormData> {
  return MOCK_COMMON_FORM;
}

// TODO: API 준비 후 useSaveCommonFormMutation React Query 훅으로 교체
export async function saveCommonForm(
  body: CommonFormReqBody,
): Promise<void> {
  MOCK_COMMON_FORM = { questions: body.questions };
}
