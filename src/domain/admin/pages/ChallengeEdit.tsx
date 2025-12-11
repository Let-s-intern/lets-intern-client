/* eslint-disable no-console */
'use client';

import { fileType, uploadFile } from '@/api/file';
import {
  useAdminChallengeMentorListQuery,
  useDeleteChallengeMentor,
  usePostAdminChallengeMentor,
} from '@/api/mentor';
import { ChallengeMentorList } from '@/api/mentorSchema';
import {
  useGetChallengeQuery,
  useGetChallengeQueryKey,
  usePatchChallengeMutation,
} from '@/api/program';
import FaqSection from '@/common/FaqSection';
import ProgramRecommendEditor from '@/common/ProgramRecommendEditor';
import ChallengePreviewButton from '@/domain/admin/ChallengePreviewButton';
import EditorApp from '@/domain/admin/lexical/EditorApp';
import ChallengeBasic from '@/domain/admin/program/ChallengeBasic';
import ChallengeCurriculumEditor from '@/domain/admin/program/ChallengeCurriculum';
import ChallengeOptionSection from '@/domain/admin/program/ChallengeOptionSection';
import ChallengePointEditor from '@/domain/admin/program/ChallengePoint';
import ChallengePrice from '@/domain/admin/program/ChallengePrice';
import ProgramBestReview from '@/domain/admin/program/ProgramBestReview';
import ProgramBlogReviewEditor from '@/domain/admin/program/ProgramBlogReviewEditor';
import ImageUpload from '@/domain/admin/program/ui/form/ImageUpload';
import Header from '@/domain/admin/ui/header/Header';
import Heading from '@/domain/admin/ui/heading/Heading';
import Heading2 from '@/domain/admin/ui/heading/Heading2';
import Heading3 from '@/domain/admin/ui/heading/Heading3';
import useAdminChallenge from '@/hooks/useAdminChallenge';
import useAdminChallengeOption from '@/hooks/useAdminChallengeOption';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { isDeprecatedProgram } from '@/lib/isDeprecatedProgram';
import {
  ChallengePricePlanEnum,
  ChallengePriceReq,
  ProgramTypeEnum,
  UpdateChallengeReq,
} from '@/schema';
import { ChallengeContent } from '@/types/interface';
import { Button } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FaSave } from 'react-icons/fa';
import ChallengeFaqCategory from './program/ChallengeFaqCategory';
import ChallengeMentorRegistrationSection from './program/ChallengeMentorRegistrationSection';
import ProgramSchedule from './program/ProgramSchedule';

const { BASIC, STANDARD, PREMIUM } = ChallengePricePlanEnum.enum;

