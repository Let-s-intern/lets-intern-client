import { PassExternalLink } from '@/domain/all-in-one-pass/types';
import { Button, IconButton, TextField } from '@mui/material';
import { FaPlus, FaTrashCan } from 'react-icons/fa6';

export const createEmptyExternalLink = (): PassExternalLink => ({
  id: crypto.randomUUID(),
  name: '',
  url: '',
});

interface Props {
  links: PassExternalLink[];
  onChange: (links: PassExternalLink[]) => void;
}

/** 1.4 외부 링크: 링크명 + URL (대시보드/랜딩에서 새 탭 이동) */
export default function ExternalLinkSection({ links, onChange }: Props) {
  const update = (id: string, partial: Partial<PassExternalLink>) =>
    onChange(links.map((l) => (l.id === id ? { ...l, ...partial } : l)));

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-small20 text-neutral-0 font-semibold">외부 링크</h2>

      <div className="flex flex-col gap-2">
        {links.map((link) => (
          <div key={link.id} className="flex items-center gap-2">
            <TextField
              label="외부링크명"
              value={link.name}
              onChange={(e) => update(link.id, { name: e.target.value })}
              size="small"
              className="w-56 shrink-0"
            />
            <TextField
              label="URL"
              value={link.url}
              onChange={(e) => update(link.id, { url: e.target.value })}
              size="small"
              fullWidth
            />
            <IconButton
              aria-label="링크 삭제"
              color="error"
              onClick={() => onChange(links.filter((l) => l.id !== link.id))}
            >
              <FaTrashCan size={16} />
            </IconButton>
          </div>
        ))}
      </div>

      <Button
        variant="outlined"
        startIcon={<FaPlus size={12} />}
        onClick={() => onChange([...links, createEmptyExternalLink()])}
        sx={{ borderStyle: 'dashed' }}
      >
        링크 추가
      </Button>
    </section>
  );
}
