const Tooltip = ({ alt }: { alt: string }) => {
  return (
    <div className="h-5 w-5 cursor-pointer">
      <img
        className="h-auto w-full"
        src="/icons/message-question-circle.svg"
        alt={alt}
        onMouseEnter={() => console.log('mouse enter')}
        onMouseLeave={() => console.log('mouse leave')}
      />
      <div>
        진단서 발급 예상 소요기간 서류 진단서 (베이직): 최대 2일 서류 진단서
        (프리미엄) 최대 3일 옵션 (현직자 피드백): 최대 5일
      </div>
    </div>
  );
};

export default Tooltip;
