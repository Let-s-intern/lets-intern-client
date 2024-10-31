import { fileType, uploadFile } from '@/api/file';
import { useGetChallengeQuery, usePatchChallengeMutation } from '@/api/program';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { isDeprecatedProgram } from '@/lib/isDeprecatedProgram';
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
import ChallengeCurriculumEditor from './program/ChallengeCurriculum';
import ChallengePointEditor from './program/ChallengePoint';
import ChallengePrice from './program/ChallengePrice';
import FaqSection from './program/FaqSection';
import ProgramBlogReviewEditor from './program/ProgramBlogReviewEditor';
import ProgramSchedule from './program/ProgramSchedule';

const ChallengeEdit: React.FC = () => {
  const [content, setContent] = useState<ChallengeContent>({
    initialized: false,
    curriculum: [],
    challengePoint: {
      weekText: '2주',
      list: [],
    },
    blogReview: { list: [] },
    challengeReview: '',
  });

  const { mutateAsync: patchChallenge } = usePatchChallengeMutation();
  const navigate = useNavigate();
  const { challengeId: challengeIdString } = useParams();

  const { data: challenge } = useGetChallengeQuery({
    challengeId: Number(challengeIdString),
    enabled: Boolean(challengeIdString),
  });

  useEffect(() => {
    if (challenge && isDeprecatedProgram(challenge)) {
      navigate(
        `/admin/programs/${challengeIdString}/edit?programType=CHALLENGE`,
        { replace: true },
      );
    }
  }, [challenge, challengeIdString, navigate]);

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

  // receivedConent가 초기화되면 content에 적용
  useEffect(() => {
    if (!receivedContent) {
      return;
    }

    setContent((prev) => ({
      ...(prev.initialized ? prev : { ...receivedContent, initialized: true }),
    }));
  }, [receivedContent]);

  const [input, setInput] = useState<Omit<UpdateChallengeReq, 'desc'>>({});
  const [loading, setLoading] = useState(false);
  const { snackbar } = useAdminSnackbar();

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

    console.log('req', req);

    const res = await patchChallenge(req);
    console.log('res', res);

    setLoading(false);
    snackbar('저장되었습니다.');
  }, [challengeIdString, content, input, patchChallenge, snackbar]);

  if (!challenge || !content.initialized) {
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
          <ChallengeBasic defaultValue={challenge} setInput={setInput} />
          <ImageUpload
            label="챌린지 썸네일 이미지 업로드"
            id="thumbnail"
            name="thumbnail"
            image={input.thumbnail ?? challenge.thumbnail}
            onChange={onChangeImage}
          />
        </div>
        <div className="grid w-full grid-cols-2 gap-3">
          {/* 가격 정보 */}
          <ChallengePrice
            defaultValue={challenge.priceInfo}
            setInput={setInput}
          />
          {/* 일정 */}
          <ProgramSchedule defaultValue={challenge} setInput={setInput} />
        </div>
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

      <ChallengeCurriculumEditor
        curriculum={content.curriculum}
        setContent={setContent}
      />

      <ProgramBlogReviewEditor
        blogReview={content.blogReview ?? { list: [] }}
        setBlogReview={(blogReview) =>
          setContent((prev) => ({ ...prev, blogReview }))
        }
      />

      <div className="my-6">
        <FaqSection
          programType="CHALLENGE"
          faqInfo={
            input.faqInfo ??
            challenge.faqInfo.map((info) => ({ faqId: info.id }))
          }
          setInput={setInput}
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
