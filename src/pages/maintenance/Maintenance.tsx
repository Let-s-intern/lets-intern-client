const Maintenance = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-6rem)]">
      <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center sm:h-[calc(100vh-6rem)]">
        <div className="h-40 w-40">
          <img
            src="/images/maintenance/maintenance.png"
            alt="렛츠커리어 아이콘"
          />
        </div>
        <h1 className="text-neutral-black text-center text-2xl font-semibold">
          렛츠커리어 웹사이트 리뉴얼
        </h1>
        <p className="mt-2 text-center">
          유저분들이 더 편하게 커리어의 첫걸음을 함께할 수 있도록 웹사이트를
          리뉴얼 중이에요! <br /> 오늘 밤 새로워진 기능과 도메인으로 찾아올게요!
          🙌
        </p>
      </div>
    </div>
  );
};

export default Maintenance;
