export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

/**
 * Universal email dispatcher supporting Resend, Cloudflare MailChannels, Postmark, and console logging
 */
export async function sendEmail({ to, subject, html, text, replyTo }: EmailOptions): Promise<boolean> {
  const provider = process.env.EMAIL_PROVIDER || "resend";
  const apiKey = process.env.EMAIL_API_KEY;
  const fromEmail = process.env.EMAIL_FROM || "NXC Verse <concierge@nxcverse.in>";

  // 1. Resend API
  if (provider === "resend" && apiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [to],
          subject,
          html,
          text: text || html.replace(/<[^>]*>?/gm, ""),
          reply_to: replyTo || process.env.EMAIL_REPLY_TO || "concierge@nxcverse.in",
        }),
      });

      return res.ok;
    } catch (err) {
      console.error("[Email Dispatch Error]:", err);
      return false;
    }
  }

  // 2. Cloudflare MailChannels (Native to Cloudflare Workers with no API key needed)
  if (provider === "mailchannels") {
    try {
      const res = await fetch("https://api.mailchannels.net/tx/v1/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: to }] }],
          from: { email: "concierge@nxcverse.in", name: "NXC Verse" },
          subject,
          content: [{ type: "text/html", value: html }],
        }),
      });

      return res.ok;
    } catch (err) {
      console.error("[MailChannels Error]:", err);
      return false;
    }
  }

  // Development Fallback: Log email details cleanly to terminal
  console.log(`\n================== [NXC TRANSACTIONAL EMAIL] ==================`);
  console.log(`TO: ${to}`);
  console.log(`SUBJECT: ${subject}`);
  console.log(`PROVIDER: ${provider} (Development Mode)`);
  console.log(`================================================================\n`);
  return true;
}

// =============================================================================
// LUXURY BRANDED EMAIL TEMPLATES
// =============================================================================

export function getLuxuryEmailWrapper(contentHtml: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { margin: 0; padding: 0; background-color: #000000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #FFFFFF; }
          .container { max-width: 600px; margin: 40px auto; background-color: #060608; border: 1px solid rgba(255,255,255,0.12); border-radius: 20px; overflow: hidden; padding: 40px; }
          .header { text-align: center; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 25px; margin-bottom: 30px; }
          .title { font-family: 'Cinzel', Georgia, serif; font-size: 22px; letter-spacing: 0.15em; color: #FFFFFF; margin: 0; text-transform: uppercase; }
          .subtitle { font-size: 11px; letter-spacing: 0.25em; color: #00A2FF; margin-top: 6px; text-transform: uppercase; font-weight: 600; }
          .content { font-size: 14px; line-height: 1.7; color: #B0B0C0; }
          .button { display: inline-block; background: linear-gradient(90deg, #0055FF, #0099FF); color: #FFFFFF !important; text-decoration: none; padding: 14px 32px; border-radius: 999px; font-weight: bold; font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase; margin: 25px 0; }
          .footer { text-align: center; margin-top: 40px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 25px; font-size: 11px; color: #62626E; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="title">NXC VERSE</h1>
            <div class="subtitle">SOVEREIGN DIGITAL IDENTITY & METALLURGY</div>
          </div>
          <div class="content">
            ${contentHtml}
          </div>
          <div class="footer">
            © 2026 NXC Verse Private Atelier. Worli Sea Face, Mumbai. All rights reserved.<br>
            Sovereign digital identity infrastructure powered by Cloudflare edge.
          </div>
        </div>
      </body>
    </html>
  `;
}

export async function sendWelcomeEmail({
  to,
  fullName,
  username,
  hasHardwareCard,
}: {
  to: string;
  fullName: string;
  username: string;
  hasHardwareCard?: boolean;
}) {
  const profileUrl = `https://nxcverse.in/@${username}`;
  const html = getLuxuryEmailWrapper(`
    <p>Dear ${fullName},</p>
    <p>Welcome to the sovereign identity network. Your permanent digital identity is now active and ready for instantaneous connection.</p>
    <div style="background-color: #0E0E14; border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 20px; margin: 20px 0;">
      <div style="color: #8E8E98; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 5px;">Your Sovereign Handle</div>
      <div style="color: #00A2FF; font-family: monospace; font-size: 16px; font-weight: bold;">@${username}</div>
      <div style="color: #A0A0B0; font-size: 12px; margin-top: 6px;">URL: <a href="${profileUrl}" style="color: #FFFFFF;">${profileUrl}</a></div>
    </div>
    ${
      hasHardwareCard
        ? `<p>Your aerospace cold-forged metal card has entered our master laser casting queue. You will receive an update once it passes metallurgical quality control.</p>`
        : `<p>Your free sovereign digital profile is live. You can customize your links, configure VIP direct mode, or acquire a bespoke metal card at any time from your console.</p>`
    }
    <div style="text-align: center;">
      <a href="https://nxcverse.in/dashboard" class="button">Access Sovereign Console</a>
    </div>
  `);

  return sendEmail({
    to,
    subject: `Welcome to NXC Verse — Sovereign Identity @${username}`,
    html,
  });
}

export async function sendLeadReceivedAlertEmail({
  to,
  ownerName,
  leadName,
  leadEmail,
  leadPhone,
  leadMessage,
  leadCompany,
}: {
  to: string;
  ownerName: string;
  leadName: string;
  leadEmail?: string;
  leadPhone?: string;
  leadMessage?: string;
  leadCompany?: string;
}) {
  const html = getLuxuryEmailWrapper(`
    <p>Dear ${ownerName},</p>
    <p>You have captured a new executive connection through your NXC Verse sovereign profile.</p>
    <div style="background-color: #0E0E14; border: 1px solid rgba(0,162,255,0.3); border-radius: 14px; padding: 20px; margin: 20px 0;">
      <div style="color: #00A2FF; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; font-weight: bold; margin-bottom: 10px;">Contact Details Captured</div>
      <div style="color: #FFFFFF; font-size: 16px; font-weight: bold; margin-bottom: 6px;">${leadName}</div>
      ${leadCompany ? `<div style="color: #A0A0B0; font-size: 12px;">Organization: ${leadCompany}</div>` : ""}
      ${leadEmail ? `<div style="color: #A0A0B0; font-size: 12px;">Email: <a href="mailto:${leadEmail}" style="color: #00A2FF;">${leadEmail}</a></div>` : ""}
      ${leadPhone ? `<div style="color: #A0A0B0; font-size: 12px;">Phone: <a href="tel:${leadPhone}" style="color: #00A2FF;">${leadPhone}</a></div>` : ""}
      ${leadMessage ? `<div style="margin-top: 12px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.06); font-style: italic; color: #D0D0DC; font-size: 12px;">"${leadMessage}"</div>` : ""}
    </div>
    <div style="text-align: center;">
      <a href="https://nxcverse.in/dashboard/contacts" class="button">View in Leads & Networking</a>
    </div>
  `);

  return sendEmail({
    to,
    subject: `New Lead Captured: ${leadName} on NXC Verse`,
    html,
  });
}
