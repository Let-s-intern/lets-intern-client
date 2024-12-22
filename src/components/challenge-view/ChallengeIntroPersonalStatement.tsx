import Clock from '@/assets/icons/personal-statement-clock.svg?react';
import { twMerge } from '@/lib/twMerge';
import { useMediaQuery } from '@mui/material';
import { Fragment, ReactNode } from 'react';

import Description from '@components/common/program/program-detail/Description';
import OutlinedBox from '@components/common/program/program-detail/OutlineBox';
import Heading2 from '@components/common/ui/Heading2';

const TITLE1 = [
  '인사담당자가 서류를 보는 시간,',
  '눈에 띄는 자소서를 만들어야 해요',
];

const TITLE2 = [
  '내 자소서는 어디가 부족한 걸까?',
  '자소서 완성도 UP을 위한 5가지 기준',
];

const STAR = {
  S: ['Situation', '상황'],
  T: ['Task', '문제'],
  A: ['Action', '행동'],
  R: ['Result', '결과'],
};

const POINT = [
  { title: '두괄식', desc: ['핵심 내용을\n첫문단에 작성하는 방식'] },
  {
    title: '수치화',
    desc: ['자신의 성과를 더 구체적이고\n객관적으로 표현'],
  },
];

const DESCRITION1 = [
  '남들과 다른 임팩트 있는 자기소개서 작성을 위해서는',
  '경험-역량-회사 FIT을 고려한 스토리텔링은 필수예요.',
  '두괄식과 STAR 작성 기법으로 읽고 싶은',
  '서류를 만들어봐요!',
];

function ChallengeIntroPersonalStatement() {
  const isDesktop = useMediaQuery('(min-width:991px)');

  return (
    <section className="flex w-full flex-col items-center">
      <div className="w-full max-w-[1000px] px-5 py-20 md:py-40 md:text-center xl:px-0">
        <div className="flex flex-col gap-2 md:items-center md:gap-3">
          <Badge>
            <Clock width={isDesktop ? 40 : 24} height={isDesktop ? 40 : 24} />
            <span>평균 10초</span>
          </Badge>
          <Heading2>{TITLE1.join('\n')}</Heading2>
        </div>
        <Description className="mb-10 mt-3 md:mb-20 md:mt-8">
          {DESCRITION1[0]} <br className="md:hidden" />
          {DESCRITION1[1]}
          <br />
          {DESCRITION1[2]} <br className="md:hidden" />
          {DESCRITION1[3]}
        </Description>

        <OutlinedBox>
          <CircularBox className="hidden md:flex">STAR 기법</CircularBox>

          {Object.entries(STAR).map(([key, value], index) => (
            <Fragment key={key}>
              <BoxItem title={key}>
                {value.map((item) => (
                  <span key={item} className="block">
                    {item}
                  </span>
                ))}
              </BoxItem>
              {index !== 3 && <VerticalLine />}
            </Fragment>
          ))}
        </OutlinedBox>
        <div className="mb-6" />
        <OutlinedBox>
          <CircularBox className="hidden md:flex">
            <span>두괄식</span>
            <span>수치화</span>
          </CircularBox>

          {POINT.map(({ title, desc }, index) => (
            <Fragment key={title}>
              <BoxItem title={title} padding>
                {desc.map((item) => (
                  <span key={item} className="block">
                    {item}
                  </span>
                ))}
              </BoxItem>
              {index !== POINT.length - 1 && (
                <VerticalLine heightClassName="h-20" />
              )}
            </Fragment>
          ))}
        </OutlinedBox>
      </div>

      <div className="w-full bg-neutral-100 px-5 py-20 md:flex md:flex-col md:items-center md:px-0 md:py-24">
        <div className="flex flex-col gap-3 md:items-center md:text-center">
          <div>
            <Badge>평균 서류 합격률 28%</Badge>
            <span className="mt-1 block text-[10px] text-neutral-30 md:text-xxsmall12">
              *출처 : 한국경제인협회 설문조사
            </span>
          </div>
          <Heading2>{TITLE2.join('\n')}</Heading2>
          <div className="md:mt-8">
            <Description>
              5가지 기준을 고려해 자기소개서의 완성도를{' '}
              <br className="md:hidden" />
              셀프 점검 하고 <br className="hidden md:block" /> 체계적인 자소서
              커리큘럼으로 <br className="md:hidden" />
              차근차근 완성도를 높여봐요!
            </Description>
          </div>
        </div>
        <img
          className="mt-10 h-auto w-full max-w-[660px] md:mt-20"
          src="/images/challenge-chart.png"
          alt="자소서 완성도를 높이기 위한 5가지 기준을 나타낸 차트"
        />
      </div>
    </section>
  );
}

function Badge({ children }: { children?: ReactNode }) {
  return (
    <div className="gap-1.6 flex w-fit items-center gap-1 rounded-xxs bg-[#FFF7EF] px-2.5 py-1 text-small18 font-bold text-[#FB8100] md:py-2 md:text-xlarge28">
      {children}
    </div>
  );
}

function BoxItem({
  title,
  children,
  padding,
}: {
  title: string;
  children?: ReactNode;
  padding?: boolean;
}) {
  return (
    <div
      className={`flex flex-1 flex-col ${padding ? 'gap-y-2 md:gap-y-5' : ''} text-center`}
    >
      <span className="block text-small20 font-bold text-[#008CC3]">
        {title}
      </span>
      <p className="block whitespace-pre text-xxsmall12 font-medium text-neutral-40 md:whitespace-normal md:text-small18">
        {children}
      </p>
    </div>
  );
}

function VerticalLine({ heightClassName }: { heightClassName?: string }) {
  return (
    <div
      className={twMerge('h-16 border-r border-[#39C7FF]', heightClassName)}
    />
  );
}

function CircularBox({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={twMerge(
        'flex h-32 w-32 flex-col items-center justify-center rounded-full bg-[#4DCDFF] text-small20 font-bold text-static-100',
        className,
      )}
    >
      {children}
    </div>
  );
}

export default ChallengeIntroPersonalStatement;
