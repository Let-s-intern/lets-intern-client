import { COURSE_TAG_LABEL, type CourseTag } from '../data/coursePlan';

/**
 * 범례를 두 갈래로 나눈다 (시안 8).
 * 앞은 패스에 들어 있는 자료, 뒤는 렛츠커리어가 직접 함께하는 단계다.
 * 태그를 더하면 여기 배열에도 넣어야 범례에 나온다.
 */
const MATERIAL_TAGS: CourseTag[] = ['free', 'template', 'checklist', 'vod'];
const LETSCAREER_TAGS: CourseTag[] = ['challenge', 'live', 'mentoring'];

/**
 * 플레이북·주 단위 두 보기 아래에 똑같이 붙는 범례.
 *
 * 범례는 COURSE_TAG_LABEL 에서 만든다. 예전에는 배지 4종을 직접 적어 뒀는데,
 * 태그를 7종으로 늘렸을 때 표에는 새 배지가 뜨고 범례에는 안 떠서 어긋났다.
 * 한 곳에서 만들면 태그를 더해도 범례가 자동으로 따라온다.
 */
export default function CoursePlanLegend() {
  return (
    <p className="cpm-note">
      {MATERIAL_TAGS.map((tag) => (
        <span className="cpm-note-chip" data-tag={tag} key={tag}>
          {COURSE_TAG_LABEL[tag]}
        </span>
      ))}
      는 패스에 포함된 자료,{' '}
      {LETSCAREER_TAGS.map((tag) => (
        <span className="cpm-note-chip" data-tag={tag} key={tag}>
          {COURSE_TAG_LABEL[tag]}
        </span>
      ))}
      은 렛츠커리어가 직접 함께하는 단계예요.
    </p>
  );
}
