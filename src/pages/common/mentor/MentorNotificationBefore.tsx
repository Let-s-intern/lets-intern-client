import { useState } from 'react';

import PasswordContent from '../../../components/common/mentor/PasswordContent';

const MentorNotificationBefore = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return !isAuthenticated ? (
    <PasswordContent setIsAuthenticated={setIsAuthenticated} />
  ) : (
    <main className="min-h-screen px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-2xl">
          <h1 className="mt-6 text-center text-xl font-bold">
            [세션 제목] 사전 안내
          </h1>
          <section className="mt-4">
            <ul className="ml-6 list-disc">
              <li>세션 일정 : </li>
              <li>세션 위치 : </li>
              <li>신청자 현황 : </li>
            </ul>
          </section>
          <section className="mt-6">
            <h2 className="text-lg font-semibold">❓ 세션 사전 질문</h2>
            <div className="ml-6">
              <p className="text-sm text-[#626262]">
                세션 내용 혹은 QNA 세션에서 다뤄주시면 감사하겠습니다!
              </p>
              <ul className="ml-6 mt-2 list-disc">
                <li>세션 질문 1</li>
                <li>세션 질문 2</li>
                <li>세션 질문 3</li>
              </ul>
            </div>
          </section>
          <section className="mt-6">
            <h2 className="text-lg font-semibold">❗️ 세션 지원 동기</h2>
            <div className="ml-6">
              <p className="text-sm text-[#626262]">
                세션 구성에 참고해주시면 됩니다.
              </p>
              <ul className="ml-6 mt-2 list-disc">
                <li>세션 동기 1</li>
                <li>세션 동기 2</li>
                <li>세션 동기 3</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default MentorNotificationBefore;
