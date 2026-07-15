'use client';

import { useUserQuery } from '@/api/user/user';
import config from '@/constants/config';

const WelcomeMessage = () => {
  const { data: user } = useUserQuery();

  const name = user?.name ?? '';

  return (
    <div>
      <span className="text-base leading-6">
        <span className="font-semibold text-neutral-900">
          {name} {config.welcomeMessage.nameSuffix}
        </span>
        <span className="text-neutral-900">{config.welcomeMessage.body}</span>
      </span>
    </div>
  );
};

export default WelcomeMessage;
