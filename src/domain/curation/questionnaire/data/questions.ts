import { CurationQuestion, PersonaId } from '../../types';
import {
  STARTER_S1,
  STARTER_S2,
  RESUME_S1,
  RESUME_S2,
  COVER_S1,
  COVER_S2,
  PORTFOLIO_S1,
  PORTFOLIO_S2,
  SPECIAL_S1,
  SPECIAL_S2,
  INTERVIEW_S1,
  INTERVIEW_S2,
  DONT_KNOW_S1,
  DONT_KNOW_S2,
} from './optionIds';

export const QUESTION_MAP: Record<PersonaId, CurationQuestion[]> = {
  starter: [
    {
      id: 'step1',
      title: '지금 상황에 가장 가까운 것을 골라주세요.',
      options: [
        {
          value: STARTER_S1.HAS_EXPERIENCE,
          title: '경험은 있는데 어디서부터 정리해야 할지 모르겠어요',
        },
        {
          value: STARTER_S1.NEEDS_RESUME,
          title: '이력서 제출이 1주일도 안 남았어요',
        },
        {
          value: STARTER_S1.NEEDS_BUNDLE,
          title: '서류 전체를 한 번에 정비하고 싶어요',
        },
      ],
    },
    {
      id: 'step2',
      title: '어떤 방식으로 준비하고 싶으세요?',
      options: [
        {
          value: STARTER_S2.SELF_GUIDE,
          title: '가이드 따라 경험을 스스로 정리해볼게요',
          group: STARTER_S1.HAS_EXPERIENCE,
        },
        {
          value: STARTER_S2.WITH_FEEDBACK,
          title: '현직자 피드백 받으며 경험을 완성하고 싶어요',
          group: STARTER_S1.HAS_EXPERIENCE,
        },
        {
          value: STARTER_S2.WITH_RESUME,
          title: '이력서 작성까지 연결해서 한 번에 해결하고 싶어요',
          group: STARTER_S1.HAS_EXPERIENCE,
        },
        {
          value: STARTER_S2.FAST_RESUME,
          title: '경험 정리 후 이력서를 최대한 빠르게 완성할게요',
          group: STARTER_S1.NEEDS_RESUME,
        },
        {
          value: STARTER_S2.MENTOR_RESUME,
          title: '멘토 피드백 받으며 이력서까지 완성하고 싶어요',
          group: STARTER_S1.NEEDS_RESUME,
        },
        {
          value: STARTER_S2.WITH_COVER,
          title: '자소서까지 한꺼번에 준비하고 싶어요',
          group: STARTER_S1.NEEDS_RESUME,
        },
        {
          value: STARTER_S2.FAST_BUNDLE,
          title: '자소서·포폴을 가이드로 빠르게 정비할게요',
          group: STARTER_S1.NEEDS_BUNDLE,
        },
        {
          value: STARTER_S2.COVER_FEEDBACK,
          title: '멘토 피드백 받으며 자소서를 완성하고 싶어요',
          group: STARTER_S1.NEEDS_BUNDLE,
        },
        {
          value: STARTER_S2.PORTFOLIO_FEEDBACK,
          title: '포트폴리오까지 피드백 받아 완성하고 싶어요',
          group: STARTER_S1.NEEDS_BUNDLE,
        },
      ],
    },
  ],
  resume: [
    {
      id: 'step1',
      title: '지금 상황에 가장 가까운 것을 골라주세요.',
      options: [
        {
          value: RESUME_S1.FIRST_RESUME,
          title: '첫 이력서라 쓸 소재가 부족해요',
        },
        {
          value: RESUME_S1.REFRESH,
          title: '기존 이력서를 다시 다듬으려고 해요',
        },
        {
          value: RESUME_S1.CAREER_SHIFT,
          title: '직무/산업 전환으로 이력서를 새로 써야 해요',
        },
      ],
    },
    {
      id: 'step2',
      title: '어떤 방식으로 준비하고 싶으세요?',
      options: [
        {
          value: RESUME_S2.WEEK_DRAFT,
          title: '이번 주 안에 일단 초안을 완성할게요',
          group: RESUME_S1.FIRST_RESUME,
        },
        {
          value: RESUME_S2.MENTOR_2_3WEEKS,
          title: '2~3주 안에 멘토 피드백 받으며 완성하고 싶어요',
          group: RESUME_S1.FIRST_RESUME,
        },
        {
          value: RESUME_S2.MONTH_EXPERIENCE,
          title: '한 달 여유로 경험 정리부터 탄탄하게 시작할게요',
          group: RESUME_S1.FIRST_RESUME,
        },
        {
          value: RESUME_S2.FAST_FIX,
          title: '이번 주 안에 빠르게 수정·완성할게요',
          group: RESUME_S1.REFRESH,
        },
        {
          value: RESUME_S2.MENTOR_IMPROVE,
          title: '2~3주 안에 멘토 피드백으로 완성도를 높이고 싶어요',
          group: RESUME_S1.REFRESH,
        },
        {
          value: RESUME_S2.FULL_REWRITE,
          title: '한 달 여유로 이력서를 제대로 새로 써보고 싶어요',
          group: RESUME_S1.REFRESH,
        },
        {
          value: RESUME_S2.SHIFT_FAST,
          title: '이번 주 안에 새 직무 이력서를 완성할게요',
          group: RESUME_S1.CAREER_SHIFT,
        },
        {
          value: RESUME_S2.SHIFT_WITH_COVER,
          title: '2~3주 안에 자소서까지 함께 완성하고 싶어요',
          group: RESUME_S1.CAREER_SHIFT,
        },
        {
          value: RESUME_S2.SHIFT_MONTH,
          title: '한 달 여유로 이력서·자소서 둘 다 제대로 쓸게요',
          group: RESUME_S1.CAREER_SHIFT,
        },
      ],
    },
  ],
  coverLetter: [
    {
      id: 'step1',
      title: '지금 상황에 가장 가까운 것을 골라주세요.',
      options: [
        {
          value: COVER_S1.GENERAL_COVER,
          title: '직무 역량·지원동기 중심 기본 자소서가 필요해요',
        },
        {
          value: COVER_S1.ENTERPRISE_COVER,
          title: '삼성·현대·SK 등 대기업 공채 자소서가 필요해요',
        },
        {
          value: COVER_S1.PORTFOLIO_LINKED,
          title: '자소서에 포폴 사례까지 함께 보여줘야 해요',
        },
      ],
    },
    {
      id: 'step2',
      title: '어떤 방식으로 준비하고 싶으세요?',
      options: [
        {
          value: COVER_S2.SELF_WRITE,
          title: '가이드만으로 스스로 작성해볼게요',
          group: COVER_S1.GENERAL_COVER,
        },
        {
          value: COVER_S2.LIVE_1,
          title: '멘토 LIVE 피드백 1회로 완성하고 싶어요',
          group: COVER_S1.GENERAL_COVER,
        },
        {
          value: COVER_S2.DEEP_FEEDBACK,
          title: '문항마다 심층 피드백 받아 완성하고 싶어요',
          group: COVER_S1.GENERAL_COVER,
        },
        {
          value: COVER_S2.ENTERPRISE_SELF,
          title: '기업·산업 분석 가이드로 스스로 써볼게요',
          group: COVER_S1.ENTERPRISE_COVER,
        },
        {
          value: COVER_S2.ENTERPRISE_MENTOR,
          title: '멘토 피드백 받으며 공채 자소서를 완성할게요',
          group: COVER_S1.ENTERPRISE_COVER,
        },
        {
          value: COVER_S2.ENTERPRISE_INTENSIVE,
          title: '문항별 집중 첨삭으로 합격 자소서를 완성할게요',
          group: COVER_S1.ENTERPRISE_COVER,
        },
        {
          value: COVER_S2.PORTFOLIO_GUIDE,
          title: '가이드로 자소서·포폴 틀을 잡아볼게요',
          group: COVER_S1.PORTFOLIO_LINKED,
        },
        {
          value: COVER_S2.PORTFOLIO_MENTOR,
          title: '멘토 피드백으로 자소서를 완성하고 싶어요',
          group: COVER_S1.PORTFOLIO_LINKED,
        },
        {
          value: COVER_S2.PORTFOLIO_BOTH,
          title: '자소서·포폴 둘 다 집중 피드백 받고 싶어요',
          group: COVER_S1.PORTFOLIO_LINKED,
        },
      ],
    },
  ],
  portfolio: [
    {
      id: 'step1',
      title: '지금 상황에 가장 가까운 것을 골라주세요.',
      options: [
        {
          value: PORTFOLIO_S1.PORTFOLIO_CORE,
          title: '직무 포트폴리오를 처음 만들어야 해요',
        },
        {
          value: PORTFOLIO_S1.MARKETING_TRACK,
          title: '마케팅 직무 취업을 위한 포폴과 서류가 필요해요',
        },
        {
          value: PORTFOLIO_S1.HR_TRACK,
          title: 'HR 직무 취업을 위한 포폴과 서류가 필요해요',
        },
      ],
    },
    {
      id: 'step2',
      title: '어떤 방식으로 준비하고 싶으세요?',
      options: [
        {
          value: PORTFOLIO_S2.HAS_DRAFT,
          title: '초안이 있으니 가이드로 구조화할게요',
          group: PORTFOLIO_S1.PORTFOLIO_CORE,
        },
        {
          value: PORTFOLIO_S2.NEED_EXAMPLE,
          title: '예시·템플릿 보며 처음부터 만들고 싶어요',
          group: PORTFOLIO_S1.PORTFOLIO_CORE,
        },
        {
          value: PORTFOLIO_S2.NEED_FEEDBACK,
          title: '멘토 피드백으로 완성도를 높이고 싶어요',
          group: PORTFOLIO_S1.PORTFOLIO_CORE,
        },
        {
          value: PORTFOLIO_S2.MKT_GUIDE,
          title: '초안이 있으니 올인원 가이드로 정리할게요',
          group: PORTFOLIO_S1.MARKETING_TRACK,
        },
        {
          value: PORTFOLIO_S2.MKT_MENTOR,
          title: '멘토 피드백 받아 마케팅 포폴을 완성할게요',
          group: PORTFOLIO_S1.MARKETING_TRACK,
        },
        {
          value: PORTFOLIO_S2.MKT_PREMIUM,
          title:
            '현직자 멘토의 강의와 무제한 QNA와 함께 마케팅 포폴을 완성할게요',
          group: PORTFOLIO_S1.MARKETING_TRACK,
        },
        {
          value: PORTFOLIO_S2.HR_GUIDE,
          title: '초안이 있으니 올인원 가이드로 정리할게요',
          group: PORTFOLIO_S1.HR_TRACK,
        },
        {
          value: PORTFOLIO_S2.HR_MENTOR,
          title: '멘토 피드백 받아 HR 포폴을 완성할게요',
          group: PORTFOLIO_S1.HR_TRACK,
        },
        {
          value: PORTFOLIO_S2.HR_PREMIUM,
          title:
            '현직자 멘토의 강의와 무제한 QNA와 함께 HR 포폴을 완성할게요',
          group: PORTFOLIO_S1.HR_TRACK,
        },
      ],
    },
  ],
  specialized: [
    {
      id: 'step1',
      title: '지금 상황에 가장 가까운 것을 골라주세요.',
      options: [
        {
          value: SPECIAL_S1.ENTERPRISE,
          title: '삼성·현대·SK 등 대기업 공채를 집중 준비해요',
        },
        {
          value: SPECIAL_S1.MARKETING,
          title: '마케팅 직무로 취업을 본격 준비해요',
        },
        {
          value: SPECIAL_S1.HR,
          title: 'HR 직무로 취업을 본격 준비해요',
        },
      ],
    },
    {
      id: 'step2',
      title: '어떤 방식으로 준비하고 싶으세요?',
      options: [
        {
          value: SPECIAL_S2.ENT_EXPERIENCE,
          title: '경험부터 다시 정리하며 공채 자소서를 써볼게요',
          group: SPECIAL_S1.ENTERPRISE,
        },
        {
          value: SPECIAL_S2.ENT_INTENSIVE,
          title: '문항별 집중 첨삭으로 완성도를 높이고 싶어요',
          group: SPECIAL_S1.ENTERPRISE,
        },
        {
          value: SPECIAL_S2.ENT_GUIDE,
          title: '자소서 가이드로 빠르게 완성할게요',
          group: SPECIAL_S1.ENTERPRISE,
        },
        {
          value: SPECIAL_S2.MKT_EXPERIENCE,
          title: '경험부터 다시 정리하며 마케팅 서류를 써볼게요',
          group: SPECIAL_S1.MARKETING,
        },
        {
          value: SPECIAL_S2.MKT_INTENSIVE,
          title: '현직자 특강·멘토 피드백으로 완성도를 높이고 싶어요',
          group: SPECIAL_S1.MARKETING,
        },
        {
          value: SPECIAL_S2.MKT_FAST,
          title: '마케팅 서류를 가이드로 빠르게 완성할게요',
          group: SPECIAL_S1.MARKETING,
        },
        {
          value: SPECIAL_S2.HR_EXPERIENCE,
          title: '경험부터 다시 정리하며 HR 서류를 써볼게요',
          group: SPECIAL_S1.HR,
        },
        {
          value: SPECIAL_S2.HR_INTENSIVE,
          title: '현직자 특강·멘토 피드백으로 완성도를 높이고 싶어요',
          group: SPECIAL_S1.HR,
        },
        {
          value: SPECIAL_S2.HR_FAST,
          title: 'HR 서류를 가이드로 빠르게 완성할게요',
          group: SPECIAL_S1.HR,
        },
      ],
    },
  ],
  interview: [
    {
      id: 'step1',
      title: '지금 상황에 가장 가까운 것을 골라주세요.',
      options: [
        {
          value: INTERVIEW_S1.FAILING_INTERVIEW,
          title: '서류는 통과하는데 면접에서 자꾸 떨어져요',
        },
        {
          value: INTERVIEW_S1.FIRST_INTERVIEW,
          title: '면접이 처음이에요 기초부터 체계적으로 준비할게요',
        },
        {
          value: INTERVIEW_S1.DOCS_AND_INTERVIEW,
          title: '서류와 면접을 함께 준비해야 해요',
        },
      ],
    },
    {
      id: 'step2',
      title: '어떤 방식으로 준비하고 싶으세요?',
      options: [
        {
          value: INTERVIEW_S2.SELF_PREP,
          title: '자기소개·기본 답변을 스스로 정리할게요',
          group: INTERVIEW_S1.FAILING_INTERVIEW,
        },
        {
          value: INTERVIEW_S2.MOCK_1,
          title: '모의면접 1회로 실전 피드백 받고 싶어요',
          group: INTERVIEW_S1.FAILING_INTERVIEW,
        },
        {
          value: INTERVIEW_S2.MOCK_2_SPECIAL,
          title: '모의면접 2회 + 현직자 특강까지 받고 싶어요',
          group: INTERVIEW_S1.FAILING_INTERVIEW,
        },
        {
          value: INTERVIEW_S2.FIRST_SELF,
          title: '답변 구성과 예상 질문을 혼자 정리할게요',
          group: INTERVIEW_S1.FIRST_INTERVIEW,
        },
        {
          value: INTERVIEW_S2.FIRST_MOCK,
          title: '모의면접으로 부족한 부분 피드백 받을게요',
          group: INTERVIEW_S1.FIRST_INTERVIEW,
        },
        {
          value: INTERVIEW_S2.FIRST_FULL,
          title: '모의면접 + 현직자 특강으로 완전히 준비할게요',
          group: INTERVIEW_S1.FIRST_INTERVIEW,
        },
        {
          value: INTERVIEW_S2.DOCS_FIRST,
          title: '서류가 더 급해서 서류 먼저 끝낼게요',
          group: INTERVIEW_S1.DOCS_AND_INTERVIEW,
        },
        {
          value: INTERVIEW_S2.DOCS_THEN_INTERVIEW,
          title: '서류 완성 후 면접까지 이어서 준비할게요',
          group: INTERVIEW_S1.DOCS_AND_INTERVIEW,
        },
        {
          value: INTERVIEW_S2.BOTH_INTENSIVE,
          title: '서류도 면접도 둘 다 제대로 받고 싶어요',
          group: INTERVIEW_S1.DOCS_AND_INTERVIEW,
        },
      ],
    },
  ],
  dontKnow: [
    {
      id: 'step1',
      title: '지금 상황에 가장 가까운 것을 골라주세요.',
      options: [
        {
          value: DONT_KNOW_S1.JUST_STARTED,
          title: '아직 아무것도 시작을 못 했어요',
        },
        {
          value: DONT_KNOW_S1.WORKING_ON_DOCS,
          title: '서류를 쓰고 있는데 방향이 맞는지 모르겠어요',
        },
        {
          value: DONT_KNOW_S1.ALMOST_READY,
          title: '거의 다 됐는데 마지막 점검이 필요해요',
        },
      ],
    },
    {
      id: 'step2',
      title: '어떤 방식으로 준비하고 싶으세요?',
      options: [
        {
          value: DONT_KNOW_S2.START_SLOW,
          title: '일단 경험 정리부터 차근차근 시작할게요',
          group: DONT_KNOW_S1.JUST_STARTED,
        },
        {
          value: DONT_KNOW_S2.START_FAST,
          title: '시간이 없으니 이력서·자소서부터 바로 시작할게요',
          group: DONT_KNOW_S1.JUST_STARTED,
        },
        {
          value: DONT_KNOW_S2.START_QUALITY,
          title: '천천히 완성도 높게 처음부터 준비하고 싶어요',
          group: DONT_KNOW_S1.JUST_STARTED,
        },
        {
          value: DONT_KNOW_S2.RESET_DIRECTION,
          title: '자소서·이력서 방향을 처음부터 다시 잡아볼게요',
          group: DONT_KNOW_S1.WORKING_ON_DOCS,
        },
        {
          value: DONT_KNOW_S2.FINISH_FAST,
          title: '시간이 없으니 이력서·자소서를 빠르게 마무리할게요',
          group: DONT_KNOW_S1.WORKING_ON_DOCS,
        },
        {
          value: DONT_KNOW_S2.MENTOR_QUALITY,
          title: '멘토 피드백으로 자소서 완성도를 높이고 싶어요',
          group: DONT_KNOW_S1.WORKING_ON_DOCS,
        },
        {
          value: DONT_KNOW_S2.FINAL_CHECK,
          title: '포폴·자소서를 마지막으로 한 번 점검하고 싶어요',
          group: DONT_KNOW_S1.ALMOST_READY,
        },
        {
          value: DONT_KNOW_S2.QUICK_FINISH,
          title: '시간이 없어서 빠르게 마무리할게요',
          group: DONT_KNOW_S1.ALMOST_READY,
        },
        {
          value: DONT_KNOW_S2.FINAL_MENTOR,
          title: '멘토 피드백으로 마지막 완성도를 올리고 싶어요',
          group: DONT_KNOW_S1.ALMOST_READY,
        },
      ],
    },
  ],
};
