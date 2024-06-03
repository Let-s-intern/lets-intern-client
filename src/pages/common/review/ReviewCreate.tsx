import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import ConfirmSection from '../../../components/common/review/section/ConfirmSection';
import StarScoreSection from '../../../components/common/review/section/StarScoreSection';
import TenScoreSection from '../../../components/common/review/section/TenScroeSection';
import TextAreaSection from '../../../components/common/review/section/TextAreaSection';
import axios from '../../../utils/axios';

const ReviewCreate = () => {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [starScore, setStarScore] = useState<number>(0);
  const [tenScore, setTenScore] = useState<number | null>(null);
  const [content, setContent] = useState<string>('');
  const [isYes, setIsYes] = useState<boolean | null>(null);
  const [answer, setAnswer] = useState<{
    yes: string;
    no: string;
    low: string;
  }>({
    yes: '',
    no: '',
    low: '',
  });

  const applicationId = Number(searchParams.get('application'));
  const programId = Number(params.programId);

  const addReview = useMutation({
    mutationFn: async () => {
      const res = await axios.post(
        '/review',
        {
          programId: programId,
          npsAns:
            tenScore && tenScore <= 6
              ? answer.low
              : isYes
              ? answer.yes
              : answer.no,
          npsCheckAns: isYes === null ? false : isYes,
          nps: tenScore,
          content: content,
          score: starScore,
        },
        {
          params: {
            applicationId: applicationId,
          },
        },
      );
      return res.data;
    },
    onSuccess: () => {
      navigate(-1);
    },
  });

  const handleConfirm = () => {
    addReview.mutate();
  };

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-16 pb-16 pt-8">
      <StarScoreSection starScore={starScore} setStarScore={setStarScore} />
      <TenScoreSection
        tenScore={tenScore}
        setTenScore={setTenScore}
        isYes={isYes}
        setIsYes={setIsYes}
        answer={answer}
        setAnswer={setAnswer}
      />
      <TextAreaSection content={content} setContent={setContent} />
      <ConfirmSection onConfirm={handleConfirm} />
    </main>
  );
};

export default ReviewCreate;
