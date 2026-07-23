/**
 * 앵콜 요청 버튼용 확성기 아이콘.
 * 원본 SVG의 stroke(#EFEFEF)를 currentColor로 바꿔 버튼 상태별 글자색을 따라가게 한다.
 */
const MegaphoneIcon = ({ className }: { className?: string }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    className={className}
    aria-hidden
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5.30435 10.0875H4.06522C3.51749 10.0875 2.99219 9.86987 2.60489 9.48257C2.21758 9.09526 2 8.56997 2 8.02224C2 7.47451 2.21758 6.94921 2.60489 6.56191C2.99219 6.17461 3.51749 5.95702 4.06522 5.95702H5.30435M5.30435 10.0875V5.95702M5.30435 10.0875C7.72817 10.0877 10.0977 10.8051 12.1146 12.1494L12.7391 12.5657V3.47876L12.1146 3.89511C10.0977 5.23939 7.72817 5.95681 5.30435 5.95702M5.30435 10.0875C5.30403 10.6282 5.41371 11.1634 5.62674 11.6605C5.83976 12.1575 6.15166 12.606 6.54348 12.9788M14.3913 7.19615V8.84832"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default MegaphoneIcon;
