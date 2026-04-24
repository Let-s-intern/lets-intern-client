interface MarketingModalProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const MarketingModal = ({ showModal, setShowModal }: MarketingModalProps) => {
  return (
    <>
      <div
        className={`fixed left-0 top-0 z-[999] h-full w-full bg-black/50 ${
          showModal ? 'block' : 'hidden'
        }`}
      >
        <div
          className="fixed left-1/2 top-1/2 z-[1000] w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-xxs bg-white p-8 md:px-12 md:py-16"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="mb-4 text-center text-2xl font-semibold">
            마케팅 수신 동의
          </h2>
          <table className="w-full table-fixed border-collapse text-sm">
            <thead>
              <tr>
                <th className="border border-neutral-200 px-2 py-1 text-start font-semibold">
                  목적
                </th>
                <th className="border border-neutral-200 px-2 py-1 text-start font-semibold">
                  항목
                </th>
                <th className="border border-neutral-200 px-2 py-1 text-start font-semibold">
                  보유기간
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="break-keep border border-neutral-200 p-2">
                  아이엔지가 제공하는 이용자 맞춤형 서비스 및 프로그램 추천,
                  각종 경품 행사, 이벤트의 광고성 정보 제공 (이메일, SMS,
                  카카오톡 등)
                </td>
                <td className="break-keep border border-neutral-200 p-2">
                  이름, 이메일주소, 휴대폰번호, 마케팅 수신 동의 여부
                </td>
                <td className="break-keep border border-neutral-200 p-2">
                  회원 탈퇴 후 30일 도는 동의 철회시까지
                </td>
              </tr>
            </tbody>
          </table>
          <p className="mt-4 text-sm">
            본 마케팅 정보 수신에 대한 동의를 거부하실 수 있으며, 이 경우
            회원가입은 가능하나 일부 서비스 이용 및 각종 광고, 할인, 이벤트 및
            이용자 맞춤형 상품 추천 등의 서비스 제공이 제한될 수 있습니다.
          </p>
          <div className="mt-8 w-full text-center">
            <button
              className="rounded rounded-xxs bg-primary px-4 py-2 text-white"
              type="button"
              onClick={() => setShowModal(false)}
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MarketingModal;
