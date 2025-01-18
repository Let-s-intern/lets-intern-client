import { memo } from 'react';

import TextArea, { TextAreaProps } from '../ui/input/TextArea';

interface Props extends TextAreaProps {}

function ReviewTextarea(props: Props) {
  return (
    <TextArea
      wrapperClassName="h-28"
      maxLength={500}
      placeholder={props.placeholder}
    />
  );
}

export default memo(ReviewTextarea);
