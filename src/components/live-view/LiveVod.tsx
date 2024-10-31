const title = 'VOD 녹화본 제공 🎬';

function LiveVod() {
  return (
    <div className="rounded-md bg-neutral-95 px-5 py-6 lg:text-center">
      <span className="text-small18 font-bold text-primary lg:text-medium22">
        {title}
      </span>
      <p className="mt-2.5 text-justify text-xsmall16 font-medium text-neutral-40 lg:text-center lg:text-small20">
        결제하신 모든 분들께{' '}
        <span className="text-primary">세션 VOD 녹화본</span>이 이메일로
        전송됩니다. LIVE 시간에 일정이 맞지 않더라도 결제 후 편하게 받아보세요!
      </p>
    </div>
  );
}

export default LiveVod;
