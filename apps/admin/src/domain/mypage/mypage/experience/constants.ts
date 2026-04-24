import type {
  DisplayExperienceCategory,
  ExperienceCategory,
  UserExperience,
} from '@/api/user/userSchema';
import { CATEGORY_PAIRS } from '@/api/user/userSchema';

export const MAX_COMPETENCIES = 5;

export const CATEGORY_MAP: Record<
  DisplayExperienceCategory,
  ExperienceCategory
> = Object.fromEntries(CATEGORY_PAIRS) as any;

export const CATEGORY_REVERSE_MAP: Record<
  ExperienceCategory,
  DisplayExperienceCategory
> = Object.fromEntries(CATEGORY_PAIRS.map(([d, a]) => [a, d])) as any;

type ExperienceFormText = Record<
  Exclude<keyof UserExperience, 'activityType' | 'isAdminAdded'> | 'year',
  {
    label: string;
    placeholder: string;
    description?: string;
    exampleTooltips?: string;
  }
>;

export const EXPERIENCE_FORM_TEXT: ExperienceFormText = {
  // 기본 정보
  title: {
    label: '경험 이름',
    placeholder: '예) 여름 방학 UX 기획 프로젝트 / △△△ 동아리 운영팀 활동',
  },
  experienceCategory: {
    label: '경험 분류',
    placeholder: '경험 분류를 선택해주세요',
  },
  customCategoryName: {
    label: '직접 입력',
    placeholder: '직접 입력해주세요.',
  },
  organ: {
    label: '기관',
    placeholder: '예) 네이버 / 서울대학교 / △△△ 스타트업 / ○○ 마케팅 공모전',
  },
  role: {
    label: '역할 및 담당 업무',
    placeholder: '예) 마케팅 전략 수립 및 실행 / 서비스 기획 및 UX 설계',
  },
  startDate: {
    label: '시작 연도, 월',
    placeholder: '시작 연도, 월',
  },
  endDate: {
    label: '종료 연도, 월',
    placeholder: '종료 연도, 월',
  },
  year: {
    label: '연도',
    placeholder: '기간을 선택하면 자동으로 입력됩니다.',
  },
  // 경험 상세 작성
  situation: {
    label: 'Situation (상황)',
    placeholder:
      '예) 신제품 출시 후 초기 유입이 목표 대비 40% 낮아, 원인 분석과 신규 캠페인 기획이 필요했습니다.',
    description: '경험이 일어난 배경과 맥락을 간단히 설명해주세요.',
    exampleTooltips:
      '가게 정보 중심의 프로필 세팅과 대형 인플루언서 협업으로 운영되어 왔으나, 예약 링크 클릭 및 목표 고객 유입이 저조했고, 인플루언서 마케팅의 효과도 점차 감소하는 상황',
  },
  task: {
    label: 'Task (문제)',
    placeholder:
      '예) 한 달 안에 신규 유입률을 30% 이상 끌어올릴 수 있는 디지털 마케팅 전략을 수립하고 실행해야 했습니다.',
    description:
      '그 상황에서 맡았던 목표나 해결해야 했던 과제를 구체적으로 적어주세요.',
    exampleTooltips:
      '1. 프로필 노출 및 링크 클릭 저조: 단순 매장 정보를 서술한 프로필 구성으로, 지역 키워드가 부족해 도달 및 검색 노출 효과 낮음. 명확한 CTA 문구가 없어 프로필 방문 대비 예약 링크 클릭 수가 매우 적음.\n\n2. 인플루언서 마케팅 효율성 저하: 팔로워 수에만 집중한 대형 인플루언서 협업으로 타겟 고객 유입률이 낮고 재방문율 및 매출 증가 효과가 미미함.',
  },
  action: {
    label: 'Action (행동)',
    placeholder:
      '예) 타겟 리서치를 통해 핵심 고객군을 재정의하고, SNS 광고 크리에이티브 3종과 콘텐츠 캠페인 시리즈를 직접 기획·운영했습니다. 인플루언서 협업을 통해 바이럴 채널도 확대했습니다.',
    description:
      '과제를 해결하기 위해 직접 수행한 행동과 역할을 상세히 서술해주세요.',
    exampleTooltips: `인스타그램 프로필 및 콘텐츠 최적화
• 업체 대표 상품 3종과 지역 키워드를 반영하여 프로필 소개글과 키워드 구조를 재설계.
• 예약 링크 클릭을 유도하기 위해 첫 예약 50% 할인 혜택을 안내하는 CTA 문구를 삽입.
• 대표 상품을 소개하는 짧은 릴스(영상)를 제작하여 프로필 상단 고정, 시청자 관심과 접근성 강화.

인플루언서 마케팅 전략 재구성
• 경쟁사와 협업한 인플루언서 중 브랜드와 핏이 맞는 인플루언서를 탐색
• 협업 최소 기준을 세워 팔로워 타겟층, 게시물 카테고리 일관성, 최근 콘텐츠 조회수 등 평가 요소를 명확히 규정.
• 스프레드시트로 인플루언서 협업 '적합/부적합/보류' 분류 및 리스트업.
• 팔로워 인게이지먼트가 높고 충성도 있는 마이크로 인플루언서와 협업 진행.`,
  },
  result: {
    label: 'Result (결과)',
    placeholder:
      '예) 캠페인 시작 3주 만에 신규 유입률이 45% 상승했고, 광고 클릭률이 이전 대비 2.3배 개선되었습니다.',
    description:
      '그 행동을 통해 얻은 성과나 변화, 배운 점을 수치나 사례로 표현해주세요.',
    exampleTooltips:
      '• 프로필 도달 계정 약 125% 증가\n• 프로필 방문 약 165% 증가\n• 예약 링크 클릭 1400% 증가\n• 월평균 매출 약 75% 이상 증가\n• 타겟 고객 방문과 재방문율이 향상되어 단기적 효과가 아닌 매출 안정적 유지',
  },
  reflection: {
    label: '느낀 점 / 배운 점',
    placeholder:
      '예) 단순히 예산을 투입하는 것보다 타겟을 명확히 정의하고 콘텐츠 전략을 정교화하는 것이 성과에 큰 영향을 준다는 것을 배웠습니다. 데이터 기반으로 캠페인을 설계하는 역량을 키우는 계기가 되었습니다.',
    description:
      '이 경험을 통해 얻은 깨달음이나 성장 포인트를 자유롭게 작성해주세요.',
    exampleTooltips:
      '이 경험을 통해 인플루언서 마케팅의 성공이 단순히 팔로워 수에 의존하지 않는다는 점을 깊이 깨달았다. \n  타겟층과 브랜드의 적합성, 콘텐츠의 일관성, 최신 콘텐츠의 조회수 등 다양한 기준을 고려해야만 효과적인 협업이 가능하다는 사실을 알게 되었고, 이를 바탕으로 기존의 마케팅 방향을 전면적으로 수정했다. \n  \n  이후, 이러한 전략적 전환이 실제 매출 상승과 재방문율 증가라는 큰 성과로 이어진 순간, 마케터로서의 진정한 흥미와 업무에 대한 자신감을 느꼈다. 주도적으로 문제를 발견하고 해결책을 모색하며 성과를 만들어내는 과정에서, 마케팅 직무에 대한 확신과 효능감을 갖게 된 매우 뜻깊은 경험이었다.',
  },
  // 핵심 역량
  coreCompetency: {
    label: '핵심 역량 (최대 5개)',
    placeholder: '키워드를 입력해주세요. (예. 데이터 분석, QA, 커뮤니케이션)',
    description:
      '키워드를 입력한 뒤 콤마(,)를 누르면 자동으로 태그가 만들어집니다.',
  },
} as const;
