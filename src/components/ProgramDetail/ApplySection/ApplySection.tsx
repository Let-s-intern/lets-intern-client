import styled from 'styled-components';

import Button from '../../Button';
import { useState } from 'react';
import axios from '../../../utils/axios';
import ProgramApply from './ProgramApply';

interface ApplySectionProps {
  program: any;
  participated: boolean;
  isLoggedIn: boolean;
  setParticipated: (participated: boolean) => void;
}

const ApplySection = ({
  program,
  participated,
  isLoggedIn,
  setParticipated,
}: ApplySectionProps) => {
  const [user, setUser] = useState<any>(null);
  const [hasDetailInfo, setHasDetailInfo] = useState(false);
  const [isFirstOpen, setIsFirstOpen] = useState<boolean>(true);
  const [memberChecked, setMemberChecked] = useState<'USER' | 'GUEST' | ''>('');
  const [isApplyModalOpen, setIsApplyModalOpen] = useState<boolean>(false);
  const [applyPageIndex, setApplyPageIndex] = useState<number>(0);

  const handleApplyButtonClick = async () => {
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
          <ApplyButton
            id="apply_button"
            className="apply-button"
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
              : '이어서 신청하기'}
          </ApplyButton>
        </ApplyButtonWrapper>
      </ApplySectionBlock>
      {isApplyModalOpen && (
        <ProgramApply
          user={user}
          hasDetailInfo={hasDetailInfo}
          isLoggedIn={isLoggedIn}
          program={program}
          memberChecked={memberChecked}
          applyPageIndex={applyPageIndex}
          setMemberChecked={setMemberChecked}
          setApplyPageIndex={setApplyPageIndex}
          setUser={setUser}
          setParticipated={setParticipated}
          setIsApplyModalOpen={setIsApplyModalOpen}
        />
      )}
    </>
  );
};

export default ApplySection;

const ApplySectionBlock = styled.section`
  position: sticky;
  bottom: 1rem;
  left: 0;
  z-index: 30;
  margin-top: 5rem;

  @media (min-width: 1080px) {
    display: none;
  }
`;

const ApplyButtonWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: start;
  padding: 0 1rem;

  @media (min-width: 640px) {
    justify-content: center;
  }
`;

const ApplyButton = styled(Button)`
  display: block;
  width: 100%;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);

  @media (min-width: 640px) {
    width: auto;
  }
`;
