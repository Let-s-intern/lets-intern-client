'use client';

import {
  useGetActiveChallenge,
  useGetChallengeFaq,
} from '@/api/challenge/challenge';
import ChallengeCurriculum from '@/domain/program/challenge/challenge-view/ChallengeCurriculum';
import ChallengeFaq from '@/domain/program/challenge/challenge-view/ChallengeFaq';
import dayjs from '@/lib/dayjs';
import { twMerge } from '@/lib/twMerge';
import {
  ChallengeIdPrimitive,
  ChallengeIdSchema,
  challengeTypeSchema,
} from '@/schema';
import useProgramStore from '@/store/useProgramStore';
import { ChallengeContent } from '@/types/interface';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { Break } from '../../../common/Break';
import SectionSubHeader from '../../../common/header/SectionSubHeader';
import {
  PROGRAM_CURRICULUM_ID,
  PROGRAM_INTRO_ID,
  PROGRAM_REVIEW_ID,
} from '../../program/ProgramDetailNavigation';
import Heading2 from '../../report/Heading2';
import Description from '../program-detail/Description';
import ProgramBestReviewSection from '../ProgramBestReviewSection';
import ChallengeBasicInfo from './challenge-view/ChallengeBasicInfo';
import ChallengeBrand from './challenge-view/ChallengeBrand';
import ChallengeInfoBottom from './challenge-view/ChallengeInfoBottom';
import ChallengeIntroEditorContent from './challenge-view/ChallengeIntroEditorContent';
import ChallengeIntroPortfolio from './challenge-view/ChallengeIntroPortfolio';
import ChallengePricePlanSection from './challenge-view/ChallengePricePlanSection';
import ChallengeResult from './challenge-view/ChallengeResult';
import PortfolioFeedbackInfo from './portfolio-view/PortfolioFeedbackInfo';
import PortfolioIntroCheckList from './portfolio-view/PortfolioIntroCheckList';
import PortfolioOneOnOne from './portfolio-view/PortfolioOneOnOne';
import Portfolio다른프로그램추천 from './portfolio-view/Portfolio다른프로그램추천';
import ProgramChallengePortfolioDetailBlogReviewSection from './portfolio-view/ProgramChallengePortfolioDetailBlogReviewSection';
import ProgramChallengePortfolioDetailNavigation, {
  CHALLENGE_PRICE_ID,
} from './portfolio-view/ProgramChallengePortfolioDetailNavigation';
import MainTitle from './ui/MainTitle';

const {
  CAREER_START,
  PORTFOLIO,
  PERSONAL_STATEMENT,
  PERSONAL_STATEMENT_LARGE_CORP,
  EXPERIENCE_SUMMARY,
  ETC,
} = challengeTypeSchema.enum;

export const challengeColors = {
  _4D55F5: '#4D55F5',
  E45BFF: '#E45BFF',
  F3F4FF: '#F3F4FF',
  FDF6FF: '#FDF6FF',
  _763CFF: '#763CFF',
  _1A1D5F: '#1A1D5F',
  _757BFF: '#757BFF',
  _5C63FF: '#5C63FF',
  _222A7E: '#222A7E',
  _111449: '#111449',
  F2F2F5: '#F2F2F5',
  E8EAFF: '#E8EAFF',
  EDEEFE: '#EDEEFE',
  _4A76FF: '#4A76FF',
  F8AE00: '#F8AE00',
  F0F4FF: '#F0F4FF',
  FFF9EA: '#FFF9EA',
  _4A56FF: '#4A56FF',
  _1A2A5D: '#1A2A5D',
  F3F3F3: '#F3F3F3',
  DEE7FF: '#DEE7FF',
  FFF4DB: '#FFF4DB',
  _14BCFF: '#14BCFF',
  _32B750: '#32B750',
  FF9C34: '#FF9C34',
  EEFAFF: '#EEFAFF',
  FFF7EF: '#FFF7EF',
  _39DEFF: '#39DEFF',
  _20304F: '#20304F',
  EFF4F7: '#EFF4F7',
  F1FBFF: '#F1FBFF',
  DDF5FF: '#DDF5FF',
  E6F9DE: '#E6F9DE',
  F26646: '#F26646',
  FFF6F4: '#FFF6F4',
  EB7900: '#EB7900',
  FF8E36: '#FF8E36 ',
  FFC6B9: '#FFC6B9',
  FFF0ED: '#FFF0ED',
  FB8100: '#FB8100',
  _202776: '#202776',
  FFC8BC: '#FFC8BC',
  _261F1E: '#261F1E',
  ADC3FF: '#ADC3FF',
  B8BBFB: '#B8BBFB',
  A8E6FF: '#A8E6FF',
};

