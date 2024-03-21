import clsx from 'clsx';
import { useState } from 'react';

import PasswordContent from '../../../components/common/mento/PasswordContent';

const MentoNotificationAfter = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return !isAuthenticated ? (
    <PasswordContent setIsAuthenticated={setIsAuthenticated} />
  ) : (
    <div className="px-6">
      <div className="mx-auto max-w-5xl">
        <main className="mx-auto max-w-2xl">
          <h1 className="mt-4 text-center text-xl font-bold">
            [세션 제목] 후기 안내
          </h1>
          <section className="mt-4">
            <p>
              안녕하세요, 렛츠인턴입니다.
              <br />
              소중한 시간 내어 세션 준비해주시고, 좋은 내용으로 세션
              진행해주셔서 감사합니다.
              <br />
              세션 들으신 분들이 작성해주신 정성스러운 후기 전달드립니다!
            </p>
          </section>
          <section className="mt-6">
            <h2 className="text-lg font-semibold">😊 세션 후기</h2>
            <div className="mt-3 px-2">
              <ul>
                {Array.from({ length: 3 }).map((_, index) => (
                  <li
                    key={index}
                    className={clsx(
                      'border-t-[0.5px] border-neutral-600 px-1 py-3',
                      {
                        'border-b-[0.5px]': index === 2,
                      },
                    )}
                  >
                    가나다라가나다라가나다라가나다라가나다라가나다라가나다라가나다라가나다라
                    가나다라가나다라가나다라가나다라가나다라가나다라가나다라가나다라가나다라
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default MentoNotificationAfter;
