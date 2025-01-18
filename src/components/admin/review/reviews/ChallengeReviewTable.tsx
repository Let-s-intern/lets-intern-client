import { useState } from 'react';

import Table from '@/components/admin/ui/table/regacy/Table';
import { ReviewType } from '@/schema';
import ChallengeReviewTableBody from './table-content/ChallengeReviewTableBody';
import ChallengeReviewTableHeader, {
  ReviewTableHeaderProps,
} from './table-content/ChallengeReviewTableHeader ChallengeReviewTableHeader';

interface Props {
  type: string;
  reviewList: ReviewType[];
}

function ChallengeReviewTable({ type, reviewList }: Props) {
  const [filter, setFilter] = useState<ReviewTableHeaderProps['filter']>({
    programTitle: null,
    createdDate: null,
  });

  return (
    <Table minWidth={1000}>
      <ChallengeReviewTableHeader filter={filter} setFilter={setFilter} />
      <ChallengeReviewTableBody
        type={type}
        programTitle={filter.programTitle}
        createDate={filter.createdDate}
        reviewList={reviewList}
      />
    </Table>
  );
}

export default ChallengeReviewTable;
