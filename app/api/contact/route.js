import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export const runtime = 'nodejs';

function escapeHtml(s = '') {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function POST(request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Email service not configured. Set RESEND_API_KEY.' },
      { status: 500 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { name, email, company, phone, type, budget, note } = body || {};

  // Basic validation
  if (!name || !email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json(
      { error: 'Name and a valid email are required.' },
      { status: 400 }
    );
  }

  // Honeypot — if a bot fills the hidden "website" field, silently succeed
  if (body.website) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const resend = new Resend(apiKey);

  const from = 'hello@shubhamfilmproductions.com';
  const to = process.env.CONTACT_INBOX_EMAIL || 'hello@shubhamfilmproductions.com';

  const submittedAt = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  const phoneVal   = phone   || '—';
  const companyVal = company || '—';
  const typeVal    = type    || '—';
  const budgetVal  = budget  || '—';
  const noteVal    = note    || '(no notes)';

  const subject = `New ${type || 'project'} inquiry from ${name}`;

  const text = [
    `New inquiry via shubhamfilmproductions.com`,
    `Submitted: ${submittedAt} IST`,
    '',
    `Name:    ${name}`,
    `Email:   ${email}`,
    `Phone:   ${phoneVal}`,
    `Company: ${companyVal}`,
    `Type:    ${typeVal}`,
    `Budget:  ${budgetVal}`,
    '',
    '----------------------------------------',
    noteVal,
    '----------------------------------------',
  ].join('\n');

  const html = `
    <div style="font-family:-apple-system,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a">
      <div style="border-left:3px solid #FF4D2E;padding:8px 0 8px 18px;margin-bottom:24px">
        <div style="font:500 10px/1 monospace;letter-spacing:.2em;color:#8A8580;text-transform:uppercase;margin-bottom:6px">New inquiry · shubhamfilmproductions.com</div>
        <h2 style="font:400 26px/1.2 Georgia,serif;margin:0">${escapeHtml(typeVal)} from ${escapeHtml(name)}</h2>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr><td style="padding:8px 0;color:#666;width:90px">Name</td><td style="padding:8px 0"><strong>${escapeHtml(name)}</strong></td></tr>
        <tr><td style="padding:8px 0;color:#666">Email</td><td style="padding:8px 0"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
        <tr><td style="padding:8px 0;color:#666">Phone</td><td style="padding:8px 0">${escapeHtml(phoneVal)}</td></tr>
        <tr><td style="padding:8px 0;color:#666">Company</td><td style="padding:8px 0">${escapeHtml(companyVal)}</td></tr>
        <tr><td style="padding:8px 0;color:#666">Type</td><td style="padding:8px 0">${escapeHtml(typeVal)}</td></tr>
        <tr><td style="padding:8px 0;color:#666">Budget</td><td style="padding:8px 0">${escapeHtml(budgetVal)}</td></tr>
      </table>
      <div style="margin-top:24px;padding:20px;background:#f7f4ee;border-radius:8px">
        <div style="font:500 10px/1 monospace;letter-spacing:.2em;color:#8A8580;text-transform:uppercase;margin-bottom:10px">Message</div>
        <div style="white-space:pre-wrap;line-height:1.6">${escapeHtml(noteVal)}</div>
      </div>
      <div style="margin-top:20px;font:500 10px/1.4 monospace;letter-spacing:.18em;color:#8A8580;text-transform:uppercase">
        Submitted ${escapeHtml(submittedAt)} IST · Reply directly to respond to ${escapeHtml(name)}
      </div>
    </div>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: email,
      subject,
      text,
      html,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: error.message || 'Failed to send' }, { status: 502 });
    }

    return NextResponse.json({ ok: true, id: data?.id });
  } catch (err) {
    console.error('Contact API error:', err);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
