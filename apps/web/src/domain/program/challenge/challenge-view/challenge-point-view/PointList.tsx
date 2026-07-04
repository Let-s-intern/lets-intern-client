import dynamic from 'next/dynamic';

const Balancer = dynamic(() => import('react-wrap-balancer'), { ssr: false });

function PointList({
  item,
  index,
  listBgColor,
  listPointBgColor,
}: {
  item: {
    id: string;
    title: string;
    subtitle: string;
  };
  index: number;
  listBgColor: string;
  listPointBgColor: string;
}) {
  return (
    <li
      key={item.id}
      className="mx-auto flex w-full flex-col items-center gap-5 self-stretch rounded-md p-8 md:pb-10"
      style={{ backgroundColor: listBgColor }}
    >
      <div className="break-keep text-center">
        <span
          className="text-xsmall14 md:text-small18 rounded-md px-3.5 py-1.5 font-semibold text-white"
          style={{ backgroundColor: listPointBgColor }}
        >
          Point {index + 1}
        </span>
      </div>
      <div>
        <h3 className="text-small20 text-neutral-0 mb-2 break-keep text-center font-bold">
          <Balancer fallback={<span>{item.title}</span>}>{item.title}</Balancer>
        </h3>
        <p className="text-xsmall16 text-neutral-40 break-keep text-center font-medium">
          <Balancer fallback={<span>{item.subtitle}</span>}>
            {item.subtitle}
          </Balancer>
        </p>
      </div>
    </li>
  );
}

export default PointList;
