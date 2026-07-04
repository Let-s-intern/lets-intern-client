'use client';

import Heading2 from '@/domain/report/ui/heading/Heading2';
import { challengeColors } from '@/domain/program/challenge/challengeColors';
import Image from 'next/image';
import { Break } from '../../../../../common/Break';
import Description from '../../../program-detail/Description';

const PortfolioIntroWhySection: React.FC<{ weekText: string }> = ({
  weekText,
}) => {
  return (
    <div className="flex w-full flex-col items-center overflow-x-hidden bg-gradient-to-t from-[#F0F4FF] to-white">
      <section className="flex w-full max-w-[1000px] flex-col px-5 pt-20 md:px-10 md:pt-40 lg:px-0">
        <Heading2 className="text-small20 md:text-xlarge28 md:text-center">
          <span className="text-[#4A76FF]">포트폴리오</span>, 시간 많이 들여야
          할 정도로 중요한가요?
          <br />
          <br className="md:hidden" />
          이제는 채용공고에서도 확인할 수 있는{' '}
          <span className="text-[#4A76FF]">필수 서류</span>이니까요!
        </Heading2>

        <Description className="mt-3 md:mt-8 md:text-center">
          이전에는 포트폴리오가 선택이었지만 이젠 필수 제출 서류인 만큼
          <Break />
          시간 날 때 미리 준비하고, 더욱 신경 써서 구성해야만 해요!
        </Description>

        <div className="mt-8 grid grid-cols-1 gap-4 md:mt-14 md:grid-cols-2 md:gap-6">
          {[
            {
              title: '[HR 전문 에이전시] hr컨설팅팀 인턴',
              content: (
                <>
                  모든 지원자는{' '}
                  <span style={{ color: challengeColors._4A76FF }}>
                    포트폴리오를 필수로 제출
                  </span>
                  하셔야 합니다. (URL 공유시 공개 여부 반드시 확인)
                </>
              ),
            },
            {
              title: '[00마켓] 중고거래 PM 정규직',
              content: (
                <>
                  1. 서류 접수(포트폴리오 필수)<br></br>*{' '}
                  <span style={{ color: challengeColors._4A76FF }}>
                    포트폴리오를 꼭 함께 제출
                  </span>{' '}
                  해주세요 :)
                </>
              ),
            },
            {
              title: '[000뱅크] 제휴세일즈 정규직',
              content: (
                <>
                  <span style={{ color: challengeColors._4A76FF }}>
                    포트폴리오 제출은 필수
                  </span>
                  이며 첨부파일, URL 등 형식 무관합니다.
                </>
              ),
            },
            {
              title: '[뷰티 브랜드 기업] 채용담당자 인터뷰',
              content: (
                <>
                  마케팅, BM 직무의 경우 필수는 아니나{' '}
                  <span style={{ color: challengeColors._4A76FF }}>
                    포트폴리오가 있다면 더욱 좋아요!
                  </span>
                </>
              ),
            },
          ].map((item, index) => (
            <div
              className="flex flex-col gap-6 rounded-md bg-[#F0F4FF] px-8 py-10 md:px-10 md:py-12"
              key={index}
            >
              <h3 className="text-small18 md:text-medium24 font-bold">
                {item.title}
              </h3>
              <p className="text-xsmall16 text-neutral-40 md:text-small18 break-keep font-medium">
                {item.content}
              </p>
            </div>
          ))}
        </div>

        <Heading2 className="text-small20 md:text-xlarge28 mt-10 break-keep md:mt-32 md:text-center">
          그리고 이런{' '}
          <span style={{ color: challengeColors._4A76FF }}>
            수강생들의 후기 100+개가 인증
          </span>
          하는
          <Break />
          렛츠커리어 포트폴리오 {weekText} 완성 챌린지!
        </Heading2>

        <Description className="mt-3 break-keep md:mt-8 md:text-center">
          학과, 직무, 경험 구분 없이 다양한 수강생들이
          <Break />
          만족도 평균 4.9점으로 남겨준 진심 100% 후기
        </Description>

        <Image
          src="/images/bubble-group-549-180.png"
          alt="후기 말풍선 이미지"
          unoptimized
          width={549}
          height={180}
          className="mx-auto mt-8 block object-cover"
        />
        <div className="mx-auto mt-4 flex flex-col items-center gap-1.5">
          <div className="bg-neutral-45 h-1 w-1 rounded-full"></div>
          <div className="bg-neutral-30 h-1 w-1 rounded-full"></div>
          <div className="bg-neutral-0 h-1 w-1 rounded-full"></div>
        </div>

        <p className="text-medium22 md:text-medium24 mt-2 text-left font-bold md:text-center">
          챌린지로 준비해서 <br className="md:hidden" />
          서류·최종 합격까지 성공했어요!
        </p>

        <div className="mb-20 mt-8 grid grid-cols-1 gap-4 md:mb-40 md:mt-8 md:grid-cols-2 md:gap-6">
          {[
            {
              title: '그로스 PM',
              content:
                '“계속 미루고 있던 취준을 가장 효과적으로, 빨리 시작할 수 있게 도와주었어요.”',
              imageSrc: '/images/앳홈-384-384.png',
            },
            {
              title: 'B2B 마케터',
              content:
                '“한눈에 들어오는 가독성 있는 포트폴리오를 구성하는 데 큰 도움을 받았어요”',
              imageSrc: '/images/히릿소프트-1024-1024.png',
            },
          ].map((item) => (
            <div
              className="flex gap-5 rounded-md bg-white px-6 py-8 md:p-10"
              key={item.title}
            >
              <div className="flex flex-col gap-6">
                <h3 className="text-small18 md:text-medium24 font-bold">
                  {item.title}
                </h3>
                <p className="text-xsmall14 text-neutral-40 md:text-small18 font-medium">
                  {item.content}
                </p>
              </div>

              <img
                src={item.imageSrc}
                alt="수강생의 회사 이미지"
                className="block h-[105px] w-[105px] flex-none rounded-md bg-gray-100 object-contain md:h-48 md:w-48"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PortfolioIntroWhySection;
