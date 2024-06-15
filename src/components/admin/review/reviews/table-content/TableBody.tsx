import dayjs from 'dayjs';
import 'dayjs/locale/ko';

import TD from '../../../ui/table/regacy/TD';
import ActionButton from '../../../ui/button/ActionButton';

export interface ReviewTableBodyProps {
  programList: {
    programInfo: {
      id: number;
      title: string;
      startDate: string;
      programType: string;
    };
  }[];
  copyReviewCreateLink: any;
}

const TableBody = ({
  programList,
  copyReviewCreateLink,
}: ReviewTableBodyProps) => {
  return (
    <thead>
      {programList.map((program) => (
        <tr key={`${program.programInfo.programType}${program.programInfo.id}`}>
          <TD whiteSpace="wrap">{program.programInfo.title}</TD>
          <TD>
            {program.programInfo.startDate
              ? dayjs(program.programInfo.startDate).format(
                  'YYYY년 MM월 DD일 (ddd) A hh:mm',
                )
              : '온라인'}
          </TD>
          <TD>
            <div className="flex justify-center gap-2">
              <ActionButton
                to={`/admin/reviews/${program.programInfo.id}?type=${program.programInfo.programType}`}
                bgColor="blue"
              >
                상세
              </ActionButton>
              <ActionButton
                bgColor="lightBlue"
                width="6rem"
                onClick={() => copyReviewCreateLink(program.programInfo.id)}
              >
                링크 복사하기
              </ActionButton>
            </div>
          </TD>
        </tr>
      ))}
    </thead>
  );
};

export default TableBody;
