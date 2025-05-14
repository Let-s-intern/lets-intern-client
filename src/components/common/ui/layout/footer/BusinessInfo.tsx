const info = {
  TITLE: '아이엔지 사업자 정보',
  OWNER: '대표자: 송다예',
  REGISTRATION_NUMBER: '사업자 등록번호: 871-11-02629',
  MAIL_ORDER_SALES_REPORT_NUMBER: '통신판매업신고번호 제 2024-서울마포-2221호',
  ADDRESS: '주소: 서울특별시 광나루로 190 B동 611호',
  EMAIL: '이메일: official@letscareer.co.kr',
  CUSTOMER_SERVICE_NUMBER: '고객센터: 0507-0178-8541',
  COPTYRIGHT: 'Copyright ©2024 아이엔지. All rights reserved.',
};

function BusinessInfo() {
  return (
    <div className="text-0.75-medium flex flex-col gap-2 text-neutral-45">
      <span>{info.TITLE}</span>
      <span>
        {info.OWNER} | {info.REGISTRATION_NUMBER}
      </span>
      <span>{info.MAIL_ORDER_SALES_REPORT_NUMBER} |</span>
      <span>{info.ADDRESS} |</span>
      <span>{info.EMAIL} |</span>
      <span>{info.CUSTOMER_SERVICE_NUMBER} |</span>
      <span>{info.COPTYRIGHT}</span>
    </div>
  );
}

export default BusinessInfo;
