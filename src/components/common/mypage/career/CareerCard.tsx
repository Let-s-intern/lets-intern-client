import { UserCareerType } from '@/api/careerSchema';

interface CareerCardProps {
  career: UserCareerType;
}

/**
 * 커리어 조회용 UI
 */
const CareerCard = ({
  career: { position, company, employeeType, startDate, endDate },
}: CareerCardProps) => {
  const handleEdit = () => {
    // TODO: 수정 버튼 클릭 시 동작할 함수
  };

  const handleDelete = () => {
    // TODO: 삭제 버튼 클릭 시 동작할 함수
  };

  return (
    <div className="flex w-full flex-col gap-1 rounded-xs border border-neutral-80 p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-neutral-0">{position}</span>

        <div className="flex items-center gap-2 text-sm text-neutral-35">
          <span className="cursor-pointer px-2" onClick={handleEdit}>
            수정
          </span>
          <span className="h-3 w-[1px] bg-neutral-70" />
          <span className="cursor-pointer px-2" onClick={handleDelete}>
            삭제
          </span>
        </div>
      </div>

      <div className="text-neutral-0">{company}</div>

      <div className="flex items-center gap-2 text-sm text-neutral-0">
        <span>{employeeType}</span>
        <span className="text-neutral-40">
          {startDate} - {endDate}
        </span>
      </div>
    </div>
  );
};

export default CareerCard;