/** 선택 해제된 멘토와 챌린지 연결 삭제 */
const useDeleteDifferMentors = () => {
  const deleteMentorMutation = useDeleteChallengeMentor();

  const getDifferMentorIds = (
    prevMentors: ChallengeMentorList['mentorList'],
    updatedMentorUserIds: number[],
  ) => {
    const result: number[] = [];
    prevMentors.forEach((item) => {
      if (!updatedMentorUserIds.includes(item.userId)) {
        result.push(item.challengeMentorId);
      }
    });
    return result;
  };

  const deleteDifferMentors = useCallback(
    (
      prevMentors: ChallengeMentorList['mentorList'],
      updatedMentorUserIds: number[],
    ) => {
      const differMentors = getDifferMentorIds(
        prevMentors,
        updatedMentorUserIds,
      );
      return differMentors.map((id) => deleteMentorMutation.mutateAsync(id));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return deleteDifferMentors;
};

const ChallengeEdit: React.FC = () => {
  const router = useRouter();
  const client = useQueryClient();
  const { snackbar } = useAdminSnackbar();

  /** 챌린지 관련 상태 */
  const { challengeId: challengeIdString } = useParams<{
    challengeId: string;
  }>();
  const { mutateAsync: patchChallenge } = usePatchChallengeMutation();
  const { data: challenge } = useGetChallengeQuery({
    challengeId: Number(challengeIdString),
    enabled: Boolean(challengeIdString),
    refetchOnWindowFocus: false,
  });
  const { data: challengeMentorData } =
    useAdminChallengeMentorListQuery(challengeIdString);
  const postMentorMutation = usePostAdminChallengeMentor();

  // 멘토 리스트
  const mentorRef = useRef<number[]>([]);

  const deleteDifferMentors = useDeleteDifferMentors();

  const [input, setInput] = useState<Omit<UpdateChallengeReq, 'desc'>>({});
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<ChallengeContent>({
    initialized: false,
    curriculum: [],
    challengePoint: {
      weekText: '2주',
      list: [],
    },
    blogReview: { list: [] },
    challengeReview: [],
    faqCategory: [],
  });

  const defaultBasicPriceInfo = useMemo(() => {
    const basic: ChallengePriceReq = {
      priceInfo: {
        price: challenge?.priceInfo[0].price ?? 0,
        discount: challenge?.priceInfo[0].discount ?? 0,
        accountNumber: challenge?.priceInfo[0].accountNumber,
        accountType: challenge?.priceInfo[0].accountType,
      },
      title: challenge?.priceInfo[0].title ?? '',
      description: challenge?.priceInfo[0].description ?? '',
      charge: challenge?.priceInfo[0].price ?? 0,
      refund: challenge?.priceInfo[0].refund ?? 0,
      challengePriceType:
        challenge?.priceInfo[0].challengePriceType ?? 'CHARGE',
      challengePricePlanType: BASIC,
      challengeParticipationType:
        challenge?.priceInfo[0].challengeParticipationType ?? 'LIVE',
      challengeOptionIdList: [],
    };

    return basic;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [challenge?.priceInfo[0]]);

  const receivedContent = useMemo<ChallengeContent | null>(() => {
    if (!challenge?.desc) {
      return null;
    }

    try {
      return JSON.parse(challenge.desc);
    } catch (e) {
      console.error(e);
      return null;
    }
  }, [challenge?.desc]);

  const { challengePrice } = useAdminChallenge(input);

  /** 챌린지 옵션  */
  const {
    pricePlan,
    data: challengeOptions,
    standardOptIds,
    premiumOptIds,
    standardInfo,
    premiumInfo,
    handleChangeInfo,
    handleChangePricePlan,
    setStandardOptIds,
    setPremiumOptIds,
  } = useAdminChallengeOption(challenge);

  /** 챌린지 관련 함수 */
  const onChangeImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const url = await uploadFile({
      file: e.target.files[0],
      type: fileType.enum.CHALLENGE,
    });
    setInput((prev) => ({
      ...prev,
      [e.target.name]: url,
    }));
  };

  const onClickSave = useCallback(async () => {
    if (!challengeIdString) {
      throw new Error('challengeId is required');
    }

    setLoading(true);

    let basicPriceInfo = defaultBasicPriceInfo;

    if (input.priceInfo) {
      basicPriceInfo = {
        ...basicPriceInfo,
        ...input.priceInfo[0],
        priceInfo: {
          ...basicPriceInfo.priceInfo,
          ...input.priceInfo[0].priceInfo,
        },
      };
    }

    const newPriceInfo = [basicPriceInfo];

    if (pricePlan.current !== BASIC) {
      newPriceInfo.push({
        ...basicPriceInfo,
        ...standardInfo,
        challengePricePlanType: STANDARD,
        challengeOptionIdList: standardOptIds,
      });
    }

    if (pricePlan.current === PREMIUM) {
      newPriceInfo.push({
        ...basicPriceInfo,
        ...premiumInfo,
        challengePricePlanType: PREMIUM,
        challengeOptionIdList: [
          ...new Set(standardOptIds.concat(premiumOptIds)),
        ],
      });
    }

    const req: Parameters<typeof patchChallenge>[0] = {
      ...input,
      challengeId: Number(challengeIdString),
      desc: JSON.stringify(content),
      priceInfo: newPriceInfo,
    };

    console.log('req', req);
    const [res] = await Promise.all([
      patchChallenge(req),
      postMentorMutation.mutateAsync({
        mentorIdList: mentorRef.current,
        challengeId: parseInt(challengeIdString),
      }),
      ...deleteDifferMentors(
        challengeMentorData?.mentorList ?? [],
        mentorRef.current,
      ),
    ]);
    client.invalidateQueries({
      queryKey: [useGetChallengeQueryKey, Number(challengeIdString)],
    });
    console.log('res', res);

    setLoading(false);
    snackbar('저장되었습니다.');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    challengeIdString,
    client,
    content,
    input,
    premiumInfo,
    standardInfo,
    standardOptIds,
    premiumOptIds,
    pricePlan,
    defaultBasicPriceInfo,
    challengeMentorData,
  ]);

  useEffect(() => {
    // receivedConent가 초기화되면 content에 적용
    if (!receivedContent) return;

    setContent((prev) => ({
      ...(prev.initialized ? prev : { ...receivedContent, initialized: true }),
    }));
  }, [receivedContent]);

  useEffect(() => {
    // 구 버전 프로그램인지 판단
    if (challenge && isDeprecatedProgram(challenge)) {
      router.replace(
        `/admin/programs/${challengeIdString}/edit?programType=CHALLENGE`,
      );
    }
  }, [challenge, challengeIdString, router]);

  useEffect(() => {
    // 챌린지 금액 초기 값 설정
    setInput((prev) => ({
      ...prev,
      priceInfo: [defaultBasicPriceInfo],
    }));
  }, [defaultBasicPriceInfo]);

  useEffect(() => {
    // 멘토 초기값 설정
    mentorRef.current =
      challengeMentorData?.mentorList.map((item) => item.userId) ?? [];
  }, [challengeMentorData]);

  if (!challenge || !content.initialized) {
    return <div>loading...</div>;
  }

  return (
    <div className="mx-3 mb-40 mt-3">
      <Header>
        <Heading>챌린지 수정</Heading>
        <div className="flex items-center gap-3">
          <Button
            variant="outlined"
            onClick={async () => {
              await window.navigator.clipboard.writeText(
                JSON.stringify(challenge),
              );
              alert('복사되었습니다.');
            }}
          >
            Export (복사)
          </Button>
        </div>
      </Header>

      <Heading2>기본 정보</Heading2>
      <section className="mb-6 mt-3">
        <div className="mb-6 grid w-full grid-cols-3 gap-3">
          <ChallengeBasic
            className="row-start-1 row-end-3"
            defaultValue={challenge}
            setInput={setInput}
          />
          <ImageUpload
            label="모바일 썸네일 이미지 업로드"
            id="thumbnail"
            name="thumbnail"
            image={input.thumbnail ?? challenge.thumbnail}
            onChange={onChangeImage}
          />
          <ImageUpload
            label="데스크탑 썸네일 이미지 업로드"
            id="desktopThumbnail"
            name="desktopThumbnail"
            image={input.desktopThumbnail ?? challenge.desktopThumbnail}
            onChange={onChangeImage}
          />
        </div>

        <Heading2>가격 정보 & 일정</Heading2>
        <div className="mt-5 grid w-full grid-cols-2 gap-3">
          {/* 가격 정보 */}
          <ChallengePrice
            challengePrice={challengePrice}
            defaultValue={challenge.priceInfo}
            setInput={setInput}
            options={challengeOptions?.challengeOptionList ?? []}
            standardOptIds={standardOptIds}
            premiumOptIds={premiumOptIds}
            standardInfo={standardInfo}
            premiumInfo={premiumInfo}
            pricePlan={pricePlan.current}
            onChangePricePlanInfo={handleChangeInfo}
            onChangePremiumOptIds={(ids) => setPremiumOptIds(ids)}
            onChangeStandardOptIds={(ids) => setStandardOptIds(ids)}
            onChangePricePlan={handleChangePricePlan}
          />
          <div className="flex flex-col gap-4">
            {/* 일정 */}
            <ProgramSchedule
              defaultValue={challenge}
              setInput={setInput}
              onDeadlineChange={(value) => {
                if (!value) {
                  return;
                }

                // TODO: 코드 정리
                setInput((prev) => ({
                  ...prev,
                  priceInfo: prev.priceInfo
                    ? prev.priceInfo.map((priceInfo, index) => ({
                        ...challenge.priceInfo[index],
                        ...priceInfo,
                        priceInfo: {
                          discount:
                            challenge.priceInfo[index]?.discount ??
                            priceInfo.priceInfo.discount,
                          price:
                            challenge.priceInfo[index]?.price ??
                            priceInfo.priceInfo.price,
                          accountNumber:
                            challenge.priceInfo[index]?.accountNumber ??
                            priceInfo.priceInfo.accountNumber,
                          accountType:
                            challenge.priceInfo[index]?.accountType ??
                            priceInfo.priceInfo.accountType,
                          deadline: value.format('YYYY-MM-DDTHH:mm'),
                        },
                      }))
                    : [
                        {
                          challengeParticipationType:
                            challenge.priceInfo[0].challengeParticipationType ??
                            'LIVE',
                          challengePriceType:
                            challenge.priceInfo[0].challengePriceType ??
                            'CHARGE',
                          challengePricePlanType:
                            challenge.priceInfo[0].challengePricePlanType ??
                            'BASIC',
                          charge: challenge.priceInfo[0].price ?? 0,
                          priceInfo: {
                            discount: challenge.priceInfo[0].discount ?? 0,
                            price: challenge.priceInfo[0].price ?? 0,
                            deadline: value.format('YYYY-MM-DDTHH:mm'),
                            accountNumber:
                              challenge.priceInfo[0].accountNumber ?? '',
                            accountType:
                              challenge.priceInfo[0].accountType ?? 'HANA',
                          },
                          refund: challenge.priceInfo[0].refund ?? 0,
                          title: challenge.priceInfo[0].title ?? '',
                        },
                      ],
                }));
              }}
            />
            {/* 멘토 등록 */}
            <ChallengeMentorRegistrationSection
              onChange={(value) => (mentorRef.current = value)}
            />
          </div>
        </div>
      </section>

      <section className="pb-8 pt-4">
        <ChallengeOptionSection
          options={challengeOptions?.challengeOptionList ?? []}
        />
      </section>

      <Heading2>프로그램 소개</Heading2>
      <section>
        <ChallengePointEditor
          challengePoint={content.challengePoint}
          setContent={setContent}
        />

        <Heading3>상세 설명 (특별 챌린지 및 합격자 후기)</Heading3>
        <EditorApp
          initialEditorStateJsonString={JSON.stringify(content.mainDescription)}
          onChangeSerializedEditorState={(json) =>
            setContent((prev) => ({
              ...prev,
              mainDescription: json,
            }))
          }
        />
      </section>

      {/* 프로그램 추천 */}
      <section className="mb-6">
        <ProgramRecommendEditor
          programRecommend={content.programRecommend ?? { list: [] }}
          setProgramRecommend={(programRecommend) =>
            setContent((prev) => ({ ...prev, programRecommend }))
          }
        />
      </section>

      <ChallengeCurriculumEditor
        curriculum={content.curriculum}
        setContent={setContent}
      />

      <ProgramBestReview
        reviewFields={content.challengeReview ?? []}
        setReviewFields={(reviewFields) =>
          setContent((prev) => ({ ...prev, challengeReview: reviewFields }))
        }
      />

      <ProgramBlogReviewEditor
        blogReview={content.blogReview ?? { list: [] }}
        setBlogReview={(blogReview) =>
          setContent((prev) => ({ ...prev, blogReview }))
        }
      />

      <div className="my-6">
        <div className="mb-6">
          <ChallengeFaqCategory
            faqCategory={content.faqCategory}
            onChange={(e) => {
              setContent((prev) => ({
                ...prev,
                faqCategory: e.target.value
                  .split(',')
                  .map((item) => item.trim()),
              }));
            }}
          />
        </div>
        <FaqSection
          programType={ProgramTypeEnum.enum.CHALLENGE}
          faqInfo={
            input.faqInfo ??
            challenge.faqInfo.map((info) => ({ faqId: info.id }))
          }
          setFaqInfo={(faqInfo) =>
            setInput((prev) => ({ ...prev, faqInfo: faqInfo ?? [] }))
          }
        />
      </div>

      <footer className="flex items-center justify-end gap-3">
        <ChallengePreviewButton
          input={input}
          content={content}
          existing={challenge}
        />
        <Button
          variant="contained"
          color="primary"
          disabled={loading}
          startIcon={<FaSave size={12} />}
          onClick={onClickSave}
        >
          저장
        </Button>
      </footer>
    </div>
  );
};

export default ChallengeEdit;
