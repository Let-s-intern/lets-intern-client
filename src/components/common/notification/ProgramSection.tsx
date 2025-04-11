import { useSearchParams } from 'next/navigation';
import { memo } from 'react';
import CheckListItem from './CheckListItem';
import InstructionText from './InstructionText';

const programs = [
  {
    programId: 1,
    title:
      '[LIVE 워크숍] 링크드인 시작 방법부터 아티클 작성 계획까지 세우고 싶다면?',
  },
  {
    programId: 2,
    title: '[피드백] 이력서 진단 REPORT, 자기소개서 진단 REPORT ',
  },
  {
    programId: 3,
    title: '[챌린지] 자기소개서 2주 완성 / 포트폴리오 2주 완성 챌린지',
  },
  {
    programId: 4,
    title:
      '[LIVE 워크숍] 링크드인 시작 방법부터 아티클 작성 계획까지 세우고 싶다면?',
  },
];

interface Props {
  selectedPids: number[];
  onChange: (checked: boolean, pid: number) => void;
}

function ProgramSection({ selectedPids, onChange }: Props) {
  const searchParams = useSearchParams();
  const pid = searchParams.get('pid'); // 프로그램 ID

  const instruction = pid ? (
    <>
      ✅ 선택하신 프로그램이 출시되면 제일 먼저 알려드릴게요. <br />
      추가로 알림을 받고 싶은 프로그램이 있다면 모두 선택해 주세요.
    </>
  ) : (
    <>
      출시 알림을 받고 싶은 프로그램을 <br className="md:hidden" />
      모두 선택해 주세요.
    </>
  );

  return (
    <section className="mb-8">
      <InstructionText>{instruction}</InstructionText>
      <ul className="mt-5 flex flex-col gap-4">
        {programs.map((item) => (
          <CheckListItem
            key={item.programId}
            checked={selectedPids.includes(item.programId)}
            onChange={(checked) => onChange(checked, item.programId)}
          >
            {item.title}
          </CheckListItem>
        ))}
      </ul>
    </section>
  );
}

export default memo(ProgramSection);
