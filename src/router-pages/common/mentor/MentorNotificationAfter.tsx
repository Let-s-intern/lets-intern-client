import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  mentorNotificationSchema,
  MentorNotificationType,
} from '../../../schema';
import axios from '../../../utils/axios';

const MentorNotificationAfter = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const liveId = Number(params.id);
  const code = String(searchParams.get('code'));

  useEffect(() => {
    if (!code || !liveId) {
      alert('잘못된 접근입니다.');
      navigate('/');
    }
  }, [code, liveId, navigate]);

  const { data: notification, error } = useQuery({
    queryKey: ['mentor', liveId, 'notification', 'before'],
    queryFn: async () => {
      const type: MentorNotificationType = 'REVIEW';
      const res = await axios.get(`live/${liveId}/mentor/${code}`, {
        params: { type },
      });

      return mentorNotificationSchema.parse(res.data.data);
    },
    retry: 0,
  });

  useEffect(() => {
    if (error) {
      alert('잘못된 접근입니다.');
      navigate('/');
    }
  }, [error, navigate]);

  return (
    <div className="mx-auto max-w-[40rem] px-5 pt-20">
      <h2 className="mb-4 text-xl">
        {'<'}
        <strong>{notification?.liveMentorVo.title}</strong>
        {'>'} 참여자 후기
      </h2>

      <section className="mb-4">
        <p>
          안녕하세요, 렛츠커리어입니다.
          <br />
          소중한 시간 내어 준비해주시고, 좋은 내용으로 진행해주셔서 감사합니다.
          <br />
          LIVE 클래스를 들으신 분들이 작성해주신 정성스러운 후기 전달드립니다!
        </p>
      </section>
      <hr className="my-4" />

      {(notification?.reviewList.length ?? 0) > 0 ? (
        <ul className="mb-8 flex list-disc flex-col gap-1 pl-4">
          {notification?.reviewList.map((review, index) => (
            <li key={index}>{review}</li>
          ))}
        </ul>
      ) : (
        <p>아직 후기가 없습니다.</p>
      )}
    </div>
  );
};

export default MentorNotificationAfter;
