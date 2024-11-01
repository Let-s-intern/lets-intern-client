import BenefitCard from '@components/common/program/program-detail/different/BenefitCard';
import DifferentCard, {
  DifferentCardProps,
} from '@components/common/program/program-detail/different/DifferentCard';

const differentList: DifferentCardProps[] = [
  {
    order: 1,
    title: `취업 준비가 더 이상 막막하지 않도록\nA부터 Z까지 알려주는 학습 콘텐츠`,
    options: [
      '초보 취준생도 따라갈 수 있는 친절한 길라잡이',
      '합격자 예시를 포함하여 콘텐츠 이해도 UP',
      'PDF 30페이지 분량의 추가 콘텐츠 제공',
    ],
    imageUrl: {
      desktop: '/challenge-detail/different/desktop/contents_desktop.gif',
      mobile: '/challenge-detail/different/mobile/contents_mobile.gif',
    },
  },
  {
    order: 2,
    title: `서류와 면접의 기초 베이스가 되어줄\n미션 템플릿으로 나만의 취업 가이드북 완성`,
    options: [
      '하루 30분, 서류를 완성하는 실습',
      '누구나 쉽게 채울 수 있는 노션 템플릿',
      '수료 후에도 자산으로 남는 취업 가이드북',
    ],
    imageUrl: {
      desktop: '/challenge-detail/different/desktop/template_desktop.gif',
      mobile: '/challenge-detail/different/mobile/template_mobile.gif',
    },
  },
  {
    order: 3,
    title: `시간은 어느새 흐르고,\n혼자 하기 어렵다면 사람들과\n함께 공유하며 성장하는 동기부여 시스템`,
    options: [
      `사람들과 함께 공유하며 성장하는\n오픈 카톡 커뮤니티`,
      '미션 80점 이상 완료 시, 수료증 지급',
    ],
    imageUrl: {
      desktop: '/challenge-detail/different/desktop/community_desktop.gif',
      mobile: '/challenge-detail/different/mobile/community_mobile.gif',
    },
  },
];

export const tripleBenefits = [
  {
    title: '온라인 대시보드',
    options: [
      `챌린지 참여가 종료되어도, 참여했던 미션\n무한 열람 및 아카이빙`,
      `미션 현황과 기수별 주요 공지도\n함께 열람할 수 있어 몰입감 UP!`,
    ],
    mobileUrl: '/challenge-detail/different/dashboard.png',
    desktopUrl: '/challenge-detail/different/dashboard.png',
  },
  {
    title: '프로그램 수료증 발급',
    options: [
      `프로그램 종료 시, 참여자분들께 렛츠커리어에서 인증하는 참여 수료증을 발급해드립니다.`,
    ],
    desktopUrl: '/challenge-detail/different/certificate.png',
  },
  {
    title: '네트워킹 파티',
    options: [
      `주니어 PM, 제조업 대기업 재직자 등이 포함된 커리어 선배들과의 온/오프라인 네트워킹 파티에 초대합니다.`,
    ],
    desktopUrl: '/challenge-detail/different/networking.png',
  },
];

interface ChallengeDifferentProps {
  payback: number;
}

const ChallengeDifferent = ({ payback }: ChallengeDifferentProps) => {
  const isMobile = window.innerWidth < 768;

  return (
    <section id="different" className="flex w-full flex-col gap-y-[70px] py-8">
      <div className="flex w-full flex-col gap-y-8">
        <div className="flex w-full flex-col gap-y-6">
          <p className="w-full text-xsmall14 font-semibold text-neutral-45 md:text-center md:text-small20">
            차별점
          </p>
          <div className="flex flex-col gap-y-1 md:items-center">
            <p className="text-xsmall14 font-semibold text-challenge md:text-small18">
              비교 불가!
            </p>
            <h4 className="whitespace-pre text-small20 font-bold text-black md:text-xlarge28">{`렛츠커리어 챌린지만의 차별점,\n이 모든걸 얻어가실 수 있어요!`}</h4>
          </div>
        </div>
        <div className="flex w-full flex-col gap-y-6">
          {differentList.map((different) => (
            <DifferentCard
              key={different.title}
              order={different.order}
              title={different.title}
              options={different.options}
              imageUrl={different.imageUrl}
            />
          ))}
          <div className="flex w-full gap-x-2 rounded-md bg-[#EEFAFF] px-5 pb-10 pt-[30px] text-small18 font-bold md:px-10 md:py-[50px] md:text-medium22">
            <span className="text-challenge">혜택</span>
            <p className="whitespace-pre text-black">
              {isMobile
                ? `모든 커리큘럼을 따라오기만 하면,\n만원을 페이백해드려요!`
                : `모든 커리큘럼을 따라오기만 하면, n만원을 페이백해드려요!`}
            </p>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col gap-y-8">
        <p className="whitespace-pre text-small20 font-bold md:text-center md:text-xlarge28">{`여기서 끝이 아니죠\n챌린지 참여자만을 위한 트리플 혜택!`}</p>
        <div className="flex w-full flex-col gap-y-4">
          <div className="flex w-full flex-col items-center gap-x-[14px] gap-y-4 md:min-h-[302px] md:flex-row">
            <BenefitCard
              type="double"
              title={tripleBenefits[0].title}
              options={tripleBenefits[0].options}
              mobileUrl={tripleBenefits[0].mobileUrl}
              desktopUrl={tripleBenefits[0].desktopUrl}
            />
            <BenefitCard
              type="double"
              title={tripleBenefits[1].title}
              options={tripleBenefits[1].options}
              desktopUrl={tripleBenefits[1].desktopUrl}
            />
          </div>
          <BenefitCard
            type="single"
            title={tripleBenefits[2].title}
            options={tripleBenefits[2].options}
            desktopUrl={tripleBenefits[2].desktopUrl}
          />
        </div>
      </div>
    </section>
  );
};

export default ChallengeDifferent;
