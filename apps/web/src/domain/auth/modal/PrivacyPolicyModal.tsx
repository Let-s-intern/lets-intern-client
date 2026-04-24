import cn from 'classnames';

import PrivacyLink from '../ui/PrivacyLink';

interface PrivacyPolicyModalProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const PrivacyPolicyModal = ({
  showModal,
  setShowModal,
}: PrivacyPolicyModalProps) => {
  return (
    <>
      <div
        className={cn(
          'fixed left-0 top-0 z-[999] h-full w-full bg-black bg-opacity-50',
          {
            block: showModal,
            hidden: !showModal,
          },
        )}
      >
        <div
          className="fixed left-1/2 top-1/2 z-[1000] w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-xxs bg-white p-8 md:px-12 md:py-16"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="mb-4 text-center text-2xl font-semibold">
            개인정보 수집 및 이용 동의서
          </h2>
          <p className="my-4 w-full">
            아이엔지는 렛츠커리어 서비스 회원가입, 고객상담, 고지사항 전달 등을
            위해 아래와 같이 개인정보를 수집*이용합니다.
          </p>
          <table className="w-full table-fixed border-collapse text-sm">
            <thead>
              <tr>
                <th className="border border-neutral-200 px-2 py-1 text-start font-semibold">
                  수집목적
                </th>
                <th className="border border-neutral-200 px-2 py-1 text-start font-semibold">
                  수집항목
                </th>
                <th className="border border-neutral-200 px-2 py-1 text-start font-semibold">
                  수집기간
                </th>
                <th className="border border-neutral-200 px-2 py-1 text-start font-semibold">
                  수집근거
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="break-keep border border-neutral-200 p-2">
                  - 회원가입 및 서비스 이용
                  <br />- 고지사항 전달(프로그램 참여 방법 및 일정, 장소 안내 /
                  후기작성)
                </td>
                <td className="break-keep border border-neutral-200 p-2">
                  이메일주소, 이름, 휴대폰 번호, 비밀번호
                </td>
                <td className="break-keep border border-neutral-200 p-2">
                  회원 탈퇴 후 30일까지
                </td>
                <td className="break-keep border border-neutral-200 p-2">
                  개인정보 보호법 제 15조 제1항
                </td>
              </tr>
            </tbody>
          </table>
          <p className="mt-4">
            귀하는 렛츠커리어 서비스 이용에 필요한 개인정보 수집*이용에 동의하지
            않을 수 있으나, 동의를 거부할 경우 회원제 서비스 이용이 불가합니다.
          </p>
          <p>
            개인정보처리내용에 대해서는&nbsp;
            <PrivacyLink
              onClick={(e) => {
                e.stopPropagation();
                window.open(
                  'https://letsintern.notion.site/c3af485bfced49ab9601f2d7bf07657d?pvs=4',
                  '_blank',
                );
              }}
            >
              개인정보처리방침
            </PrivacyLink>
            을 확인해주세요.
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

export default PrivacyPolicyModal;
