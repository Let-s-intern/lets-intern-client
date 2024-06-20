import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';

import ConfirmSection from '../../../components/common/review/section/ConfirmSection';
import StarScoreSection from '../../../components/common/review/section/StarScoreSection';
import TenScoreSection from '../../../components/common/review/section/TenScroeSection';
import TextAreaSection from '../../../components/common/review/section/TextAreaSection';
import axios from '../../../utils/axios';

const ReviewCreate = ({isEdit}:{isEdit:boolean}) => {
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
  
  const { data: reviewDetailData } = useQuery({
    queryKey: ['review', applicationId],
    queryFn: async () => {
      const res = await axios.get(`/review/${applicationId}`);
      return res.data;
    },
    enabled: isEdit,
  })

  useEffect(() => {
    if (isEdit && reviewDetailData) {
      setStarScore(reviewDetailData.score);
      setTenScore(reviewDetailData.nps);
      setIsYes(reviewDetailData.npsCheckAns);
      setContent(reviewDetailData.content);
    }
  }, [reviewDetailData, isEdit])


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

  const editReview = useMutation({
    mutationFn: async () => {
      const res = await axios.put(
        `/review/${applicationId}`,
        {
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
      );
      return res.data;
    },
    onSuccess: () => {
      navigate(-1);
    },
  });

  const handleConfirm = () => {
    if (isEdit) {
      editReview.mutate();
      return;
    }
    addReview.mutate();
  };

  return (
    <div className="z-40 flex w-full flex-col items-center bg-neutral-0/50 md:fixed md:left-0 md:top-0 md:h-screen md:w-screen md:justify-center">
      <main className="flex w-full max-w-3xl flex-col gap-16 bg-white md:relative md:max-h-[45rem] md:w-[40rem] md:overflow-y-scroll md:rounded-xl md:px-14 md:pb-6 md:pt-12">
        <img
          src="/icons/menu_close_md.svg"
          alt="close"
          className="absolute right-6 top-6 hidden cursor-pointer md:block"
          onClick={() => {
            navigate(-1);
          }}
        />
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
    </div>
  );
};

export default ReviewCreate;
