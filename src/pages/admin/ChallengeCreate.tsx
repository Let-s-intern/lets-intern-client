import { fileType, uploadFile } from '@/api/file';
import { usePostChallengeMutation } from '@/api/program';
import { CreateChallengeReq } from '@/schema';
import { ChallengeContent } from '@/types/interface';
import ChallengePreviewButton from '@components/admin/ChallengePreviewButton';
import EditorApp from '@components/admin/lexical/EditorApp';
import ImageUpload from '@components/admin/program/ui/form/ImageUpload';
import Header from '@components/admin/ui/header/Header';
import Heading from '@components/admin/ui/heading/Heading';
import { Heading2 } from '@components/admin/ui/heading/Heading2';
import Heading3 from '@components/admin/ui/heading/Heading3';
import { Button } from '@mui/material';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import { FaSave } from 'react-icons/fa';
import ChallengeBasic from './program/ChallengeBasic';
import ChallengeCurriculum from './program/ChallengeCurriculum';
import ChallengePoint from './program/ChallengePoint';
import ChallengePrice from './program/ChallengePrice';
import FaqSection from './program/FaqSection';
import ProgramBlogReviewEditor from './program/ProgramBlogReviewEditor';
import ProgramSchedule from './program/ProgramSchedule';

/**
 * 챌린지 생성 페이지
 *
 * - 가격구분은 무조건 BASIC으로 고정
 */
const ChallengeCreate: React.FC = () => {
  const [content, setContent] = useState<ChallengeContent>({
    curriculum: [],
    challengePoint: { list: [] },
    blogReview: { list: [] },
    challengeReview: '',
    initialized: true,
  });

  useEffect(() => {
    console.log('content', content);
  }, [content]);

  const { mutateAsync: postChallenge } = usePostChallengeMutation();

  const [input, setInput] = useState<Omit<CreateChallengeReq, 'desc'>>({
    beginning: dayjs().format('YYYY-MM-DDTHH:mm'),
    challengeType: 'CAREER_START',
    chatLink: '',
    chatPassword: '',
    criticalNotice: '',
    deadline: dayjs().format('YYYY-MM-DDTHH:mm'),
    endDate: dayjs().format('YYYY-MM-DDTHH:mm'),
    faqInfo: [],
    participationCount: 0,
    programTypeInfo: [],
    priceInfo: [
      {
        priceInfo: {
          price: 10000,
          discount: 4000,
        },
        charge: 10000,
        refund: 0,
        challengePriceType: 'CHARGE',
        challengeUserType: 'BASIC',
        challengeParticipationType: 'LIVE',
      },
    ],
    shortDesc: '',
    startDate: dayjs().format('YYYY-MM-DDTHH:mm'),
    thumbnail: '',
    title: '',
  });

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
    setLoading(true);
    const req: CreateChallengeReq = {
      ...input,
      desc: JSON.stringify(content),
    };
    console.log('req', req);
    const res = await postChallenge(req);
    console.log('res', res);

    setLoading(false);
  }, [input, content, postChallenge]);

  return (
    <div className="mx-3 mb-40 mt-3">
      <Header>
        <Heading>챌린지 생성</Heading>
      </Header>

      <Heading2>기본 정보</Heading2>
      <section className="mb-6 mt-3">
        <div className="mb-6 grid w-full grid-cols-2 gap-3">
          <ChallengeBasic
            defaultValue={{
              ...input,
              classificationInfo: input.programTypeInfo.map((info) => ({
                programClassification:
                  info.classificationInfo.programClassification,
              })),
              priceInfo: input.priceInfo.map((info) => ({
                ...info,
                deadline: info.priceInfo.deadline
                  ? dayjs(info.priceInfo.deadline)
                  : null,
                priceId: 0,
              })),
            }}
            setInput={setInput}
          />
          <ImageUpload
            label="챌린지 썸네일 이미지 업로드"
            id="thumbnail"
            name="thumbnail"
            onChange={onChangeImage}
          />
        </div>
        <div className="grid w-full grid-cols-2 gap-3">
          <ChallengePrice setInput={setInput} />
          <ProgramSchedule setInput={setInput} />
        </div>
      </section>

      <Heading2>프로그램 소개</Heading2>
      <section>
        <ChallengePoint
          challengePoint={content.challengePoint}
          setContent={setContent}
        />

        <Heading3>상세 설명</Heading3>
        <EditorApp
          onChangeSerializedEditorState={(json) =>
            setContent((prev) => ({
              ...prev,
              mainDescription: json,
            }))
          }
        ></EditorApp>
      </section>

      <ChallengeCurriculum
        curriculum={content.curriculum}
        setContent={setContent}
      />

      <ProgramBlogReviewEditor
        blogReview={content.blogReview || { list: [] }}
        setBlogReview={(blogReview) =>
          setContent((prev) => ({ ...prev, blogReview }))
        }
      />

      <div className="my-6">
        <FaqSection
          programType="CHALLENGE"
          faqInfo={input.faqInfo}
          setInput={setInput}
        />
      </div>

      <footer className="flex items-center justify-end gap-3">
        <ChallengePreviewButton
          input={input}
          content={content}
          existing={null}
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

export default ChallengeCreate;
