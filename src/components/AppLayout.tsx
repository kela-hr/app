import { Layout, Button, Space } from 'antd';
import { DashboardOutlined, LoginOutlined } from '@ant-design/icons';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import * as session from '@/auth/session';

const { Header, Content, Footer } = Layout;

export function AppLayout({ children }: { children: ReactNode }) {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(session.isLoggedIn());
  }, []);

  function onLogout() {
    session.clear();
    window.location.href = '/';
  }

  return (
    <Layout style={{ minHeight: '100vh', background: '#f3f4f6' }}>
      <Header
        style={{
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          borderBottom: '1px solid #e5e7eb',
        }}
      >
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <img src="/images/favicon.ico" alt="" width={28} height={28} />
          <span style={{ fontSize: 20, fontWeight: 600, color: '#047857' }}>KELA HR</span>
        </a>
        <Space>
          {loggedIn ? (
            <>
              <Button type="primary" icon={<DashboardOutlined />} href="/dashboard.html">
                Dashboard
              </Button>
              <Button onClick={onLogout}>Logout</Button>
            </>
          ) : (
            <Button type="primary" icon={<LoginOutlined />} href="/login.html">
              Login
            </Button>
          )}
        </Space>
      </Header>

      <Content>
        <div className="page-container">{children}</div>
      </Content>

      <Footer style={{ textAlign: 'center', background: '#fff', borderTop: '1px solid #e5e7eb' }}>
        <Space split="|">
          <a href="/support.html">Support</a>
          <a href="/terms-of-service.html">Terms</a>
          <a href="/privacy-policy.html">Privacy</a>
        </Space>
      </Footer>
    </Layout>
  );
}
