import { PERSONAS } from '../data/constants';
import { PersonaId } from '../types/types';
import MobilePersonaSelector from './MobilePersonaSelector';

interface PersonaSelectorProps {
  selected?: PersonaId;
  onSelect: (id: PersonaId) => void;
}

const PersonaSelector = ({ selected, onSelect }: PersonaSelectorProps) => {
  return (
    <>
      {/* 모바일 */}
      <div className="md:hidden">
        <MobilePersonaSelector selected={selected} onSelect={onSelect} />
      </div>

      {/* 데스크톱 */}
      <div className="mx-auto hidden w-[1200px] flex-wrap content-start items-start justify-center gap-5 md:flex">
        {PERSONAS.map((persona) => {
          const isActive = selected === persona.id;
          return (
            <button
              key={persona.id}
              type="button"
              onClick={() => onSelect(persona.id)}
              className={`inline-flex h-28 w-96 flex-col items-start justify-center gap-2.5 rounded-xl px-6 py-4 outline outline-1 -outline-offset-1 transition-all ${
                isActive
                  ? 'bg-white outline-indigo-300'
                  : 'bg-stone-50 outline-stone-300 hover:bg-white hover:outline-indigo-300'
              }`}
            >
              <div className="flex flex-col items-start justify-start gap-3 self-stretch">
                <span className="self-stretch text-left text-lg font-bold leading-6 text-zinc-800">
                  {persona.title}
                </span>
                <span className="text-left text-base font-semibold leading-6 text-zinc-500">
                  {persona.description}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
};

export default PersonaSelector;
