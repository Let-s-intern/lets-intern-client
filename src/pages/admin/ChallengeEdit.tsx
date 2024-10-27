import { fileType, uploadFile } from '@/api/file';
import { useGetChallengeQuery, usePatchChallengeMutation } from '@/api/program';
import isDeprecatedProgram from '@/lib/isDeprecatedProgram';
import { UpdateChallengeReq } from '@/schema';
import { ChallengeContent } from '@/types/interface';
import ChallengePreviewButton from '@components/admin/ChallengePreviewButton';
import EditorApp from '@components/admin/lexical/EditorApp';
import ImageUpload from '@components/admin/program/ui/form/ImageUpload';
import Header from '@components/admin/ui/header/Header';
import Heading from '@components/admin/ui/heading/Heading';
import { Heading2 } from '@components/admin/ui/heading/Heading2';
import Heading3 from '@components/admin/ui/heading/Heading3';
import { Button } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FaSave } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import ChallengeBasic from './program/ChallengeBasic';
import ChallengeCurriculum from './program/ChallengeCurriculum';
import ChallengePoint from './program/ChallengePoint';
import ChallengePrice from './program/ChallengePrice';
import ChallengeSchedule from './program/ChallengeSchedule';
import FaqSection from './program/FaqSection';

const ChallengeEdit: React.FC = () => {
  const [content, setContent] = useState<ChallengeContent>({
    curriculum: [],
    challengePoint: [],
    blogReview: '',
    challengeReview: '',
  });

  const { mutateAsync: patchChallenge } = usePatchChallengeMutation();
  const navigate = useNavigate();
  const { challengeId: challengeIdString } = useParams();

  const { data: challenge } = useGetChallengeQuery({
    challengeId: Number(challengeIdString),
    enabled: Boolean(challengeIdString),
  });

  const receivedContent = useMemo<ChallengeContent>(() => {
    if (!challenge?.desc) {
      return {};
    }
    try {
      return JSON.parse(challenge.desc);
    } catch (e) {
      console.error(e);
      return {};
    }
  }, [challenge?.desc]);

  useEffect(() => {
    if (challenge && isDeprecatedProgram(challenge)) {
      navigate(
        `/admin/programs/${challengeIdString}/edit?programType=CHALLENGE`,
        {
          replace: true,
        },
      );
    }
  }, [challenge, challengeIdString, navigate]);

  const [input, setInput] = useState<Omit<UpdateChallengeReq, 'desc'>>({});
  const [loading, setLoading] = useState(false);

  const onChangeImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const url = await uploadFile({
      file: e.target.files[0],
      type: fileType.enum.CHALLENGE,
    });
    setInput((prev) => ({ ...prev, [e.target.name]: url }));
  };

  const onClickSave = useCallback(async () => {
    if (!challengeIdString) {
      throw new Error('challengeId is required');
    }

    setLoading(true);
    const req: Parameters<typeof patchChallenge>[0] = {
      ...input,
      challengeId: Number(challengeIdString),
      desc: JSON.stringify(content),
    };

    const res = await patchChallenge(req);
    console.log('res', res);

    setLoading(false);
  }, [challengeIdString, content, input, patchChallenge]);

  /* challenge로 Input, content 초기화 */
  useEffect(() => {
    if (!challenge) return;

    const {
      title,
      desc,
      shortDesc,
      criticalNotice,
      participationCount,
      thumbnail,
      startDate,
      endDate,
      beginning,
      deadline,
      chatLink,
      chatPassword,
      challengeType,
      classificationInfo,
      priceInfo,
      faqInfo,
    } = challenge;

    const {
      discount,
      price,
      refund,
      challengePriceType,
      challengeUserType,
      challengeParticipationType,
      accountNumber,
      accountType,
    } = priceInfo[0];

    const initial = {
      title,
      shortDesc,
      criticalNotice,
      participationCount,
      thumbnail,
      startDate: startDate?.format('YYYY-MM-DDTHH:mm:ss'),
      endDate: endDate?.format('YYYY-MM-DDTHH:mm:ss'),
      beginning: beginning?.format('YYYY-MM-DDTHH:mm:ss'),
      deadline: deadline?.format('YYYY-MM-DDTHH:mm:ss'),
      chatLink,
      chatPassword,
      challengeType,
      programTypeInfo: classificationInfo.map((info) => ({
        classificationInfo: {
          programClassification: info.programClassification,
        },
      })),
      priceInfo: [
        {
          priceInfo: {
            price: price ?? 0,
            discount: discount ?? 0,
            accountNumber: accountNumber ?? '',
            deadline: priceInfo[0].deadline?.format('YYYY-MM-DDTHH:mm:ss'),
            accountType: accountType ?? undefined,
          },
          charge: price ?? 0,
          refund: refund ?? 0,
          challengePriceType: challengePriceType ?? 'CHARGE',
          challengeUserType: challengeUserType ?? 'BASIC',
          challengeParticipationType: challengeParticipationType ?? 'LIVE',
        },
      ],
      faqInfo: faqInfo.map((info) => ({ faqId: info.id })),
    };

    setInput(initial);
    setContent(JSON.parse(desc ?? '{}'));
  }, [challenge]);

  if (!challenge) {
    return <div>loading...</div>;
  }

  return (
    <div className="mx-3 mb-40 mt-3">
      <Header>
        <Heading>챌린지 생성</Heading>
      </Header>

      <Heading2>기본 정보</Heading2>
      <section className="mb-6 mt-3">
        <div className="mb-6 grid w-full grid-cols-2 gap-3">
          <ChallengeBasic input={input} setInput={setInput} />
          <ImageUpload
            label="챌린지 썸네일 이미지 업로드"
            id="thumbnail"
            name="thumbnail"
            image={input.thumbnail}
            onChange={onChangeImage}
          />
        </div>
        <div className="grid w-full grid-cols-2 gap-3">
          <ChallengePrice input={input} setInput={setInput} />
          <ChallengeSchedule input={input} setInput={setInput} />
        </div>
      </section>

      <Heading2>프로그램 소개</Heading2>
      <section>
        <ChallengePoint
          challengePoint={content.challengePoint}
          setContent={setContent}
        />

        <Heading3>상세 설명</Heading3>
        <main>
          <EditorApp
            initialEditorStateJsonString={JSON.stringify(
              receivedContent.mainDescription,
            )}
            onChangeSerializedEditorState={(json) =>
              setContent((prev) => ({
                ...prev,
                mainDescription: json,
              }))
            }
          />
        </main>
      </section>

      <ChallengeCurriculum
        curriculum={content.curriculum}
        setContent={setContent}
      />

      <div className="my-6">
        <FaqSection
          programType="CHALLENGE"
          faqInfo={input.faqInfo}
          setInput={setInput}
        />
      </div>

      <footer className="flex items-center justify-end gap-3">
        <ChallengePreviewButton input={input} content={content} existing={challenge} />
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
