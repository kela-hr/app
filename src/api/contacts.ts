import { authedJson } from '@/api/client';

export type ContactRow = {
  linkedin_user_id: string;
  emails: string[];
  phones: string[];
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type ListResponse = {
  rows: ContactRow[];
  total: number;
  page: number;
  pageSize: number;
};

export async function list(params: {
  page: number;
  pageSize: number;
  q?: string;
}): Promise<ListResponse> {
  const qs = new URLSearchParams();
  qs.set('page', String(params.page));
  qs.set('pageSize', String(params.pageSize));
  if (params.q) qs.set('q', params.q);
  return authedJson<ListResponse>(`/contacts/list?${qs.toString()}`);
}
