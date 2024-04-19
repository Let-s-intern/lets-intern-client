import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

import axios from '../../../../../../../utils/axios';
import ProgramApply from './ProgramApply';
import StartPriceContent from '../../../ui/price/StartPriceContent';

interface ApplySectionProps {
  program: any;
  participated: boolean;
  isLoggedIn: boolean;
  wishJobList: any;
  setParticipated: (participated: boolean) => void;
  couponDiscount: number;
  setCouponDiscount: (couponDiscount: number) => void;
}

const ApplySection = ({
  program,
  participated,
  isLoggedIn,
  wishJobList,
  setParticipated,
  couponDiscount,
  setCouponDiscount,
}: ApplySectionProps) => {
  const params = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [hasDetailInfo, setHasDetailInfo] = useState(false);
  const [isFirstOpen, setIsFirstOpen] = useState<boolean>(true);
  const [memberChecked, setMemberChecked] = useState<'USER' | 'GUEST' | ''>('');
  const [isApplyModalOpen, setIsApplyModalOpen] = useState<boolean>(false);
  const [applyPageIndex, setApplyPageIndex] = useState<number>(0);

  const handleApplyButtonClick = async () => {
    if (
      (program.type === 'CHALLENGE_FULL' ||
        program.type === 'CHALLENGE_HALF') &&
      !isLoggedIn
    ) {
      navigate(`/login?redirect_url=/program/detail/${params.programId}`);
      return;
    }
    if (!isFirstOpen) {
      setIsApplyModalOpen(true);
      return;
    }
    try {
      if (isLoggedIn) {
        const { data: hasDetailInfoData } =
          await axios.get('/user/detail-info');
        setHasDetailInfo(hasDetailInfoData);

        const res = await axios.get(`/user`);
        setUser({
          ...res.data,
          major: hasDetailInfoData ? res.data.major : '',
          university: hasDetailInfoData ? res.data.university : '',
        });
        setMemberChecked('USER');
      } else {
        setUser({});
        setMemberChecked('');
      }
      setIsApplyModalOpen(true);
      if (isLoggedIn) {
        setApplyPageIndex(1);
      }
      setIsFirstOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <ApplySectionBlock>
        <ApplyButtonWrapper>
          <div className="flex w-full items-center gap-3 rounded-xs border border-neutral-75 px-4 py-2 sm:px-6 sm:py-3">
            <StartPriceContent
              className="flex-1"
              programFee={{
                feeType: program.feeType,
                feeCharge: program.feeCharge,
                feeRefund: program.feeRefund,
                discountValue: program.discountValue,
              }}
            />
            <button
              id="apply_button"
              className="text-0.875-semibold rounded-xs bg-primary px-4 py-2 text-static-100 disabled:bg-primary-light"
              disabled={program.status !== 'OPEN' || participated}
              onClick={() => {
                if (!participated) {
                  handleApplyButtonClick();
                }
              }}
            >
              {program.status !== 'OPEN'
                ? '신청 마감'
                : participated
                ? '신청 완료'
                : isFirstOpen
                ? '신청하기'
                : '이어서 하기'}
            </button>
          </div>
        </ApplyButtonWrapper>
      </ApplySectionBlock>
      <ProgramApply
        user={user}
        hasDetailInfo={hasDetailInfo}
        isLoggedIn={isLoggedIn}
        program={program}
        memberChecked={memberChecked}
        applyPageIndex={applyPageIndex}
        wishJobList={wishJobList}
        setMemberChecked={setMemberChecked}
        setApplyPageIndex={setApplyPageIndex}
        setUser={setUser}
        setParticipated={setParticipated}
        isApplyModalOpen={isApplyModalOpen}
        setIsApplyModalOpen={setIsApplyModalOpen}
        couponDiscount={couponDiscount}
        setCouponDiscount={setCouponDiscount}
      />
    </>
  );
};

export default ApplySection;

const ApplySectionBlock = styled.section`
  position: sticky;
  bottom: 1.5rem;
  left: 0;
  z-index: 30;
  margin-top: 5rem;

  @media (min-width: 1024px) {
    display: none;
  }
`;

const ApplyButtonWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: start;

  @media (min-width: 640px) {
    justify-content: center;
  }
`;
