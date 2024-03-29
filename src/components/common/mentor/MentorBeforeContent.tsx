import { formatMentorDateString } from '../../../utils/formatDateString';

interface Props {
  contentData: any;
  isLoading: boolean;
}

const MentorBeforeContent = ({ contentData, isLoading }: Props) => {
  if (isLoading) return <></>;

  const programInfo = contentData.programVo;
  const preQuestionList = contentData.preQuestionList;
  const applyMotiveList = contentData.applyMotiveList;

  return (
    <div className="mb-24 min-h-screen px-6">
      <div className="mx-auto max-w-5xl">
        <main className="mx-auto max-w-2xl">
          <h1 className="mt-8 text-2xl font-bold">
            [{programInfo.title}] 사전 안내
          </h1>
          <section className="mt-4">
            <ul className="ml-6 flex list-disc flex-col gap-2">
              <li>
                <span className="font-semibold">세션 일정</span> :{' '}
                {formatMentorDateString(programInfo.startDate)} ~{' '}
                {formatMentorDateString(programInfo.endDate)}
              </li>
              {programInfo.location && (
                <li>
                  <span className="font-semibold">세션 위치</span> :{' '}
                  {programInfo.location}
                </li>
              )}
              <li>
                <span className="font-semibold">신청자 현황</span> :{' '}
                {programInfo.applicationCount}명
              </li>
            </ul>
          </section>
          <section className="mt-6">
            <h2 className="text-lg font-semibold">❓ 세션 사전 질문</h2>
            <div className="ml-6">
              <p className="text-sm text-[#626262]">
                세션 내용 혹은 QNA 세션에서 다뤄주시면 감사하겠습니다!
              </p>
              <ul className="ml-6 mt-2 flex list-disc flex-col gap-2">
                {preQuestionList.map((question: any, index: number) => (
                  <li key={index}>{question}</li>
                ))}
              </ul>
            </div>
          </section>
          <section className="mt-6">
            <h2 className="text-lg font-semibold">❗️ 세션 지원 동기</h2>
            <div className="ml-6">
              <p className="text-sm text-[#626262]">
                세션 구성에 참고해주시면 됩니다.
              </p>
              <ul className="ml-6 mt-2 flex list-disc flex-col gap-2">
                {applyMotiveList.map((applyMotive: any, index: number) => (
                  <li key={index}>{applyMotive}</li>
                ))}
              </ul>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default MentorBeforeContent;
