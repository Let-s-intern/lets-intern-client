import { fileType, uploadFile } from '@/api/file';
import { usePostChallengeMutation } from '@/api/program';
import { CreateChallengeReq } from '@/schema';
import { ChallengeContent } from '@/types/interface';
import EditorApp from '@components/admin/lexical/EditorApp';
import ImageUpload from '@components/admin/program/ui/form/ImageUpload';
import Header from '@components/admin/ui/header/Header';
import Heading from '@components/admin/ui/heading/Heading';
import { Heading2 } from '@components/admin/ui/heading/Heading2';
import { Button } from '@mui/material';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import { FaSave } from 'react-icons/fa';
import ChallengeBasic from './program/ChallengeBasic';
import ChallengeCurriculum from './program/ChallengeCurriculum';
import ChallengePrice from './program/ChallengePrice';
import ChallengeSchedule from './program/ChallengeSchedule';
import FaqSection from './program/LiveFaq';

/**
 * 챌린지 생성 페이지
 *
 * - 가격구분은 무조건 BASIC으로 고정
 */
const ChallengeCreate: React.FC = () => {
  const [content, setContent] = useState<ChallengeContent>({
    // mainDescription: ,
    curriculum: [],
    curriculumDesc: '',
    blogReview: '',
    challengeReview: '',
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
  }, [input, content]);

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
        <header>
          <h3>상세 설명</h3>
        </header>
        <main>
          <EditorApp
            onChangeSerializedEditorState={(json) =>
              setContent((prev) => ({
                ...prev,
                mainDescription: json,
              }))
            }
          ></EditorApp>
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
