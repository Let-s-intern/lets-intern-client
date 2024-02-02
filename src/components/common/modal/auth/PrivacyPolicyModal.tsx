import cn from 'classnames';

import PrivacyLink from '../../auth/PrivacyLink';
import styles from './PrivacyPolicyModal.module.scss';

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
          className="fixed left-1/2 top-1/2 z-[1000] w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 bg-white p-8 md:px-12 md:py-16"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="mb-4 text-center text-2xl font-semibold">
            개인정보 수집 및 이용 동의서
          </h2>
          <div className="grid grid-cols-1 border border-black sm:grid-cols-2 md:grid-cols-4">
            <div className={styles.tableItem}>
              <div className={styles.thead}>수집목적</div>
              <div className={styles.tbody}>
                회원가입 및 서비스 이용, 고지사항 전달
              </div>
            </div>
            <div className={styles.tableItem}>
              <div className={styles.thead}>수집항목</div>
              <div className={styles.tbody}>
                이메일주소, 이름, 휴대폰 번호, 비밀번호
              </div>
            </div>
            <div className={styles.tableItem}>
              <div className={styles.thead}>수집기간</div>
              <div className={styles.tbody}>회원 탈퇴 후 30일까지</div>
            </div>
            <div className={styles.tableItem}>
              <div className={styles.thead}>수집근거</div>
              <div className={styles.tbody}>개인정보 보호법 제 15조 제1항</div>
            </div>
          </div>
          <p className="mt-4">
            귀하는 렛츠인턴 서비스 이용에 필요한 개인정보 수집·이용에 동의하지
            않을 수 있으나, 동의를 거부할 경우 회원제 서비스 이용이 불가합니다.
          </p>
          <p>
            개인정보처리내용에 대해서는&nbsp;
            <PrivacyLink
              onClick={(e) => {
                e.stopPropagation();
                window.open(
                  'https://ddayeah.notion.site/22c0a812e31c4eb5afcd64e077d447be?pvs=4',
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
              className="rounded bg-primary px-4 py-2 text-white"
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
