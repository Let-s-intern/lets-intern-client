import { fileType, uploadFile } from '@/api/file';
import { useGetChallengeQuery, usePatchChallengeMutation } from '@/api/program';
import isDeprecatedProgram from '@/lib/isDeprecatedProgram';
import { UpdateChallengeReq } from '@/schema';
import { ChallengeContent } from '@/types/interface';
import EditorApp from '@components/admin/lexical/EditorApp';
import Header from '@components/admin/ui/header/Header';
import Heading from '@components/admin/ui/heading/Heading';
import { Button } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FaSave } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';

const ChallengeEdit: React.FC = () => {
  const [content, setContent] = useState<ChallengeContent>({
    curriculum: '',
    curriculumDesc: '',
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

  if (!challenge) {
    return <div>loading...</div>;
  }

  return (
    <div className="mx-3 mb-40 mt-3">
      <Header>
        <Heading>챌린지 생성</Heading>
      </Header>

      <h2>프로그램 소개</h2>
      <section>
        <header>
          <h3>상세 설명</h3>
        </header>
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

export default ChallengeEdit;
