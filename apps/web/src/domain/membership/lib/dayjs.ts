import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import duration from 'dayjs/plugin/duration';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.locale('ko');
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);
dayjs.tz.setDefault('Asia/Seoul');

export default dayjs;
