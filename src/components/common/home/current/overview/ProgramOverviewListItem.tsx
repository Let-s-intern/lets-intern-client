import ProgramThListItem, { ProgramThListItemProps } from './ProgramThListItem';

interface ProgramOverviewListItemProps {
  title: string;
  description: string;
  imageColor?: 'blue' | 'green' | 'purple' | 'yellow';
  programList: ProgramThListItemProps[];
}

const ProgramOverviewListItem = ({
  title,
  description,
  imageColor = 'blue',
  programList,
}: ProgramOverviewListItemProps) => {
  return (
    <div className="rounded-xs overflow-hidden">
      <div
        className="bg-cover px-3 py-8"
        style={{
          backgroundImage: `url(/images/home/program-${imageColor}-bar.svg)`,
        }}
      >
        <h2 className="text-xs-1-semibold">{title}</h2>
        <p className="text-xs-0.875">{description}</p>
      </div>
      <ul>
        {programList.map((program, index) => (
          <ProgramThListItem
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
