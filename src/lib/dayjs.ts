import dayjs_1 from 'dayjs';
import 'dayjs/locale/ko';
import duration from 'dayjs/plugin/duration';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs_1.locale('ko');
dayjs_1.extend(utc);
dayjs_1.extend(timezone);
dayjs_1.extend(duration);
dayjs_1.extend(isSameOrAfter);
dayjs_1.tz.setDefault('Asia/Seoul');
dayjs_1.extend(isBetween);
const dayjs = dayjs_1;
export default dayjs;
