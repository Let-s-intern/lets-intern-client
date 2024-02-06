import RoundedBox from '../box/RoundedBox';
import Button from '../../ui/button/Button';
import SectionHeading from '../heading/SectionHeading';
import MissionResultItem from '../item/MissionResultItem';

const MissionResultSection = () => {
  return (
    <RoundedBox as="section" className="px-8 py-6">
      <div className="flex items-center justify-between">
        <SectionHeading>미션 제출 현황</SectionHeading>
        <Button>환급하기</Button>
      </div>
      <div className="mt-4 grid grid-cols-7 gap-y-6">
        {Array.from({ length: 3 }, (_, index) => index + 1).map(
          (day, index) => (
            <MissionResultItem
              key={index}
              day={day}
              date={`1/${14 + day}`}
              count={70 + day}
              totalCount={100}
              status="DONE"
            />
          ),
        )}
        <MissionResultItem
          day={4}
          date={`1/${14 + 4}`}
          count={70 + 4}
          totalCount={100}
          status="WAITING"
        />
        {Array.from({ length: 10 }, (_, index) => index + 5).map(
          (day, index) => (
            <MissionResultItem
              key={index}
              day={day}
              date={`1/${14 + day}`}
              totalCount={100}
              isEnd={day === 14}
              status="NOT_STARTED"
            />
          ),
        )}
      </div>
    </RoundedBox>
  );
};

export default MissionResultSection;
