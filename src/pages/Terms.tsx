import { Divider, Typography } from 'antd';

const { Title, Paragraph } = Typography;

const LAST_UPDATED = 'Last updated: 2026-05-09';

export function Terms() {
  return (
    <div className="page-container--narrow" style={{ maxWidth: 720, margin: '0 auto' }}>
      <Title>Terms of Service</Title>
      <Paragraph type="secondary">{LAST_UPDATED}</Paragraph>

      <Paragraph>
        These terms govern your use of the KELA HR website (kela-hr.com) and the
        KELA HR Chrome extension. By using either, you agree to the terms below.
      </Paragraph>

      <Title level={2}>Beta service, no warranty</Title>
      <Paragraph>
        KELA HR is currently in beta and provided free of charge. The service is
        offered as-is, without warranty of any kind, express or implied. We may
        change or discontinue the service at any time.
      </Paragraph>

      <Title level={2}>Group accounts</Title>
      <Paragraph>
        If you sign up using a Google Group email, you confirm that you have the
        right to share contact data with all members of that group. Do not put
        contacts into a shared account that you are not authorised to share.
      </Paragraph>

      <Title level={2}>What you can store</Title>
      <Paragraph>
        Don't store data you're not legally allowed to collect or retain. In
        particular, if a contact is in a jurisdiction with data-protection rules
        (such as the EU's GDPR), you must have a lawful basis under those rules
        before saving their information here. KELA HR is the data processor; the
        legal basis for collection rests with you, the user.
      </Paragraph>

      <Title level={2}>Acceptable use</Title>
      <Paragraph>
        Don't use KELA HR to send unsolicited messages, scrape LinkedIn at scale,
        or violate LinkedIn's own terms. We may suspend accounts that misuse the
        service.
      </Paragraph>

      <Title level={2}>Data deletion</Title>
      <Paragraph>
        You can request deletion at any time through the{' '}
        <a href="/support.html">support form</a>. See the{' '}
        <a href="/privacy-policy.html">privacy policy</a> for the timeline.
      </Paragraph>

      <Title level={2}>Governing law</Title>
      <Paragraph>
        These terms are governed by the laws of India. Any disputes will be
        resolved in the courts of India.
      </Paragraph>

      <Divider />
      <Paragraph type="secondary">
        Questions? Use the <a href="/support.html">support form</a>.
      </Paragraph>
    </div>
  );
}
