'use client';

import { useGetParticipationInfo } from '@/api/application';
import { useSearchParams } from 'next/navigation';
import { ChangeEvent, ReactNode, useCallback, useState } from 'react';
import BaseButton from '../ui/button/BaseButton';
import ProgramSection from './ProgramSection';
import TermsAgreement from './TermsAgreement';
import UserSection from './UserSection';

const terms = [
  {
    title: '개인정보 수집 및 이용 동의 (필수)',
    description: (
      <>
        렛츠커리어는 앞서와 같이 귀하로부터 수집한 개인정보를 이용하여{' '}
        <UnderlineText>수집일로부터 고객 동의 철회 시까지</UnderlineText> 앱 내
        푸쉬 알림, 이메일, 문자메시지(SMS, MMS, 모바일 메시징 서비스 포함) 등을
        통하여 귀하에게 렛츠커리어의 서비스 및 상품 추천, 각종 이벤트/혜택 등의
        광고성 정보를 전달할 수 있습니다. 귀하는 이에 대한 동의를 거절할 수
        있습니다. 다만, 동의를 거부할 경우 상품 및 이벤트 정보를 받을 수
        없습니다.
      </>
    ),
  },
  {
    title: '마케팅 및 광고 수신 동의 (필수)',
    description: (
      <>
        렛츠커리어는 귀하의 개인정보를 다음과 같이 수집 및 이용하고자 합니다.{' '}
        <br />
        수집 및 이용 목적: 렛츠커리어의 서비스 및 상품 추천, 각종 이벤트/혜택
        등의 광고성 정보 전달 <br />
        수집하는 개인정보 항목: 성명, 취업 상태, 연락처(휴대전화번호, 이메일
        주소 등) 등 앞의 문답 절차를 통해 제출한 개인정보 일체 <br />
        개인정보의 보유 및 이용기간,{' '}
        <UnderlineText>
          렛츠커리어의 서비스 및 상품 추천, 각종 이벤트/혜택 등의 광고성 정보
          전달을 위해 수집일로부터 고객 동의 철회 시까지 보관됩니다.
        </UnderlineText>{' '}
        동의거부권 및 거부 시 불이익: 위와 같은 개인정보의 수집 및 이용을 거부할
        권리가 있습니다. 다만, 동의를 거부할 경우 상품 및 이벤트 정보를 받을 수
        없습니다.
      </>
    ),
  },
];

const defaultUserInfo = {
  name: '',
  phoneNumber: Array(3).fill(''),
};

function NotificationContainer() {
  const searchParams = useSearchParams();
  const pid = searchParams.get('pid'); // 프로그램 ID

  const { data: userData } = useGetParticipationInfo();

  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const [userInfo, setUserInfo] = useState(defaultUserInfo);
  const [selectedPids, setSelectedPids] = useState(
    Number(pid) ? [Number(pid)] : [],
  ); // 선택한 프로그램 ID 리스트
  const [agreements, setAgreements] = useState([false, false]); // 약관 동의

  const handleChangeUsername = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setUserInfo((prev) => ({
        ...prev,
        name: e.target.value,
      }));
    },
    [],
  );

  const handleChangePhoneNumber = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setUserInfo((prev) => {
        const phoneNumber = prev.phoneNumber;
        const targetName = e.target.name;
        const index = Number(targetName.at(targetName.length - 1));
        phoneNumber[index] = e.target.value;

        return {
          ...prev,
          phoneNumber,
        };
      });
    },
    [],
  );

  const handleChangeOption = useCallback(
    (opt: string) => {
      // '기타'를 선택한 경우
      if (opt === '기타' && !selectedJobs.includes(opt)) {
        setSelectedJobs(['기타']);
        setIsOpenDropdown(false);
        return;
      }
      // 있으면 삭제, 없으면 추가
      setSelectedJobs((prev) =>
        prev.includes(opt)
          ? prev.filter((v) => v !== opt)
          : [...prev.filter((v) => v !== '기타'), opt],
      );
    },
    [selectedJobs],
  );

  return (
    <>
      {/* 프로그램 리스트 */}
      <ProgramSection
        selectedPids={selectedPids}
        onChange={(checked, pid) =>
          checked
            ? setSelectedPids((prev) => [...prev, pid])
            : setSelectedPids((prev) => prev.filter((id) => id !== pid))
        }
      />
      <hr />

      {/* 사용자 정보 */}
      <UserSection
        userData={userData}
        selectedJobs={selectedJobs}
        isOpen={isOpenDropdown}
        openDispatch={setIsOpenDropdown}
        onChangeOption={handleChangeOption}
        onChangeUsername={handleChangeUsername}
        onChangePhoneNumber={handleChangePhoneNumber}
      />
      <hr />

      {/* 약관 동의 */}
      <section className="flex flex-col gap-2 pt-8">
        {terms.map((item, index) => (
          <TermsAgreement
            key={index}
            title={item.title}
            description={item.description}
            checked={agreements[index]}
            onChange={(checked) =>
              setAgreements((prev) => {
                const newArr = [...prev];
                newArr[index] = checked;
                return newArr;
              })
            }
          />
        ))}
      </section>

      {/* 버튼 */}
      <BaseButton disabled className="mb-6 mt-16 w-full">
        신청하기
      </BaseButton>
    </>
  );
}

function UnderlineText({ children }: { children: ReactNode }) {
  return (
    <span className="font-bold underline decoration-neutral-40 underline-offset-2">
      {children}
    </span>
  );
}

export default NotificationContainer;
