import { useState } from 'react';
import { Button, Card, Form, Input, Typography, message } from 'antd';
import { SUPPORT_FORM_ACCESS_KEY, SUPPORT_FORM_ACTION } from '@/config';

type Values = { name: string; email: string; message: string };

export function Support() {
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm<Values>();

  async function onFinish(values: Values) {
    setSubmitting(true);
    try {
      const body = new FormData();
      body.set('access_key', SUPPORT_FORM_ACCESS_KEY);
      body.set('name', values.name);
      body.set('email', values.email);
      body.set('message', values.message);
      const res = await fetch(SUPPORT_FORM_ACTION, { method: 'POST', body });
      if (!res.ok) throw new Error(`status ${res.status}`);
      message.success('Thanks — we received your message.');
      form.resetFields();
    } catch {
      message.error('Sending failed. Please try again or email us directly.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 0' }}>
      <Card style={{ width: '100%', maxWidth: 560 }}>
        <Typography.Title level={2} style={{ marginTop: 0 }}>
          Support
        </Typography.Title>
        <Typography.Paragraph>
          Need help or have feedback? Send us a message and we'll get back to you.
        </Typography.Paragraph>
        <Form<Values> form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Form.Item label="Your name" name="name" rules={[{ required: true, message: 'Please tell us your name.' }]}>
            <Input placeholder="Jane Doe" />
          </Form.Item>
          <Form.Item
            label="Your email"
            name="email"
            rules={[
              { required: true, message: 'Please enter your email.' },
              { type: 'email', message: 'Please enter a valid email.' },
            ]}
          >
            <Input placeholder="you@example.com" />
          </Form.Item>
          <Form.Item label="Message" name="message" rules={[{ required: true, message: 'Please enter a message.' }]}>
            <Input.TextArea rows={5} placeholder="What can we help with?" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={submitting}>
            Send
          </Button>
        </Form>
      </Card>
    </div>
  );
}
