import { fileType, uploadFile } from '@/api/file';
import {
  useGetChallengeQuery,
  useGetChallengeQueryKey,
  usePatchChallengeMutation,
} from '@/api/program';
import ChallengeBasic from '@/components/admin/program/ChallengeBasic';
import ChallengeCurriculumEditor from '@/components/admin/program/ChallengeCurriculum';
import ChallengePointEditor from '@/components/admin/program/ChallengePoint';
import ChallengePrice from '@/components/admin/program/ChallengePrice';
import ProgramBestReview from '@/components/admin/program/ProgramBestReview';
import ProgramBlogReviewEditor from '@/components/admin/program/ProgramBlogReviewEditor';
import FaqSection from '@/components/FaqSection';
import ProgramRecommendEditor from '@/components/ProgramRecommendEditor';
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
import ChallengePreviewButton from '@components/admin/ChallengePreviewButton';
import EditorApp from '@components/admin/lexical/EditorApp';
import ChallengeOptionSection from '@components/admin/program/ChallengeOptionSection';
import ImageUpload from '@components/admin/program/ui/form/ImageUpload';
import Header from '@components/admin/ui/header/Header';
import Heading from '@components/admin/ui/heading/Heading';
import Heading2 from '@components/admin/ui/heading/Heading2';
import Heading3 from '@components/admin/ui/heading/Heading3';
import { Button } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FaSave } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import ChallengeFaqCategory from './program/ChallengeFaqCategory';
import ChallengeMentorRegistrationSection from './program/ChallengeMentorRegistrationSection';
import ProgramSchedule from './program/ProgramSchedule';

const { BASIC, STANDARD, PREMIUM } = ChallengePricePlanEnum.enum;

const ChallengeEdit: React.FC = () => {
  const navigate = useNavigate();
  const client = useQueryClient();
  const { snackbar } = useAdminSnackbar();

  /** 챌린지 관련 상태 */
  const { challengeId: challengeIdString } = useParams();
  const { mutateAsync: patchChallenge } = usePatchChallengeMutation();
  const { data: challenge } = useGetChallengeQuery({
    challengeId: Number(challengeIdString),
    enabled: Boolean(challengeIdString),
    refetchOnWindowFocus: false,
  });

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

    const res = await patchChallenge(req);
    client.invalidateQueries({
      queryKey: [useGetChallengeQueryKey, Number(challengeIdString)],
    });
    console.log('res', res);

    setLoading(false);
    snackbar('저장되었습니다.');
  }, [
    challengeIdString,
    client,
    content,
    input,
    patchChallenge,
    snackbar,
    premiumInfo,
    standardInfo,
    standardOptIds,
    premiumOptIds,
    pricePlan,
    defaultBasicPriceInfo,
  ]);

  useEffect(() => {
    // receivedConent가 초기화되면 content에 적용
    if (!receivedContent) {
      return;
    }

    setContent((prev) => ({
      ...(prev.initialized ? prev : { ...receivedContent, initialized: true }),
    }));
  }, [receivedContent]);

  useEffect(() => {
    // 구 버전 프로그램인지 판단
    if (challenge && isDeprecatedProgram(challenge)) {
      navigate(
        `/admin/programs/${challengeIdString}/edit?programType=CHALLENGE`,
        { replace: true },
      );
    }
  }, [challenge, challengeIdString, navigate]);

  useEffect(() => {
    // 챌린지 금액 초기 값 설정
    setInput((prev) => ({
      ...prev,
      priceInfo: [defaultBasicPriceInfo],
    }));
  }, [defaultBasicPriceInfo]);

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
              challengeId={Number(challengeIdString)}
              // todo: useCallback 사용하여 change handler 작성
              onChange={(value) => console.log('멘토 등록')}
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
