import styles from './styles.module.scss';

const NewsSection = () => {
  return (
    <section className="flex w-full flex-col px-5 md:flex-row">
      <div className="flex flex-1 flex-col items-stretch sm:mx-auto md:items-center md:p-0">
        <div className="w-full px-3 sm:w-[30rem] md:w-[20rem] md:p-0">
          <h2 className="text-[1.75rem] font-semibold">
            렛츠인턴 소식이
            <br />
            궁금하다면?
          </h2>
          <p className="mt-2 text-xl">
            렛츠인턴에게 궁금한 점을
            <br />
            자유롭게 남겨주세요.
            <br />폼 제출 시 새로운 프로그램 소식을
            <br />
            가장 먼저 받아보실 수 있습니다.
          </p>
        </div>
      </div>
      <div className="mx-auto mt-8 w-full sm:mt-8 sm:w-[30rem] md:mt-0 md:pr-12">
        <form>
          <div className="mx-auto flex flex-col gap-8">
            <input
              className={styles.input}
              type="text"
              name="name"
              placeholder="이름"
              autoComplete="off"
            />
            <input
              className={styles.input}
              type="text"
              name="email"
              placeholder="이메일"
              autoComplete="off"
            />
            <textarea
              className="resize-none rounded border border-slate-300 px-3 py-2 outline-none focus:-m-[0.5px] focus:border-[1.5px] focus:border-primary"
              name="content"
              placeholder="문의사항"
              rows={5}
            />
          </div>
        </form>
      </div>
    </section>
  );
};

export default NewsSection;
