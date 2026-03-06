'use client';

import { useUserQuery } from '@/api/user/user';

const WelcomeMessage = () => {
  const { data: user } = useUserQuery();

  const name = user?.name ?? '';

  return (
    <div>
      <span className="text-base leading-6">
        <span className="font-semibold text-neutral-900">
          {name} 멘토님
        </span>
        <span className="text-neutral-900">
          , 렛츠커리어와 함께 취준생들의 고민에 귀 기울여 주셔서 언제나
          감사합니다. 앞으로도 잘 부탁드립니다!
        </span>
      </span>
    </div>
  );
};

export default WelcomeMessage;
