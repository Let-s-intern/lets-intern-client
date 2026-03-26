'use client';

import TextArea from '@/common/input/TextArea';
import { useState } from 'react';

export default function TextAreaTest() {
  const [value, setValue] = useState('');

  return (
    <TextArea
      id="goal"
      name="goal"
      wrapperClassName="h-28"
      placeholder={`챌린지를 신청한 목적과 계기,\n또는 챌린지 참여를 통해 이루고 싶은 목표를 자유롭게 작성해주세요.`}
      className="text-xsmall14 font-normal"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      maxLength={200}
    />
  );
}
