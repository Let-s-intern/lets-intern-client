import { memo } from 'react';

import TextArea, { TextAreaProps } from '../../common/input/TextArea';

function ReviewTextarea(props: TextAreaProps) {
  return (
    <TextArea
      {...props}
      wrapperClassName="h-[8.25rem] scrollbar-hide"
      className="scrollbar-hide"
      maxLength={500}
    />
  );
}

export default memo(ReviewTextarea);
