import { useEffect, useState, type ReactNode } from 'react';
import { Spin } from 'antd';
import * as session from '@/auth/session';

export function ProtectedPage({ children }: { children: ReactNode }) {
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    if (session.isLoggedIn()) {
      setOk(true);
    } else {
      window.location.replace('/login.html');
    }
  }, []);

  if (ok !== true) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
        <Spin />
      </div>
    );
  }
  return <>{children}</>;
}
