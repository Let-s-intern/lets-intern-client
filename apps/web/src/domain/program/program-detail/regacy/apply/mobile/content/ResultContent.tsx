import formatDateString from '../../../../../../../utils/formatDateString';

interface ResultContentProps {
  announcementDate: string;
}

const ResultContent = ({ announcementDate }: ResultContentProps) => {
  return (
    <div className="py-10 text-center">
      <h1 className="text-lg font-medium">제출이 완료되었습니다.</h1>
      <p className="mt-3 text-gray-500">
        <b className="font-medium">합격 발표 일자</b>
        <br />
        <span>{formatDateString(announcementDate)}</span>
      </p>
    </div>
  );
};

export default ResultContent;
