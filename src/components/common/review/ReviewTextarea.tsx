import { memo } from 'react';

import TextArea, { TextAreaProps } from '../ui/input/TextArea';

interface Props extends TextAreaProps {}

function ReviewTextarea(props: Props) {
  return (
    <TextArea
      wrapperClassName="h-[5.625rem] "
      maxLength={500}
      placeholder={props.placeholder}
    />
  );
}

export default memo(ReviewTextarea);
