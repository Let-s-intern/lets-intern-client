import ProgramListItem, { ProgramListItemProps } from './ProgramListItem';

export interface ProgramOverviewListItemProps {
  title: string;
  description: string;
  imageColor?: 'blue' | 'green' | 'purple' | 'yellow';
  programList: ProgramListItemProps[];
}

const ProgramOverviewListItem = ({
  title,
  description,
  imageColor = 'blue',
  programList,
}: ProgramOverviewListItemProps) => {
  return (
    <div className="overflow-hidden rounded-xs">
      <div
        className="bg-cover px-3 py-8 md:px-6"
        style={{
          backgroundImage: `url(/images/home/program-${imageColor}-bar.svg)`,
        }}
      >
        <h2 className="text-1-semibold">{title}</h2>
        <p className="text-0.875">{description}</p>
      </div>
      <ul>
        {programList.map((program, index) => (
          <ProgramListItem
            key={index}
            status={program.status}
            title={program.title}
            openDate={program.openDate}
          />
        ))}
      </ul>
    </div>
  );
};

export default ProgramOverviewListItem;
