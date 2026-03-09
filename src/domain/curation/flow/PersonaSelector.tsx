import { PersonaId } from '../types';
import { PERSONAS } from './personas';
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
      <div className="mx-auto hidden grid-cols-3 gap-3 md:grid">
        {PERSONAS.map((persona) => {
          const isActive = selected === persona.id;
          return (
            <button
              key={persona.id}
              type="button"
              onClick={() => onSelect(persona.id)}
              className={`inline-flex h-28 w-full items-center justify-center rounded-xl px-6 py-4 outline outline-1 -outline-offset-1 transition-all ${
                isActive
                  ? 'bg-white outline-indigo-300'
                  : 'bg-stone-50 outline-stone-300 hover:bg-white hover:outline-indigo-300'
              }`}
            >
              <span className="text-center text-lg font-bold leading-6 text-zinc-800">
                {persona.title}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
};

export default PersonaSelector;
