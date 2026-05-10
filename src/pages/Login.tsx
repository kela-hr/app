import { useEffect, useRef, useState } from 'react';
import { Alert, Button, Card, Form, Input, Space, Typography } from 'antd';
import * as authApi from '@/api/auth';
import * as session from '@/auth/session';
import { ApiError } from '@/api/client';

const RESEND_COOLDOWN = 60;

type Step = 'email' | 'otp' | 'submitting';

function humanizeError(e: unknown, phase: 'request' | 'verify'): string {
  if (e instanceof ApiError) {
    if (e.code === 'validation_error') return 'Please enter a valid email.';
    if (e.code === 'rate_limited') return 'Too many attempts, please wait a minute and try again.';
    if (e.code === 'auth_error' && phase === 'verify') {
      return 'Invalid or expired code. Please try again.';
    }
  }
  return 'Something went wrong. Please try again.';
}

export function Login() {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const cooldownRef = useRef<number | null>(null);

  useEffect(() => {
    if (!session.isLoggedIn()) return;
    // Already logged in on the website. If the user got here by clicking the
    // extension's "Login" button, push the JWT to the extension before
    // redirecting so the popup picks it up.
    const token = session.getToken();
    const email = session.getEmail();
    (async () => {
      if (token && email) await session.syncToExtension(token, email);
      window.location.replace('/dashboard.html');
    })();
  }, []);

  useEffect(() => {
    if (cooldown <= 0) {
      if (cooldownRef.current) {
        window.clearInterval(cooldownRef.current);
        cooldownRef.current = null;
      }
      return;
    }
    if (cooldownRef.current == null) {
      cooldownRef.current = window.setInterval(() => {
        setCooldown((s) => Math.max(0, s - 1));
      }, 1000);
    }
    return () => {
      if (cooldownRef.current) {
        window.clearInterval(cooldownRef.current);
        cooldownRef.current = null;
      }
    };
  }, [cooldown]);

  async function onSendCode() {
    setError(null);
    const trimmed = email.trim();
    if (!trimmed) {
      setError('Please enter your email.');
      return;
    }
    setStep('submitting');
    try {
      await authApi.requestOtp(trimmed);
      setEmail(trimmed);
      setStep('otp');
      setCooldown(RESEND_COOLDOWN);
    } catch (e) {
      setError(humanizeError(e, 'request'));
      setStep('email');
    }
  }

  async function onResend() {
    if (cooldown > 0) return;
    setError(null);
    try {
      await authApi.requestOtp(email);
      setCooldown(RESEND_COOLDOWN);
    } catch (e) {
      setError(humanizeError(e, 'request'));
    }
  }

  async function onVerify() {
    setError(null);
    if (!code.trim()) {
      setError('Please enter the 6-digit code.');
      return;
    }
    setStep('submitting');
    try {
      const res = await authApi.verifyOtp(email, code.trim());
      session.setSession(res.token, res.email);
      // Wait for the extension to ack (or a short timeout) before navigating —
      // otherwise the renderer is torn down and the IPC is dropped.
      await session.syncToExtension(res.token, res.email);
      window.location.href = '/dashboard.html';
    } catch (e) {
      setError(humanizeError(e, 'verify'));
      setStep('otp');
    }
  }

  function backToEmail() {
    setStep('email');
    setCode('');
    setError(null);
    setCooldown(0);
  }

  const submitting = step === 'submitting';

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
      <Card style={{ width: '100%', maxWidth: 400 }}>
        <Typography.Title level={2} style={{ marginTop: 0 }}>
          Sign in
        </Typography.Title>

        {step === 'email' || (step === 'submitting' && !code) ? (
          <Form layout="vertical" onFinish={onSendCode}>
            <Form.Item label="Email">
              <Input
                type="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={submitting}
              />
            </Form.Item>
            {error && <Alert type="error" message={error} style={{ marginBottom: 12 }} />}
            <Button type="primary" htmlType="submit" block loading={submitting}>
              Send code
            </Button>
          </Form>
        ) : (
          <Form layout="vertical" onFinish={onVerify}>
            <Typography.Paragraph style={{ marginBottom: 12 }}>
              We sent a 6-digit code to <strong>{email}</strong>.{' '}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  backToEmail();
                }}
              >
                Use a different email
              </a>
            </Typography.Paragraph>
            <Form.Item label="6-digit code">
              <Input
                inputMode="numeric"
                autoFocus
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                disabled={submitting}
              />
            </Form.Item>
            {error && <Alert type="error" message={error} style={{ marginBottom: 12 }} />}
            <Space direction="vertical" style={{ width: '100%' }} size={8}>
              <Button type="primary" htmlType="submit" block loading={submitting}>
                Verify & login
              </Button>
              <Button
                type="link"
                block
                onClick={onResend}
                disabled={cooldown > 0 || submitting}
              >
                {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend code'}
              </Button>
            </Space>
          </Form>
        )}
      </Card>
    </div>
  );
}
