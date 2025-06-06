import Image from 'next/image';

const ChallengeScheduleSection = () => {
  return (
    <section className="flex w-full flex-col items-center bg-[#0C1737] px-5 pb-20 pt-[60px] text-white md:px-0 md:pb-[140px] md:pt-[100px]">
      <h2 className="mb-10 text-center text-[22px] font-bold md:text-xlarge28">
        한눈에 보는
        {' {마케팅 서류 4주 완성 챌린지}'}
        일정
      </h2>

      <div className="flex w-full max-w-[1000px] flex-col-reverse gap-6 md:flex-row md:gap-6">
        {/* 왼쪽 박스 */}
        <div className="relative min-w-[278px] flex-1 rounded-sm bg-white p-3 text-[#0C1737] shadow-lg md:p-5">
          <ul className="flex flex-col gap-3 text-xsmall14">
            <li className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-[16px]">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#3B82F6] text-[12px] font-semibold text-white md:h-5 md:w-5 md:text-[14px]">
                  1
                </span>
                <span className="font-bold">합격 콘텐츠 & 미션 8회차</span>
              </div>
              챌린지 대시보드를 통해 합격 자료를 확인 후 <br />
              회차별 미션을 제출합니다.
            </li>
            <li className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-[16px]">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#FB923C] text-[12px] font-semibold text-white md:h-5 md:w-5 md:text-[14px]">
                  2
                </span>
                <span className="font-bold">마케터 필수 역량 Class 4회</span>
              </div>
              실무 역량을 빠르게 기르는 압축 Class를 <br />
              매주 수요일 저녁에 진행합니다.
            </li>
            <li className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-[16px]">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#34D399] text-[12px] font-semibold text-white md:h-5 md:w-5 md:text-[14px]">
                  3
                </span>
                <span className="font-bold">현직자 Live Q&A 5회</span>
              </div>
              <span>
                현직자 마케터의 Live Q&A를 <br />
                <strong>매주 토요일 저녁 8시</strong>에 진행합니다.
              </span>
            </li>
            <li className="flex flex-col gap-1">
              <div className="text-[16px]">
                <span className="font-bold">4. </span>
                <span className="rounded box-border inline-block rounded-[3px] bg-[#4A76FF] px-3 py-1.5 text-[14px] font-semibold text-white md:text-[16px]">
                  렛츠커리어 24hr 커뮤니티
                </span>
              </div>
              <div>
                현직자 상주 커뮤니티에 참여하여 <br />
                상시 질의응답을 진행합니다.
              </div>
              <div>
                렛츠커리어만의 Special 합격 자료를 <br />
                커뮤니티를 통해 제공합니다.
              </div>
            </li>
            <li className="flex flex-col gap-1">
              <span className="text-[16px] font-bold">
                5. 1:1 피드백을 신청하신 경우
              </span>
              경험 피드백은 2회차 미션 제출 후 진행합니다.
              <br />
              서류 피드백은 8회차 미션 제출 후 진행합니다.
            </li>
          </ul>
        </div>

        {/* 오른쪽 달력 이미지 */}
        <div className="relative aspect-[680/500] w-full">
          <Image
            src="/images/marketing/calendar-june.svg"
            alt="마케팅 챌린지 달력"
            fill
            className="rounded-sm object-contain shadow-lg md:rounded-xl"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>
    </section>
  );
};

export default ChallengeScheduleSection;
