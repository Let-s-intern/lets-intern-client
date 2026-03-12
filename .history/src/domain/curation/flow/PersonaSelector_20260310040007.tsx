import { PersonaId } from '../types';
import MobilePersonaSelector from './MobilePersonaSelector';
import { PERSONAS } from './personas';

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
      <div className="hidden flex-col gap-3 md:flex">
        <div className="grid grid-cols-3 gap-3">
          {PERSONAS.filter((p) => p.id !== 'dontKnow').map((persona) => {
            const isActive = selected === persona.id;
            return (
              <button
                key={persona.id}
                type="button"
                onClick={() => onSelect(persona.id)}
                className={`inline-flex h-28 w-full flex-col items-start justify-center gap-2.5 rounded-xl px-6 py-4 outline outline-1 -outline-offset-1 transition-all ${
                  isActive
                    ? 'bg-white outline-indigo-300'
                    : 'bg-stone-50 outline-stone-300 hover:bg-white hover:outline-indigo-300'
                }`}
              >
                <div className="flex flex-col items-start justify-start gap-3 self-stretch">
                  <span className="self-stretch text-left text-lg font-bold leading-6 text-zinc-800">
                    {persona.title}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
        {(() => {
          const dontKnow = PERSONAS.find((p) => p.id === 'dontKnow');
          if (!dontKnow) return null;
          const isActive = selected === dontKnow.id;
          return (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => onSelect(dontKnow.id)}
                className={`inline-flex items-center justify-center rounded-xl px-24 py-3 outline outline-1 -outline-offset-1 transition-all ${
                  isActive
                    ? 'bg-white outline-indigo-300'
                    : 'bg-stone-50 outline-stone-300 hover:bg-white hover:outline-indigo-300'
                }`}
              >
                <span className="text-center text-base font-bold leading-6 text-zinc-800">
                  {dontKnow.title}
                </span>
              </button>
            </div>
          );
        })()}
      </div>
    </>
  );
};

export default PersonaSelector;
