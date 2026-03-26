import SolutionBox from './SolutionBox';

const content = [
  {
    imgName: 'lets-solution.svg',
    imgWidthClassName: 'w-[3.78rem] xl:w-[5.75rem]',
    title: '렛츠(Let’s)!',
    description:
      "'함께 해보자'는 말처럼, 렛츠커리어는 독자적인 커리어 교육 프로그램으로 나만의 이야기를 만들어 가는 방법을 함께 합니다.",
  },
  {
    imgName: 'career-solution.svg',
    imgWidthClassName: 'w-[4rem] xl:w-[5.8rem]',
    title: '커리어 프로그램',
    description:
      '정보찾기부터 활용하기, 자신을 되돌아보기까지 여러 프로그램을 제공합니다. 막막함을 느끼지 않게 러닝 메이트가 되어 드립니다.',
  },
  {
    imgName: 'community-solution.svg',
    imgWidthClassName: 'w-[4.3rem] xl:w-[6rem]',
    title: '선순환 커뮤니티',
    description:
      '렛츠커리어 프로그램을 통해 성장한 참여자들은, 다른 이들의 시작을 돕는 커뮤니티의 일원이 될 수 있습니다.',
  },
];

const SolutionSection = () => {
  return (
    <section className="bg-neutral-100 px-5 py-[3.75rem] sm:px-10 sm:py-[6.25rem] md:flex md:flex-col md:items-center xl:py-[8.75rem]">
      <h1 className="text-1-bold xl:text-1.25-bold mb-2 text-neutral-40">
        커리어 성장
      </h1>
      <div className="text-1.25-bold xl:text-1.75-bold sm:text-1.5-bold mb-[3.75rem] sm:mb-20 md:text-center">
        <span>
          이제 <span className="text-primary">렛츠커리어</span>가
        </span>
        <p className="flex flex-col sm:flex-row sm:gap-1">
          <span>취업준비생과 주니어의</span>
          <span>길라잡이가 되겠습니다</span>
        </p>
      </div>
      <div className="flex max-w-[63.75rem] flex-col gap-20 md:flex-row md:gap-[3.56rem] xl:gap-[7.5rem]">
        {content.map((item) => (
          <SolutionBox key={item.title} {...item} />
        ))}
      </div>
    </section>
  );
};

export default SolutionSection;
