import { memo } from 'react';

import TextArea, { TextAreaProps } from '../ui/input/TextArea';

interface Props extends TextAreaProps {}

function ReviewTextarea(props: Props) {
  return (
    <TextArea
      className="text-xsmall14 placeholder:text-black/35"
      maxLength={500}
      rows={3}
      placeholder={props.placeholder}
    />
  );
}

export default memo(ReviewTextarea);
