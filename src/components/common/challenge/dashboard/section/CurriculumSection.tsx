import CurriculumItem from '../../curriculum/CurriculumItem';
import curriculumList from '../../../../../data/curriculum-info.json';

const CurriculumSection = () => {
  return (
    <section className="w-[13rem] rounded-xl border border-[#E4E4E7] px-6 py-6">
      <h2 className="font-semibold text-[#4A495C]">커리큘럼</h2>
      <ul className="mt-4">
        {curriculumList.map((curriculum, index) => (
          <CurriculumItem
            key={index}
            lineTop={index === 0}
            name={curriculum.name}
            description={curriculum.description}
          />
        ))}
      </ul>
    </section>
  );
};

export default CurriculumSection;
