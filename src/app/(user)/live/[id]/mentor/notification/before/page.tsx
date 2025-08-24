'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import {
  mentorNotificationSchema,
  MentorNotificationType,
} from '../../../../../../../schema';
import axios from '../../../../../../../utils/axios';

const MentorNotificationBefore = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const liveId = Number(params.id);
  const code = String(searchParams.get('code'));

  useEffect(() => {
    if (!code || !liveId) {
      alert('잘못된 접근입니다.');
      router.push('/');
    }
  }, [code, liveId, router]);

  const { data: notification, error } = useQuery({
    queryKey: ['mentor', liveId, 'notification', 'before'],
    queryFn: async () => {
      const type: MentorNotificationType = 'PREV';
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
      router.push('/');
    }
  }, [error, router]);

  return (
    <div className="mx-auto max-w-[40rem] px-5 pt-20">
      <h2 className="mb-4 text-xl">
        {'<'}
        <strong>{notification?.liveMentorVo.title}</strong>
        {'>'} 사전 안내사항
      </h2>
      <section className="mb-4">
        <p>
          안녕하세요, 렛츠커리어입니다.
          <br />
          소중한 시간 내어 준비해주셔서 감사드립니다.
          <br />
          LIVE 클래스 진행 관련 사전 안내사항 전달드립니다.
        </p>
      </section>

      <hr className="my-4" />

      <ul className="mb-8 flex list-disc flex-col gap-1 pl-4">
        <li>
          <span className="font-semibold">시작일시</span>:{' '}
          {notification?.liveMentorVo.startDate?.format('YYYY/MM/DD HH시 mm분')}
        </li>
        <li>
          <span className="font-semibold">종료일시</span>:{' '}
          {notification?.liveMentorVo.endDate?.format('YYYY/MM/DD HH시 mm분')}
        </li>

        <li>
          <span className="font-semibold">참여 신청자 수</span>:{' '}
          {notification?.liveMentorVo.participationCount ?? '-'}명
        </li>

        {/* 줌링크 */}
        <li>
          <span className="font-semibold">줌 링크</span>:{' '}
          <a
            href={notification?.liveMentorVo.zoomLink ?? '#'}
            target="_blank"
            rel="noreferrer"
            className="text-blue-500 hover:underline"
          >
            {notification?.liveMentorVo.zoomLink}
          </a>
        </li>

        {/* 줌비밀번호 */}
        <li>
          <span className="font-semibold">줌 비밀번호</span>:{' '}
          {notification?.liveMentorVo.zoomPassword}
        </li>
      </ul>

      {(notification?.questionList.length ?? 0) > 0 ? (
        <>
          <h2 className="mb-4 text-xl font-semibold">참여자 사전질문</h2>
          <ul className="mb-8 flex list-disc flex-col gap-1 pl-4">
            {notification?.questionList.map((question, index) => (
              <li key={index}>{question}</li>
            ))}
          </ul>
        </>
      ) : null}

      {(notification?.motivateList.length ?? 0) > 0 ? (
        <>
          <h2 className="mb-4 text-xl font-semibold">참여자 신청동기</h2>
          <ul className="mb-8 flex list-disc flex-col gap-1 pl-4">
            {notification?.motivateList.map((motivation, index) => (
              <li key={index}>{motivation}</li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
};

export default MentorNotificationBefore;