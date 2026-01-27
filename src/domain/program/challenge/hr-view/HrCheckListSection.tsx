import Box from '@/domain/program/program-detail/Box';
import Image from 'next/image';
import { CSSProperties, ReactNode, useMemo } from 'react';
import { twMerge } from 'tailwind-merge';

const HR_CHECK_LIST = [
  {
    title: ['HR 직무에 관심은 있지만,', '실제로 어떤 일을 하는지 몰라요'],
    content: [
      ['HR 직무가 궁금하지만 HRD, HRM 차이가 헷갈리는 분'],
      ['HR 직무를 "막연히 좋다"고만 생각해왔던 분'],
    ],
  },
  {
    title: ['채용 공고는 보고 있지만', '내 경험을 어떻게 풀어야 할지 막막해요'],
    content: [
      ['체계적으로 기초적인 뼈대부터 잡아가며 완성하고 싶은 분'],
      ['채용 공고를 봐도 내 경험을 어떻게 연결해야 할지 모르는 분'],
      ['HR에서 원하는 역량이 무엇인지 감이 안오시는 분'],
    ],
  },
  {
    title: [
      '포트폴리오를 시작은 하지만 늘 미완성으로',
      '끝나거나, 이게 맞는 방향인지 확신이 없어요',
    ],
    content: [
      ['혼자 하려고 하니 집중도 잘 안되고, 포폴 완성까지 하기 힘든 분'],
      ['실제 합격 포트폴리오 예시를 보고 제작에 참고하고 싶은 분'],
    ],
  },
];

const HR_STYLES = {
  boxStyle: {
    backgroundColor: '#FEEEE5',
  },
  badgeStyle: {
    backgroundColor: '#FF5E00',
  },
};

function Badge({
  children,
  style,
}: {
  children?: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <span
      className="absolute -top-5 left-4 z-10 -rotate-12 rounded-sm bg-[#FF7F27] px-4 py-1 text-xsmall14 font-semibold text-white md:left-6 md:px-4 md:text-small20"
      style={style}
    >
      {children}
    </span>
  );
}

function CheckList({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={twMerge(
        'flex w-full gap-2 text-left md:items-center md:gap-4',
        className,
      )}
    >
      <div className="shrink-0">
        <Image
          src="/images/hr-checkbox.svg"
          alt=""
          width={37}
          height={37}
          className="h-5 w-5 md:h-[37px] md:w-[37px]"
          aria-hidden="true"
        />
      </div>
      <div className="flex flex-col tracking-tight md:flex-row md:gap-1">
        {children}
      </div>
    </div>
  );
}

const HrCheckListSection: React.FC = () => {
  const checkList = useMemo(() => HR_CHECK_LIST, []);
  const styles = useMemo(() => HR_STYLES, []);

  return (
    <section className="flex flex-col items-center bg-[#FFFAF7] pb-[70px] pt-[50px] text-center md:pb-[142px] md:pt-[88px]">
      <div className="flex w-full max-w-[320px] flex-col md:max-w-[1000px] md:px-10 lg:px-0">
        <div className="flex w-full flex-col gap-16 md:gap-32 md:px-16">
          {checkList.map((item, index) => (
            <div
              key={item.title[0]}
              className="flex w-full flex-col gap-6 md:items-center md:gap-10"
            >
              <Box
                className={`text-small16 relative flex w-full max-w-[860px] flex-col py-6 font-semibold md:p-10 md:text-medium24 ${
                  index === 0 ? 'justify-center gap-1 md:flex-row' : ' '
                }`}
                style={styles.boxStyle}
              >
                <Badge style={styles.badgeStyle}>추천 {index + 1}</Badge>
                {item.title.map((ele) => (
                  <span key={ele} className="shrink-0">
                    {ele}
                  </span>
                ))}
              </Box>
              <div className="flex w-fit flex-col gap-5 px-0 md:items-center">
                {item.content.map((group) => (
                  <CheckList
                    key={group[0]}
                    className={
                      group.length > 1 ? 'justify-start' : 'items-center'
                    }
                  >
                    {group.map((ele) => (
                      <span
                        key={ele}
                        className="shrink-0 text-xsmall14 text-neutral-35 xs:text-xsmall14 md:text-small20"
                      >
                        {ele}
                      </span>
                    ))}
                  </CheckList>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HrCheckListSection;
