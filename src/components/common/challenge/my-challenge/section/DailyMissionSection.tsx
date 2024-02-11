import { Link } from 'react-router-dom';
import { formatMissionDateString } from '../../../../../utils/formatDateString';

interface Props {
  dailyMission: any;
}

const DailyMissionSection = ({ dailyMission }: Props) => {
  return (
    <section className="mt-5 text-[#333333]">
      <h2 className="text-lg font-bold">데일리 미션</h2>
      <div className="mt-2 rounded bg-[#F6F8FB] px-12 py-8">
        <div>
          <div>
            <div className="flex items-end gap-2">
              <h3 className="text-xl font-semibold">
                {dailyMission.th}일차. {dailyMission.title}
              </h3>
              <span className="text-sm text-[#4A495C]">
                마감 {formatMissionDateString(dailyMission.endDate)}까지
              </span>
            </div>
            <p className="mt-2 text-black">{dailyMission.contents}</p>
            <div className="mt-3">
              <h4 className="text-sm font-semibold text-[#898989]">
                미션 가이드
              </h4>
              <p className="mt-1 text-black">{dailyMission.guide}</p>
            </div>
            <div className="mt-5 flex gap-4">
              <Link
                to={dailyMission.template}
                className="flex-1 rounded border border-[#DCDCDC] bg-white px-8 py-2 text-center font-semibold shadow"
                target="_blank"
              >
                미션 템플릿
              </Link>
              <button className="flex-1 rounded bg-primary px-4 py-2 font-semibold text-white shadow">
                학습 콘텐츠
              </button>
            </div>
          </div>
        </div>
        <hr className="my-8 border-[0.5px] border-[#DEDEDE]" />
        <form>
          <h3 className="text-lg font-semibold">미션 제출하기</h3>
          <p className="mt-2">
            링크 제대로 확인해 주세요. 카톡으로 공유해야 미션 제출 인정됩니다.
          </p>
          <div className="mt-4 flex items-stretch gap-4">
            <label
              htmlFor="link"
              className="flex items-center font-semibold text-[#626262]"
            >
              링크
            </label>
            <input
              type="text"
              className="flex-1 rounded-lg border border-[#A3A3A3] bg-[#F6F8FB] px-3 py-2 text-sm outline-none"
              id="link"
              name="link"
              placeholder="제출할 링크를 입력해주세요."
            />
            <button
              type="button"
              className="rounded bg-[#7D7D7D] px-5 font-medium text-white"
            >
              링크 확인
            </button>
          </div>
          <div className="mt-6 text-right">
            <button
              type="submit"
              className="rounded border border-[#DCDCDC] bg-white px-5 py-2 text-center font-semibold"
            >
              제출
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default DailyMissionSection;
