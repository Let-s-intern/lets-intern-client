import AboutTitleDark from '../../ui/AboutTitleDark';

const TITLE = {
  subTitle: '참여자 만족도 4.8점',
  title: '렛츠커리어가 이뤄낸 성과',
};

interface ResultTitleProps {
  title: string;
}

interface ResultScoreProps {
  children: React.ReactNode;
}

const ResultSection = () => {
  return (
    <section className="bg-[#101348] px-5 py-[3.75rem]">
      <AboutTitleDark {...TITLE} />
      <div className="flex flex-col gap-10">
        <div>
          <ResultLine />
          <ResultTitle title="프로그램 수" />
          <ResultScore>59개</ResultScore>
        </div>
        <div>
          <ResultLine />
          <ResultTitle title="참여자 수" />
          <ResultScore>1,600명</ResultScore>
        </div>
        <div>
          <ResultLine />
          <div className="flex items-center gap-1">
            <ResultTitle title="합격자 수" />
            <span className="text-0.75 text-neutral-40">*24년 4월 기준</span>
          </div>
          <ResultScore>160명</ResultScore>
        </div>
        <div>
          <ResultLine />
          <ResultTitle title="참여자 만족도" />
          <ResultScore>4.8점</ResultScore>
        </div>
      </div>
    </section>
  );
};

const ResultLine = () => {
  return <div className="mb-3 h-0.5 w-full bg-neutral-100" />;
};

const ResultTitle = ({ title }: ResultTitleProps) => {
  return <h2 className="text-0.875-medium text-neutral-100">{title}</h2>;
};

const ResultScore = ({ children }: ResultScoreProps) => {
  return <p className="text-1.75-bold mt-1 text-neutral-100">{children}</p>;
};

export default ResultSection;
