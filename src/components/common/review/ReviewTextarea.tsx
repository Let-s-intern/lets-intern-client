import { memo } from 'react';

import TextArea, { TextAreaProps } from '../ui/input/TextArea';

function ReviewTextarea(props: TextAreaProps) {
  return <TextArea {...props} wrapperClassName="h-28" maxLength={500} />;
}

export default memo(ReviewTextarea);
