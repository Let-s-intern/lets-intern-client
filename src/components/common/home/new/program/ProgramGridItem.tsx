import { useRouter } from 'next/navigation';
import { IProgramGridItem } from '../../../../../types/Program.interface';

interface ProgramGridItemProps {
  program: IProgramGridItem;
  link: string;
  className: string;
}

const ProgramGridItem = ({
  program,
  link,
  className: linkClassName,
}: ProgramGridItemProps) => {
  const router = useRouter();

  return (
    <li
      onClick={() => {
        if (program.keyword === 'Growth') {
          window.open(link, '_blank');
        } else {
          router.push(link);
        }
      }}
      className={`${linkClassName} group flex h-[225px] cursor-pointer flex-col justify-start rounded-lg border-2 md:h-[300px] lg:h-[440px] ${program.bgColor} ${program.borderColor} relative overflow-hidden px-4 pb-6 pt-[16px] md:pt-[20px] lg:pt-[32px]`}
    >
      <div className="flex flex-col items-start justify-start w-full">
        <div className="flex items-center justify-center rounded-full bg-white px-2 py-1 text-[11px] font-bold leading-[130%] md:px-2.5 md:text-[12px] lg:text-[14px]">
          {program.keyword}
        </div>
        <div
          className={`flex w-full flex-wrap items-center justify-center gap-1 break-keep pt-2 font-bold lg:text-xl ${program.textColor}`}
        >
          {program.title.map((title, idx) => (
            <span key={title + idx}>{title}</span>
          ))}
        </div>
      </div>
      <div className="flex flex-col items-center justify-start w-full mt-4 grow md:mt-7 lg:mt-10">
        <img
          src={program.imgSrc}
          alt={program.keyword}
          className="h-[100px] w-[100px] md:h-[140px] md:w-[140px] lg:h-[200px] lg:w-[200px]"
        />
      </div>
      <div className="absolute left-0 top-0 h-full w-full duration-300 group-hover:backdrop-blur-[2px]" />
      <div className="absolute bottom-0 left-0 flex h-40 w-full flex-wrap items-end bg-gradient-desc px-4 py-5 text-[14px] text-white opacity-0 duration-300 group-hover:opacity-100 lg:text-[16px]">
        <div className="flex flex-col flex-wrap items-start w-full">
          {program.descriptionList.map((description) => (
            <div key={description} className="shrink-0 break-keep">
              {description + ' '}
            </div>
          ))}
        </div>
      </div>
    </li>
  );
};

export default ProgramGridItem;
