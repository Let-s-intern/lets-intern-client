import styled from 'styled-components';

import CardListSlider from '../CardListSlider';
import ApplicationCard from './ApplicationCard';
import { Section, SectionTitle } from '../Section';
import Placeholder from '../Placeholder';

interface ApplicationProps {
  loading: boolean;
  error: unknown;
  appliedList: any;
  inProgressList: any;
  doneList: any;
  statusToLabel: any;
  fetchApplicationDelete: (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    applicationId: number,
    status: string,
  ) => void;
}

const Application = ({
  loading,
  error,
  appliedList,
  inProgressList,
  doneList,
  statusToLabel,
  fetchApplicationDelete,
}: ApplicationProps) => {
  if (loading) {
    return <ApplicationBlock>로딩중...</ApplicationBlock>;
  }

  if (error) {
    return <ApplicationBlock>에러 발생</ApplicationBlock>;
  }

  return (
    <ApplicationBlock>
      <Section>
        <SectionTitle>신청완료</SectionTitle>
        <CardListSlider>
          {!appliedList || appliedList.length === 0 ? (
            <Placeholder>신청한 내역이 없습니다.</Placeholder>
          ) : (
            appliedList.map((application: any) => (
              <ApplicationCard
                key={application.id}
                application={application}
                statusToLabel={statusToLabel}
                fetchApplicationDelete={fetchApplicationDelete}
              />
            ))
          )}
        </CardListSlider>
      </Section>
      <Section>
        <SectionTitle>참여중</SectionTitle>
        <CardListSlider>
          {!inProgressList || inProgressList.length === 0 ? (
            <Placeholder>참여한 내역이 없습니다.</Placeholder>
          ) : (
            inProgressList.map((application: any) => (
              <ApplicationCard
                key={application.id}
                application={application}
                statusToLabel={statusToLabel}
                fetchApplicationDelete={fetchApplicationDelete}
              />
            ))
          )}
        </CardListSlider>
      </Section>
      <Section>
        <SectionTitle>참여완료</SectionTitle>
        <CardListSlider>
          {!doneList || doneList.length === 0 ? (
            <Placeholder>참여 완료한 내역이 없습니다.</Placeholder>
          ) : (
            doneList.map((application: any) => (
              <ApplicationCard
                key={application.id}
                application={application}
                statusToLabel={statusToLabel}
                fetchApplicationDelete={fetchApplicationDelete}
              />
            ))
          )}
        </CardListSlider>
      </Section>
    </ApplicationBlock>
  );
};

export default Application;

const ApplicationBlock = styled.div``;
