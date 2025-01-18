import { memo } from 'react';

import TextArea, { TextAreaProps } from '../ui/input/TextArea';

interface Props extends TextAreaProps {}

function ReviewTextarea(props: Props) {
  return <TextArea maxLength={500} rows={3} placeholder={props.placeholder} />;
}

export default memo(ReviewTextarea);
