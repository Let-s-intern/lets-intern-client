const content = [
  '1:1 채팅 상담: 우측 하단 [문의하기] 클릭',
  '- 평일 및 주말 09:00-21:00 상담 가능',
  '전화 상담: 채팅 상담을 통해 신청 가능',
  '이메일 상담: official@letscareer.co.kr',
];

function CustomerSupport() {
  return (
    <div className="text-0.875 w-80">
      <span className="text-neutral-0">고객센터</span>
      <p className="mt-2 flex flex-col text-neutral-0/65">
        {content.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </p>
    </div>
  );
}

export default CustomerSupport;
