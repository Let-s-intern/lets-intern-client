import { useGetAllInOnePassListQuery } from '@/api/all-in-one-pass/usePassList';
import Header from '@/domain/admin/ui/header/Header';
import Heading from '@/domain/admin/ui/heading/Heading';
import CommonQuestionSection from '@/domain/all-in-one-pass/section/CommonQuestionSection';
import RoundListSection from '@/domain/all-in-one-pass/section/RoundListSection';
import { MenuItem, TextField } from '@mui/material';
import { useState } from 'react';

/** A-4 회고 관리 (패스별) */
export default function AllInOnePassRetrospectives() {
  const { data: passes = [] } = useGetAllInOnePassListQuery();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const passId = selectedId ?? passes[0]?.id ?? null;

  return (
    <main className="flex flex-col gap-5 p-6">
      <Header>
        <Heading>회고 관리</Heading>
        {passes.length > 0 && (
          <TextField
            select
            size="small"
            value={passId ?? ''}
            onChange={(e) => setSelectedId(Number(e.target.value))}
            className="w-64"
          >
            {passes.map((pass) => (
              <MenuItem key={pass.id} value={pass.id}>
                {pass.title}
              </MenuItem>
            ))}
          </TextField>
        )}
      </Header>
      <CommonQuestionSection />

      {passId != null && <RoundListSection passId={passId} />}
    </main>
  );
}
