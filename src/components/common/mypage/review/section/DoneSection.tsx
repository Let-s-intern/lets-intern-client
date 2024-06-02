const DoneSection = () => {
  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold">작성된 후기</h1>
      <div className="flex gap-4 md:flex-col">
        <div className="flex w-full flex-col items-center gap-4 py-20">
          <p className="text-neutral-0 text-opacity-[36%]">
            작성한 후기가 아직 없어요.
          </p>
        </div>
        {/* {applicationList.map((application) => ( */}
        {/* <ApplicationCard
          hasReviewButton
          grayscale
          reviewButton={{ text: '수정하기' }}
        /> */}
        {/* ))} */}
      </div>
      {/* <Button className="hidden md:flex">더보기</Button> */}
    </section>
  );
};

export default DoneSection;
