import Input from '@/common/input/v1/Input';
import { ProgramTypeUpperCase } from '@/schema';
import { ProgramRecommend } from '@/types/interface';

interface ProgramRecommendItemProps {
  item: ProgramRecommend['list'][number];
  onChangeItem: (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number,
    programType: ProgramTypeUpperCase,
  ) => void;
}

const ProgramRecommendItem = ({
  item,
  onChangeItem,
}: ProgramRecommendItemProps) => {
  return (
    <div className="flex items-center gap-2">
      <div
        className="rounded-xs bg-neutral-60 h-32 w-40 flex-none border"
        style={{
          backgroundImage: `url(${item.programInfo.thumbnail})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="text-xxsmall12 flex h-full items-center justify-center bg-black bg-opacity-30 p-2">
          <span className="text-white">{item.programInfo.title}</span>
        </div>
      </div>
      <div className="flex w-full max-w-xl flex-col gap-2">
        <Input
          label="제목"
          type="text"
          name="recommendTitle"
          placeholder="프로그램 추천 제목을 입력해주세요"
          value={item.recommendTitle ?? ''}
          maxLength={18}
          size="small"
          onChange={(e) =>
            onChangeItem(
              e,
              item.programInfo.id,
              item.programInfo.programType,
            )
          }
        />
        <Input
          label="CTA"
          type="text"
          name="recommendCTA"
          placeholder="프로그램 추천 CTA를 입력해주세요"
          value={item.recommendCTA ?? ''}
          maxLength={16}
          size="small"
          onChange={(e) =>
            onChangeItem(
              e,
              item.programInfo.id,
              item.programInfo.programType,
            )
          }
        />
      </div>
    </div>
  );
};

export default ProgramRecommendItem;
