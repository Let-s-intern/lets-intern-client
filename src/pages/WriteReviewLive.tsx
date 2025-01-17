import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ConfirmSection from '../components/common/review/section/ConfirmSection';
import RecommendReviewSection from '../components/common/review/section/RecommendReviewField';
import StarScoreSection from '../components/common/review/section/StarScoreSection';
import TextAreaSection from '../components/common/review/section/TextAreaSection';
import {
  CreateReviewByLinkProgramType,
  CreateReviewByLinkReq,
  getLiveIdSchema,
} from '../schema';
import axios from '../utils/axios';

const WriteReviewLive = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [starScore, setStarScore] = useState<number>(0);
  const [tenScore, setTenScore] = useState<number | null>(null);
  const [content, setContent] = useState<string>('');
  const [hasRecommendationExperience, setHasRecommendationExperience] =
    useState<boolean | null>(null);
  const [npsAns, setNpsAns] = useState('');

  const liveId = Number(params.id);

  const createReviewMutation = useMutation({
    mutationFn: async (req: CreateReviewByLinkReq) => {
      const type: CreateReviewByLinkProgramType = 'LIVE';
      const res = await axios.post(`/review/${liveId}`, req, {
        params: { type },
      });
      return res.data;
    },
    onSuccess: () => {
      alert('리뷰가 작성되었습니다.');
      navigate('/', { replace: true });
    },
  });

  const { data: live } = useQuery({
    queryKey: ['live', liveId],
    queryFn: async () => {
      const res = await axios.get(`/live/${liveId}`);
      return getLiveIdSchema.parse(res.data.data);
    },
    retry: 1,
  });

  const invalid =
    starScore === 0 || tenScore === null || tenScore === 0 || !npsAns;

  const handleConfirm = () => {
    if (invalid) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    createReviewMutation.mutate({
      programId: liveId,
      npsAns,
      npsCheckAns:
        hasRecommendationExperience === null
          ? false
          : hasRecommendationExperience,
      nps: tenScore,
      content,
      score: starScore,
    });
  };

  return (
    <main className="mx-auto mt-20 box-content flex max-w-96 flex-col gap-12 break-keep px-5">
      <StarScoreSection
        starScore={starScore}
        setStarScore={setStarScore}
        title={live?.title ?? '라이브 타이틀'}
      />
      <RecommendReviewSection
        programTitle={live?.title ?? '라이브 타이틀'}
        tenScore={tenScore}
        setTenScore={setTenScore}
        hasRecommendationExperience={hasRecommendationExperience}
        setHasRecommendationExperience={setHasRecommendationExperience}
        npsAns={npsAns}
        setNpsAns={setNpsAns}
      />
      <TextAreaSection content={content} setContent={setContent} />
      <ConfirmSection
        isEdit={false}
        onConfirm={handleConfirm}
        isDisabled={invalid}
      />
    </main>
  );
};

export default WriteReviewLive;
