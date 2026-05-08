import { Divider, Typography } from 'antd';

const { Title, Paragraph } = Typography;

const LAST_UPDATED = 'Last updated: 2026-05-09';

export function Privacy() {
  return (
    <div className="page-container--narrow" style={{ maxWidth: 720, margin: '0 auto' }}>
      <Title>Privacy Policy</Title>
      <Paragraph type="secondary">{LAST_UPDATED}</Paragraph>

      <Paragraph>
        This policy describes what KELA HR collects, where the data lives, and how
        you can have it removed. KELA HR is currently in beta and free to use.
      </Paragraph>

      <Title level={2}>What we collect</Title>
      <Paragraph>
        <strong>Email.</strong> The email you sign up with — yours or your Google
        Group's — is your account identifier. It's how we send the one-time code
        when you log in and how we attribute saved contacts to you.
      </Paragraph>
      <Paragraph>
        <strong>Saved LinkedIn data.</strong> When you save a contact through the
        Chrome extension we store the LinkedIn profile slug (e.g.{' '}
        <code>jane-doe-1234</code>) plus any phone numbers, email addresses, and
        free-form notes you choose to attach.
      </Paragraph>
      <Paragraph>
        <strong>Login codes.</strong> The 6-digit one-time codes we send for login
        are stored briefly so we can verify them. They're deleted when used and
        otherwise expire 10 minutes after they're issued.
      </Paragraph>

      <Title level={2}>Where it lives</Title>
      <Paragraph>
        <strong>Backend.</strong> AWS Lambda + API Gateway in the{' '}
        <code>ap-south-1</code> region (Mumbai). API responses go straight to your
        browser; we don't proxy through any third-party analytics or logging
        provider.
      </Paragraph>
      <Paragraph>
        <strong>Storage.</strong> A Google Sheet owned by KELA HR. Each contact row
        is partitioned by your account's <code>user_id</code>, so a query for your
        data only returns your rows.
      </Paragraph>
      <Paragraph>
        <strong>Browser.</strong> Your JWT is held in <code>localStorage</code> on
        kela-hr.com and in <code>chrome.storage.local</code> in the extension. We
        don't use cookies, so we don't issue cross-site tracking pixels or
        third-party identifiers tied to your account.
      </Paragraph>

      <Title level={2}>Group accounts</Title>
      <Paragraph>
        If you sign up with a Google Group email, every member of that group has
        access to the same contact list and can read or edit the same data. Don't
        store personal contacts in a group account.
      </Paragraph>

      <Title level={2}>What we don't collect</Title>
      <Paragraph>
        We don't collect passwords (login is OTP-only). We don't collect payment
        information. We don't track your browsing history outside what you
        explicitly save through the extension.
      </Paragraph>
      <Paragraph>
        Like many websites, we use Google Analytics (measurement ID{' '}
        <code>G-LWCP30XQPP</code>) for aggregate page-view counts on kela-hr.com.
        That data is governed by Google's privacy policy.
      </Paragraph>

      <Title level={2}>OTP delivery</Title>
      <Paragraph>
        Login codes are sent via{' '}
        <a href="https://resend.com/" target="_blank" rel="noopener noreferrer">
          Resend
        </a>
        . The recipient address is the email you typed in.
      </Paragraph>

      <Title level={2}>Removal</Title>
      <Paragraph>
        Email{' '}
        <a href="/support.html">our support form</a> and we will delete your
        account row and all your saved contacts within 7 days.
      </Paragraph>

      <Divider />
      <Paragraph type="secondary">
        Questions? Use the <a href="/support.html">support form</a>.
      </Paragraph>
    </div>
  );
}
