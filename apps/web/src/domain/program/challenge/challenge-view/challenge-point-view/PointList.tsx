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
          className="rounded-md px-3.5 py-1.5 text-xsmall14 font-semibold text-white md:text-small18"
          style={{ backgroundColor: listPointBgColor }}
        >
          Point {index + 1}
        </span>
      </div>
      <div>
        <h3 className="mb-2 break-keep text-center text-small20 font-bold text-neutral-0">
          <Balancer fallback={<span>{item.title}</span>}>{item.title}</Balancer>
        </h3>
        <p className="break-keep text-center text-xsmall16 font-medium text-neutral-40">
          <Balancer fallback={<span>{item.subtitle}</span>}>
            {item.subtitle}
          </Balancer>
        </p>
      </div>
    </li>
  );
}

export default PointList;
