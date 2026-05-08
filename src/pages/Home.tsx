import { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Row, Space, Typography } from 'antd';
import {
  ChromeOutlined,
  DashboardOutlined,
  LoginOutlined,
} from '@ant-design/icons';
import * as session from '@/auth/session';
import { CHROME_WEB_STORE_URL } from '@/config';

const { Title, Paragraph, Text } = Typography;

export function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => setLoggedIn(session.isLoggedIn()), []);

  return (
    <Space direction="vertical" size={48} style={{ width: '100%' }}>
      <section style={{ textAlign: 'center', padding: '40px 0' }}>
        <img
          src="/images/favicon.ico"
          alt=""
          width={64}
          height={64}
          style={{ borderRadius: 16, marginBottom: 16 }}
        />
        <Title style={{ marginTop: 0 }}>KELA HR</Title>
        <Paragraph style={{ fontSize: 18, color: '#4b5563', maxWidth: 640, margin: '0 auto 24px' }}>
          Save, share, and find your LinkedIn contacts — without leaving LinkedIn.
        </Paragraph>
        <Space size="middle" wrap>
          <Button
            type="primary"
            size="large"
            icon={<ChromeOutlined />}
            href={CHROME_WEB_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Install for Chrome
          </Button>
          {loggedIn ? (
            <Button size="large" icon={<DashboardOutlined />} href="/dashboard.html">
              Open Dashboard
            </Button>
          ) : (
            <Button size="large" icon={<LoginOutlined />} href="/login.html">
              Login
            </Button>
          )}
        </Space>
      </section>

      <section>
        <Title level={2}>What it does</Title>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Card title="Personal contacts">
              <Paragraph style={{ marginBottom: 0 }}>
                Every LinkedIn profile becomes a place to save phone numbers, emails,
                and private notes that only you see. Open the profile again anytime
                — your notes are right there.
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title="Shared with your team">
              <Paragraph style={{ marginBottom: 0 }}>
                Sign up with a Google Group email and everyone in the group sees and
                edits the same contacts. One shared rolodex for the whole team.
              </Paragraph>
            </Card>
          </Col>
        </Row>
      </section>

      <section>
        <Title level={2}>Get started</Title>
        <ol style={{ fontSize: 16, lineHeight: 1.8, paddingLeft: 20 }}>
          <li>
            <a href={CHROME_WEB_STORE_URL} target="_blank" rel="noopener noreferrer">
              Install the Chrome extension
            </a>.
          </li>
          <li>
            <a href="#accounts">Create an account</a> (personal or shared with a group).
          </li>
          <li>Visit any LinkedIn profile to start saving notes.</li>
        </ol>
      </section>

      <section id="accounts">
        <Title level={2}>Account types</Title>

        <Title level={3}>Personal account</Title>
        <Paragraph>
          Use your own email — Gmail, your work email, anything that receives mail.
          We send a one-time code to sign you in. No password to remember.
        </Paragraph>

        <Title level={3}>Group account</Title>
        <Paragraph>
          For a team that wants to share one contact list:
        </Paragraph>
        <ol style={{ fontSize: 15, lineHeight: 1.8, paddingLeft: 20 }}>
          <li>
            Go to{' '}
            <a href="https://groups.google.com/" target="_blank" rel="noopener noreferrer">
              groups.google.com
            </a>{' '}
            and create a group.
          </li>
          <li>
            Open the group's settings → <Text strong>Who can post</Text> → set to{' '}
            <Text strong>Anyone on the web</Text>. This is required so our one-time
            code emails can reach the group.
          </li>
          <li>Sign up on KELA HR using the group's email address.</li>
          <li>Anyone in the group can read and edit the shared contact list.</li>
        </ol>
        <Alert
          type="info"
          showIcon
          message="The same contact list is visible to everyone in the group — don't put personal contacts in a group account."
          style={{ marginTop: 16 }}
        />
      </section>
    </Space>
  );
}
