'use client';

type Quote = {
  text: string;
  author: string;
  group: '교육생 합격 후기' | '고객사 후기';
};

const quotes: Quote[] = [
  {
    group: '고객사 후기',
    text: '팀스파르타의 와우포인트는 “밀착 관리”인 것 같아요. 이 해커톤 준비를 내 일이라고 생각하고 하는 사람이 몇 명이나 있을까라는 생각이 들었는데, 진짜 자기 일처럼 같이 해주셨다는 게 너무 감사해요. 해커톤 참가자 분들도 다른 소속, 다른 팀인데 이렇게 원팀이 되어 협업하는 것처럼, 저희 운영진들도 다른 조직이지만 이렇게 한 팀으로 소통해서 내 일처럼 진행한 게 매우 우수했어요.',
    author: '포스코인재창조원 이OO 과장님',
  },
  {
    group: '고객사 후기',
    text: '항상 매니저님들께서 신경써주시고, 요구사항을 100% 이해하여 구현하고 지원해주셔서 너무 감사했습니다. 교육 시작 전 걱정하게 무색할 정도로 너무 잘 진행이 되었습니다. 강사님, 매니저님, 튜터님들까지 너무 세심하게 봐주시고 신경 써주신 덕분에 교육이 잘 진행 되었고, 어려운 세션이 날아왔음에도 불구하고 마음이 오히려 더 편안해졌습니다.',
    author: '롯데지주 방OO 수석님',
  },
  {
    group: '고객사 후기',
    text: '추후 좋은 교육할 수 있게 여러가지로 잘 부탁드리고, 팀스파르타 덕분에 만족도 높은 교육을 진행할 수 있어서 담당자로서 많이 뿌듯하고 좋았습니다. 교육이 끝나게 되어 많이 아쉽지만 그간 너무나 친절하고 빠르게 도움을 많이 주셔서 잘 마무리할 수 있던 것 같습니다.',
    author: '삼성전자 장OO 프로님',
  },
];

export default function Testimonials() {
  const groups: Array<Quote['group']> = ['교육생 합격 후기', '고객사 후기'];
  return (
    <div className="space-y-10">
      {groups.map((g, gi) => (
        <section key={gi} aria-labelledby={`group-${gi}`}>
          <h3 id={`group-${gi}`} className="text-1.375-semibold">
            {g}
          </h3>
          <div className="mt-4 grid gap-6 md:grid-cols-3">
            {(g === '고객사 후기'
              ? quotes.filter((q) => q.group === g)
              : []
            ).map((q, qi) => (
              <blockquote
                key={qi}
                className="rounded-xl bg-white p-5 shadow-sm"
              >
                <p className="text-0.875 text-neutral-800">“{q.text}”</p>
                <footer className="text-0.875-medium mt-3 text-neutral-40">
                  — {q.author}
                </footer>
              </blockquote>
            ))}
            {g === '교육생 합격 후기' && (
              <div className="text-0.875 rounded-xl bg-white p-5 text-center text-neutral-40 shadow-sm">
                교육생 합격 후기는 운영 중인 서비스의 실제 캡처/링크로 교체
                예정입니다.
                <div className="mt-3 aspect-[16/9] w-full rounded-lg bg-neutral-200" />
              </div>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
