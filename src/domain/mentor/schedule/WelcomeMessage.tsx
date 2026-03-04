'use client';

import { useUserQuery } from '@/api/user/user';

const WelcomeMessage = () => {
  const { data: user } = useUserQuery();

  const name = user?.name ?? '';

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900">프로그램 일정</h1>
      <p className="mt-2 text-sm text-neutral-600">
        {name} 멘토님, 렛츠커리어와 함께 취준생들의 고민에 귀 기울여 주셔서
        언제나 감사합니다. 앞으로도 잘 부탁드립니다!
      </p>
    </div>
  );
};

export default WelcomeMessage;
