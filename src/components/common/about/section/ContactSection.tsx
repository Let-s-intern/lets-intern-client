const CONTACT = [
  {
    title: '이메일 문의',
    contact: 'official@letscareer.co.kr',
  },
  {
    title: 'CEO 송다예',
    contact: '010-5411-8647',
  },
];

const cardStyle = {
  backdropFilter: 'blur(4px)',
};

const ContactSection = () => {
  return (
    <section className="flex flex-col gap-20 px-5 py-20">
      <div className="flex flex-col items-center gap-2">
        <span className="text-1-bold text-primary">B2B · 제휴 · 광고 문의</span>
        <h1 className="text-1.125-bold text-center">
          주니어 커리어 성장과 관련한
          <br />
          문의는 언제든 열려있어요
        </h1>
      </div>
      <div className="relative flex w-full flex-col items-center">
        <div className="absolute -top-8 h-32 w-[15.5rem] -translate-x-8 -rotate-12 rounded-sm bg-primary-20 sm:-translate-x-12"></div>
        <div
          style={cardStyle}
          className="shadow-06 flex w-[17.5rem] flex-col gap-5 rounded-sm border border-neutral-80 bg-static-100/80 p-5"
        >
          {CONTACT.map(({ title, contact }) => (
            <div key={title}>
              <h2 className="text-0.875-medium text-neutral-20">{title}</h2>
              <span className="text-0.875 text-neutral-40">{contact}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
