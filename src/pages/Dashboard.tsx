import { useEffect, useMemo, useRef, useState } from 'react';
import { Input, Space, Table, Tooltip, Typography, Alert, Empty } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ProtectedPage } from '@/components/ProtectedPage';
import * as contacts from '@/api/contacts';
import type { ContactRow } from '@/api/contacts';
import { CHROME_WEB_STORE_URL } from '@/config';

const PAGE_SIZE = 50;

const dateFmt = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return dateFmt.format(d);
}

function DashboardInner() {
  const [data, setData] = useState<ContactRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const [debouncedQ, setDebouncedQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      setDebouncedQ(q.trim());
      setPage(1);
    }, 300);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [q]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    contacts
      .list({ page, pageSize: PAGE_SIZE, q: debouncedQ || undefined })
      .then((res) => {
        if (!alive) return;
        setData(res.rows);
        setTotal(res.total);
      })
      .catch((e: unknown) => {
        if (!alive) return;
        // 401 redirects via authedFetch; everything else surfaces here.
        const message = e instanceof Error ? e.message : 'Failed to load contacts.';
        setError(message);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [page, debouncedQ]);

  const columns: ColumnsType<ContactRow> = useMemo(
    () => [
      {
        title: 'LinkedIn',
        dataIndex: 'linkedin_user_id',
        key: 'linkedin_user_id',
        render: (val: string) => (
          <a
            href={`https://www.linkedin.com/in/${val}/`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {val}
          </a>
        ),
      },
      {
        title: 'Phones',
        dataIndex: 'phones',
        key: 'phones',
        render: (val: string[]) => (val.length ? val.join(', ') : '—'),
      },
      {
        title: 'Emails',
        dataIndex: 'emails',
        key: 'emails',
        render: (val: string[]) => (val.length ? val.join(', ') : '—'),
      },
      {
        title: 'Notes',
        dataIndex: 'notes',
        key: 'notes',
        render: (val: string | null) => {
          if (!val) return '—';
          if (val.length <= 80) return val;
          return (
            <Tooltip title={val}>
              <span>{val.slice(0, 80)}…</span>
            </Tooltip>
          );
        },
      },
      {
        title: 'Created',
        dataIndex: 'created_at',
        key: 'created_at',
        render: (val: string) => formatDate(val),
      },
      {
        title: 'Updated',
        dataIndex: 'updated_at',
        key: 'updated_at',
        render: (val: string) => formatDate(val),
      },
    ],
    [],
  );

  const showEmptyNoData = !loading && total === 0 && !debouncedQ;
  const showEmptyNoMatch = !loading && total === 0 && !!debouncedQ;

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <Typography.Title level={2} style={{ margin: 0 }}>
          Contacts {total > 0 && <Typography.Text type="secondary">({total})</Typography.Text>}
        </Typography.Title>
        <Input.Search
          allowClear
          placeholder="Search by LinkedIn ID, phone, email, or notes…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ maxWidth: 360 }}
        />
      </div>

      {error && <Alert type="error" message={error} />}

      {showEmptyNoData ? (
        <Empty
          description={
            <span>
              You don't have any contacts saved yet. Visit any LinkedIn profile with the{' '}
              <a href={CHROME_WEB_STORE_URL} target="_blank" rel="noopener noreferrer">
                KELA HR extension
              </a>{' '}
              installed to start saving notes.
            </span>
          }
        />
      ) : showEmptyNoMatch ? (
        <Empty description={`No contacts match "${debouncedQ}".`} />
      ) : (
        <Table<ContactRow>
          rowKey="linkedin_user_id"
          columns={columns}
          dataSource={data}
          loading={loading}
          scroll={{ x: true }}
          pagination={{
            current: page,
            pageSize: PAGE_SIZE,
            total,
            showSizeChanger: false,
            onChange: setPage,
          }}
        />
      )}
    </Space>
  );
}

export function Dashboard() {
  return (
    <ProtectedPage>
      <DashboardInner />
    </ProtectedPage>
  );
}
