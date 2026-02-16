import { motion } from 'motion/react';
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
      <div className="hidden gap-3 md:grid md:grid-cols-2 lg:grid-cols-3">
        {PERSONAS.map((persona) => {
          const isActive = selected === persona.id;
          return (
            <motion.div
              key={persona.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelect(persona.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onSelect(persona.id);
                }
              }}
              className={`group relative flex w-full cursor-pointer flex-col gap-y-2.5 overflow-hidden rounded-md border-2 bg-gradient-to-br p-5 text-left transition-all duration-300 ${
                isActive
                  ? 'scale-[1.02] border-primary from-primary-5 to-white shadow-xl shadow-primary/10'
                  : 'border-neutral-85 from-white to-gray-50 shadow-sm hover:scale-[1.01] hover:border-primary/40 hover:shadow-lg'
              }`}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              aria-pressed={isActive}
            >
              {isActive && (
                <motion.div
                  className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white shadow-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                  <span className="text-small14">✓</span>
                </motion.div>
              )}
              <div
                className={`text-medium18 font-bold transition-colors ${
                  isActive
                    ? 'text-primary'
                    : 'text-neutral-0 group-hover:text-primary'
                }`}
              >
                {persona.title}
              </div>
              <p className="text-small15 font-medium leading-relaxed text-neutral-45">
                {persona.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </>
  );
};

export default PersonaSelector;