export type ChallengeColor = {
  primary: string;
  basicInfoPrimary?: string | null;
  primaryLight: string;
  secondary: string;
  secondaryLight: string;
  gradient: string;
  dark: string;
  subTitle: string;
  subBg: string;
  gradientBg: string;
  curriculumBg: string;
  recommendBg: string;
  recommendLogo: string;
  thumbnailBg: string;
};

const ChallengePortfolioView: React.FC<{
  challenge: ChallengeIdPrimitive;
  isPreview?: boolean;
}> = ({ challenge, isPreview }) => {
  const { id } = useParams<{ id: string }>();
  const isResumeTemplate = useMemo(() => {
    return Number(id) >= 143 && challenge.challengeType === CAREER_START;
  }, [challenge.challengeType, id]);

  const { initProgramApplicationForm } = useProgramStore();

  useEffect(() => {
    initProgramApplicationForm();
  }, [initProgramApplicationForm]);

  const { data: activeChallengeList } = useGetActiveChallenge(
    challenge.challengeType,
  );

  const { data: faqData, isLoading: faqIsLoading } = useGetChallengeFaq(
    id ?? '',
  );

  const receivedContent = useMemo<ChallengeContent>(() => {
    if (!challenge?.desc) {
      return { initialized: false };
    }
    try {
      return JSON.parse(challenge.desc);
    } catch (e) {
      console.error(e);
      return { initialized: false };
    }
  }, [challenge.desc]);

  const reviewExists =
    (receivedContent.challengeReview ?? []).length > 0 &&
    receivedContent.blogReview;

  const challengeTransformed = useMemo<ChallengeIdSchema>(() => {
    return {
      ...challenge,
      startDate: challenge.startDate ? dayjs(challenge.startDate) : null,
      endDate: challenge.endDate ? dayjs(challenge.endDate) : null,
      beginning: challenge.beginning ? dayjs(challenge.beginning) : null,
      deadline: challenge.deadline ? dayjs(challenge.deadline) : null,
      priceInfo: challenge.priceInfo.map((price) => ({
        ...price,
        deadline: price.deadline ? dayjs(price.deadline) : null,
      })),
    };
  }, [challenge]);

  const styles = useMemo(() => {
    switch (challenge.challengeType) {
      case CAREER_START:
        return {
          moreReviewMainColor: challengeColors._1A1D5F,
          moreReviewSubColor: challengeColors.E45BFF,
          curriculumBgColor: challengeColors.F2F2F5,
        };
      case PORTFOLIO:
        return {
          moreReviewMainColor: challengeColors._1A2A5D,
          moreReviewSubColor: challengeColors.F8AE00,
          curriculumBgColor: challengeColors.F3F3F3,
        };
      case PERSONAL_STATEMENT_LARGE_CORP:
        return {
          moreReviewMainColor: challengeColors._20304F,
          moreReviewSubColor: challengeColors.FF9C34,
          curriculumBgColor: challengeColors.EFF4F7,
        };
      case EXPERIENCE_SUMMARY:
        return {
          moreReviewMainColor: challengeColors._202776,
          moreReviewSubColor: challengeColors.FB8100,
          curriculumBgColor: challengeColors.F2F2F5,
        };
      case ETC:
        return {
          moreReviewMainColor: challengeColors._202776,
          moreReviewSubColor: challengeColors.FB8100,
          curriculumBgColor: challengeColors.F2F2F5,
        };
      default:
        return {
          moreReviewMainColor: challengeColors._20304F,
          moreReviewSubColor: challengeColors.FF9C34,
          curriculumBgColor: challengeColors.EFF4F7,
        };
    }
  }, [challenge.challengeType]);

  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full flex-col items-center">
        <div className="flex w-full max-w-[1000px] flex-col px-5 pb-10 pt-6 md:gap-y-5 md:px-10 md:py-[60px] lg:px-0">
          <ChallengeBasicInfo
            challengeId={id}
            challenge={challengeTransformed}
            activeChallengeList={activeChallengeList?.challengeList}
          />
        </div>

        <ProgramChallengePortfolioDetailNavigation
          challengeType={challenge.challengeType}
          programType="challenge"
          className={twMerge(isPreview && 'top-0 md:top-0 lg:top-0')}
          isReady={!faqIsLoading}
        />

        <div
          id={PROGRAM_INTRO_ID}
          className="flex w-full flex-col items-center overflow-x-hidden"
        >
          {/* LEXICAL */}
          {/* 상세설명 렉시컬에서 인트로 렉시컬로 변경 */}
          <ChallengeIntroEditorContent challenge={challenge} />

          <div className="flex w-full flex-col items-center overflow-x-hidden bg-gradient-to-t from-[#F0F4FF] to-white">
            <section className="flex w-full max-w-[1000px] flex-col px-5 pt-20 md:px-10 md:pt-40 lg:px-0">
              <Heading2 className="text-small20 md:text-center md:text-xlarge28">
                <span className="text-[#4A76FF]">포트폴리오</span>, 시간 많이
                들여야 할 정도로 중요한가요?
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
                        마케팅, BM 직무의 경우 필수는 아니나{' '}
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
                    <h3 className="text-small18 font-bold md:text-medium24">
                      {item.title}
                    </h3>
                    <p className="break-keep text-xsmall16 font-medium text-neutral-40 md:text-small18">
                      {item.content}
                    </p>
                  </div>
                ))}
              </div>

              <Heading2 className="mt-10 break-keep text-small20 md:mt-32 md:text-center md:text-xlarge28">
                그리고 이런{' '}
                <span style={{ color: challengeColors._4A76FF }}>
                  수강생들의 후기 100+개가 인증
                </span>
                하는
                <Break />
                렛츠커리어 포트폴리오 2주 완성 챌린지!
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
                <div className="h-1 w-1 rounded-full bg-neutral-45"></div>
                <div className="h-1 w-1 rounded-full bg-neutral-30"></div>
                <div className="h-1 w-1 rounded-full bg-neutral-0"></div>
              </div>

              <p className="mt-2 text-left text-medium22 font-bold md:text-center md:text-medium24">
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
                      <h3 className="text-small18 font-bold md:text-medium24">
                        {item.title}
                      </h3>
                      <p className="text-xsmall14 font-medium text-neutral-40 md:text-small18">
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

          <PortfolioIntroCheckList
            challengeId={Number(id)}
            isResumeTemplate={isResumeTemplate}
            challengeType={challenge.challengeType}
            challengeTitle={challenge.title ?? ''}
          />

          <section className="flex w-full flex-col items-center pt-[70px] md:pt-40">
            <Portfolio다른프로그램추천
              challengeType={challenge.challengeType}
              point={receivedContent.challengePoint}
              startDate={dayjs(challenge.startDate)}
              endDate={dayjs(challenge.endDate)}
              challengeTitle={challenge.title ?? ''}
              programRecommend={receivedContent.programRecommend}
              deposit={challenge.priceInfo[0].refund ?? 0}
              challengeId={Number(id)}
              isResumeTemplate={isResumeTemplate}
            />
          </section>
        </div>

        <div
          id={PROGRAM_CURRICULUM_ID}
          className="flex w-full flex-col items-center overflow-x-hidden"
        >
          {/* 커리큘럼 */}
          {receivedContent.curriculum &&
            receivedContent.curriculum.length > 0 && (
              <section
                id={PROGRAM_CURRICULUM_ID}
                className="challenge_curriculum flex w-full flex-col items-center"
                style={{ backgroundColor: styles.curriculumBgColor }}
              >
                <ChallengeCurriculum
                  challengeType={challenge.challengeType}
                  curriculum={receivedContent.curriculum}
                  challengeTitle={challenge.title ?? ''}
                />
              </section>
            )}

          {/* {(challenge.challengeType === PORTFOLIO ||
              challenge.challengeType === PERSONAL_STATEMENT) && (
              <ChallengeFeedbackUI challengeType={challenge.challengeType} />
            )} */}
          <section className="flex w-full flex-col md:items-center">
            {/* {challenge.challengeType === PORTFOLIO ? (
                
              ) : challenge.challengeType === CAREER_START ? (
                <ChallengeIntroCareerStart
                  isResumeTemplate={isResumeTemplate}
                  challengeType={challenge.challengeType}
                  challengeTitle={challenge.title ?? ''}
                  weekText={receivedContent.challengePoint.weekText}
                />
              ) : challenge.challengeType === EXPERIENCE_SUMMARY ||
                challenge.challengeType === ETC ? (
                <ChallengeIntroExpericeSummary
                  challengeType={challenge.challengeType}
                />
              ) : (
                <ChallengeIntroPersonalStatement />
              )} */}
            <ChallengeIntroPortfolio />
          </section>
        </div>

        <div
          className="flex w-full flex-col items-center"
          id={CHALLENGE_PRICE_ID}
        >
          {/* 가격 플랜 */}
          {challenge.priceInfo.length >= 2 && (
            <ChallengePricePlanSection
              challengeType={challenge.challengeType}
              priceInfoList={challenge.priceInfo}
            />
          )}

          {/* 이제 진짜 만들기 시작해야 하는데... */}
          <section className="w-full bg-[#4A76FF] px-5 py-20 md:px-10 md:py-32 lg:px-0">
            <div className="mb-[30px] flex flex-col items-start gap-2 md:mb-[50px] md:items-center md:gap-3">
              <SectionSubHeader className="text-left font-normal text-white md:text-center">
                이젠 진짜 만들기 시작해야하는데...
              </SectionSubHeader>
              <MainTitle className="text-left text-white md:text-center">
                필수 서류 중 하나인 포폴, <br className="md:hidden" />
                혼자 만들 때 어떠셨나요?
              </MainTitle>
            </div>

            <div className="mx-auto flex w-full max-w-[1000px] flex-col items-stretch gap-3 max-md:max-w-full md:flex-row md:px-0">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {[
                  {
                    icon: '😨',
                    content:
                      '경험을 많이 보여주는 것과 하나를 자세히 적는 것 중 어떤게 더 좋은 구성인지 모르겠어요ㅠㅠ',
                  },
                  {
                    icon: '😭',
                    content:
                      '실질적인 성과가 없는 활동이라 매력적으로 보이지 않을까 걱정이에요.',
                  },
                  {
                    icon: '😥',
                    content:
                      '포폴 가독성이 좋은지, 설득력 있게 전개되는지 확신이 없어요...! ',
                  },
                ].map((item) => (
                  <div
                    key={item.content}
                    className="flex items-center gap-5 rounded-md bg-white px-6 py-4 text-left md:flex-col md:px-8 md:py-5 md:text-center"
                  >
                    <p className="text-xxlarge36">{item.icon}</p>
                    <p className="break-keep text-xsmall16 font-medium">
                      {item.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <Image
            src="/images/퍼렁블록-말꼬리표-322-60.svg"
            alt="퍼렁블록 말꼬리표 이미지"
            unoptimized
            width={322}
            height={60}
            className="mx-auto block object-cover"
          />

          <PortfolioOneOnOne
            isResumeTemplate={isResumeTemplate}
            challengeTitle={challenge.title ?? ''}
            challengeType={challenge.challengeType}
            deposit={challenge.priceInfo[0].refund ?? 0}
          />

          <PortfolioFeedbackInfo />

          <ChallengeResult
            isResumeTemplate={isResumeTemplate}
            challengeType={challenge.challengeType}
            challengeTitle={challenge.title ?? ''}
          />

          {receivedContent.blogReview && (
            <ProgramChallengePortfolioDetailBlogReviewSection
              review={receivedContent.blogReview}
              programType="challenge"
            />
          )}

          {/* <ChallengeSummarySection
              challengeType={challenge.challengeType}
              isResumeTemplate={isResumeTemplate}
            /> */}

          {/* 차별점 */}
          {/* <div
            id={CHALLENGE_DIFFERENT_ID}
            className="challenge_difference flex w-full max-w-[1000px] flex-col px-5 md:px-10 lg:px-0"
          >
            <ChallengeDifferent
              isResumeTemplate={isResumeTemplate}
              challengeTitle={challenge.title ?? ''}
              challengeType={challenge.challengeType}
              deposit={challenge.priceInfo[0].refund ?? 0}
            />
            <ChallengeBrand challengeType={challenge.challengeType} />
          </div> */}
        </div>

        {/* 후기 섹션 */}
        <div
          className="flex w-full flex-col items-center"
          id={PROGRAM_REVIEW_ID}
        >
          {reviewExists && (
            <section className="challenge_review flex w-full flex-col items-center gap-y-[70px] md:gap-y-40">
              {(receivedContent.challengeReview ?? []).length > 0 &&
                receivedContent.blogReview && (
                  <div className="flex w-full flex-col items-center bg-neutral-95 py-[70px] md:py-[110px]">
                    <ProgramBestReviewSection
                      type="challenge"
                      reviews={receivedContent.challengeReview}
                      challengeType={challenge.challengeType}
                    />
                    {/* <MoreReviewButton
                      type="CHALLENGE"
                      challengeType={challenge.challengeType}
                      mainColor={styles.moreReviewMainColor}
                      subColor={styles.moreReviewSubColor}
                    /> */}
                  </div>
                )}
            </section>
          )}

          <section className="-mb-20 mt-10 flex w-full max-w-[1000px] flex-col items-center px-5 md:-mb-40 md:gap-y-40 md:px-10 lg:px-0">
            <ChallengeBrand challengeType={challenge.challengeType} />
          </section>

          {/* <div className="flex w-full flex-col items-center py-[70px] md:py-[110px]">
            <section className="flex w-full max-w-[1000px] flex-col items-center gap-y-[70px] px-5 md:gap-y-40 md:px-10 lg:px-0">
              <Heading2 className="text-small20 md:text-center md:text-xlarge28">
                취업 준비의 든든한 지원군,
                <Break />
                <span className="text-[#4A76FF]">렛츠커리어</span>와 함께 하세요
              </Heading2>
              <div className="grid w-full grid-cols-2 gap-16 md:grid-cols-3">
                {[
                  {
                    title: '누적 참여자 수',
                    point: '2,000+명',
                  },
                  {
                    title: '챌린지 평균 수료율',
                    point: '75+%',
                  },
                  {
                    title: '참여자 만족도',
                    point: '4.9점',
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="border-t-[3px] border-[#4A76FF] pt-4"
                  >
                    <p className="mb-1 text-small18 font-semibold">
                      {item.title}
                    </p>
                    <p className="text-xlarge28 font-bold">{item.point}</p>
                  </div>
                ))}
              </div>
            </section>
          </div> */}
        </div>
        <ChallengeFaq
          faqData={faqData}
          challengeType={challenge.challengeType}
          faqCategory={receivedContent.faqCategory}
        />
        <ChallengeInfoBottom challenge={challengeTransformed} />
      </div>
    </div>
  );
};

export default ChallengePortfolioView;
