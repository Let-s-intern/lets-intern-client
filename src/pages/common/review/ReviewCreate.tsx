import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import ConfirmSection from '../../../components/common/review/section/ConfirmSection';
import StarScoreSection from '../../../components/common/review/section/StarScoreSection';
import TenScoreSection from '../../../components/common/review/section/TenScoreSection';
import TextAreaSection from '../../../components/common/review/section/TextAreaSection';
import axios from '../../../utils/axios';

const ReviewCreate = ({ isEdit }: { isEdit: boolean }) => {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [starScore, setStarScore] = useState<number>(0);
  const [tenScore, setTenScore] = useState<number | null>(null);
  const [content, setContent] = useState<string>('');
  const [hasRecommendationExperience, setHasRecommendationExperience] =
    useState<boolean | null>(null);
  const [npsAns, setNpsAns] = useState('');

  const reviewId = Number(params.reviewId);
  const applicationId = Number(searchParams.get('application'));
  const programId = Number(params.programId);
  const programType = params.programType?.toLowerCase();

  const { data: reviewDetailData } = useQuery({
    queryKey: ['review', applicationId],
    queryFn: async () => {
      const res = await axios.get(`/review/${reviewId}`);
      return res.data.data;
    },
    enabled: isEdit,
    retry: 1,
  });

  useEffect(() => {
    if (isEdit && reviewDetailData) {
      setStarScore(reviewDetailData.score);
      setTenScore(reviewDetailData.nps);
      setHasRecommendationExperience(reviewDetailData.npsCheckAns);
      setNpsAns(reviewDetailData.npsAns ?? '');
      setContent(reviewDetailData.content);
    }
  }, [reviewDetailData, isEdit]);

  const { data: programTitle } = useQuery({
    queryKey: ['program', programId, programType],
    queryFn: async () => {
      const res = await axios.get(`/${programType}/${programId}/title`);
      return res.data.data.title;
    },
    retry: 1,
  });

  const addReview = useMutation({
    mutationFn: async () => {
      const res = await axios.post(
        '/review',
        {
          programId: programId,
          npsAns,
          npsCheckAns:
            hasRecommendationExperience === null
              ? false
              : hasRecommendationExperience,
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
      const res = await axios.patch(`/review/${reviewId}`, {
        npsAns,
        npsCheckAns:
          hasRecommendationExperience === null
            ? false
            : hasRecommendationExperience,
        nps: tenScore,
        content: content,
        score: starScore,
      });
      return res.data;
    },
    onSuccess: () => {
      navigate(-1);
    },
  });

  const handleConfirm = () => {
    if (isEdit) {
      if (!npsAns || content === '' || starScore === 0 || tenScore === null) {
        alert('모든 항목을 입력해주세요.');
        return;
      }
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
        <StarScoreSection
          starScore={starScore}
          setStarScore={setStarScore}
          title={programTitle}
        />
        <TenScoreSection
          programTitle={programTitle}
          tenScore={tenScore}
          setTenScore={setTenScore}
          hasRecommendationExperience={hasRecommendationExperience}
          setHasRecommendationExperience={setHasRecommendationExperience}
          npsAns={npsAns}
          setNpsAns={setNpsAns}
        />
        <TextAreaSection content={content} setContent={setContent} />
        <ConfirmSection
          isEdit={isEdit}
          onConfirm={handleConfirm}
          isDisabled={
            starScore === 0 || tenScore === null || tenScore === 0 || !npsAns
          }
        />
      </main>
    </div>
  );
};

export default ReviewCreate;
