import CheckIcon from '@/assets/icons/check.svg';

const FEEDBACK_BENEFITS = [
  {
    title: 'HR 현직자의 1:1 멘토',
    description: (
      <span>
        현직 HR 담당자에게 나의 서류와 커리어 고민을{' '}
        <br className="md:hidden" />
        직접 공유하고, 직무 관점에서 구체적인 개선
        <br className="md:hidden" />
        방향을 피드백받을 수 있어요!
        <br />
        (스탠다드 및 프리미엄 구매 시)
      </span>
    ),
  },
  {
    title: 'HR 현직자의 LIVE 서류 및 커리어 피드백',
    description: (
      <span>
        라이브 세미나를 통해 실제 채용 기준과 사례를 바탕으로, 많은 지원자들이
        놓치는 <br className="md:hidden" />
        서류 포인트와 커리어 방향을 함께 점검해요!
        <br />
        (스탠다드 및 프리미엄 구매 시)
      </span>
    ),
  },
];

function HrFeedbackSection() {
  return (
    <div className="flex flex-col items-center px-5 pb-10 md:px-0 md:pb-[120px]">
      <div className="mb-8 mt-[60px] w-full md:mb-12 md:mt-[120px]">
        <div className="text-left text-[18px] font-bold md:text-center md:text-[30px]">
          <span>여기서 끝이 아니죠</span>
          <br />
          <span>HR 현직자에게 직접 피드백을 듣는 혜택까지!</span>
        </div>
      </div>

      <div className="flex w-full min-w-[320px] flex-col gap-3.5 md:max-w-[1000px]">
        <div className="mx-auto w-full min-w-[320px] max-w-[500px] overflow-hidden rounded-md md:h-[300px] md:w-[500px] md:flex-shrink-0">
          <img
            src="/images/hr-feedback.gif"
            alt="현직자에게 직접 피드백을 듣는 혜택"
            className="h-full w-full object-cover object-center"
          />
        </div>
        {FEEDBACK_BENEFITS.map((benefit, index) => (
          <div
            key={index}
            className="bg-neutral-95 flex flex-1 flex-col gap-4 rounded-md px-5 py-10 md:min-h-[186px] md:min-w-[532px] md:gap-6 md:px-[30px] md:py-10"
          >
            <h4 className="text-small18 text-neutral-0 md:text-medium22 font-bold">
              {benefit.title}
            </h4>
            <div className="flex items-start">
              <CheckIcon
                style={{ color: '#FF5E00' }}
                className="h-6 w-6 shrink-0"
                aria-hidden="true"
              />
              <span className="text-xsmall14 text-neutral-30 md:text-small18">
                {benefit.description}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HrFeedbackSection;
