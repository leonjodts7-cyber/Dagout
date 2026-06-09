import { Resend } from "resend";
import { SITE_URL } from "@/lib/admin";

const FROM = "noreply@dagout.be";

let resendClient: Resend | null = null;

function getResend(): Resend {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("RESEND_API_KEY is niet geconfigureerd");
    }
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

function baseTemplate(content: string) {
  return `
<!DOCTYPE html>
<html lang="nl">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Inter,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;max-width:600px;">
        <tr><td style="background:#0a2a1f;padding:24px 32px;">
          <span style="color:#1D9E75;font-size:24px;font-weight:bold;">Dagout</span>
          <span style="color:#ffffff;font-size:14px;display:block;margin-top:4px;">Teambuilding platform voor België</span>
        </td></tr>
        <tr><td style="padding:32px;color:#374151;font-size:15px;line-height:1.6;">
          ${content}
        </td></tr>
        <tr><td style="padding:24px 32px;background:#f9fafb;border-top:1px solid #e5e7eb;color:#9ca3af;font-size:12px;">
          © ${new Date().getFullYear()} Dagout.be · <a href="${SITE_URL}" style="color:#1D9E75;">dagout.be</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export interface InquiryEmailData {
  providerEmail: string;
  providerName: string;
  companyName: string;
  contactName: string;
  email: string;
  phone?: string;
  groupSize?: number | null;
  preferredDate?: string | null;
  message?: string;
  activityName: string;
}

export interface InquiryConfirmationData {
  email: string;
  contactName: string;
  activityName: string;
  companyName?: string;
  groupSize?: number | null;
  preferredDate?: string | null;
}

export interface WelcomeEmailData {
  email: string;
  firstName: string;
}

export interface ListingApprovedEmailData {
  email: string;
  firstName: string;
  listingName: string;
  listingUrl: string;
}

export async function sendInquiryToProvider(data: InquiryEmailData) {
  const subject = `Nieuwe aanvraag via Dagout.be — ${data.companyName || data.contactName}`;
  const resend = getResend();

  const html = baseTemplate(`
    <h1 style="color:#111827;font-size:20px;margin:0 0 16px;">Nieuwe aanvraag ontvangen</h1>
    <p>Je hebt een nieuwe aanvraag ontvangen voor <strong>${data.activityName}</strong>.</p>
    <table style="width:100%;margin:20px 0;border-collapse:collapse;">
      <tr><td style="padding:8px 0;color:#6b7280;">Naam</td><td style="padding:8px 0;"><strong>${data.contactName}</strong></td></tr>
      <tr><td style="padding:8px 0;color:#6b7280;">Bedrijf</td><td style="padding:8px 0;">${data.companyName || "—"}</td></tr>
      ${data.groupSize ? `<tr><td style="padding:8px 0;color:#6b7280;">Groepsgrootte</td><td style="padding:8px 0;">${data.groupSize} personen</td></tr>` : ""}
      ${data.preferredDate ? `<tr><td style="padding:8px 0;color:#6b7280;">Gewenste datum</td><td style="padding:8px 0;">${data.preferredDate}</td></tr>` : ""}
      <tr><td style="padding:8px 0;color:#6b7280;">E-mail</td><td style="padding:8px 0;"><a href="mailto:${data.email}" style="color:#1D9E75;">${data.email}</a></td></tr>
      ${data.phone ? `<tr><td style="padding:8px 0;color:#6b7280;">Telefoon</td><td style="padding:8px 0;">${data.phone}</td></tr>` : ""}
    </table>
    ${data.message ? `<p style="background:#f3f4f6;padding:16px;border-radius:8px;margin:16px 0;"><strong>Bericht:</strong><br>${data.message.replace(/\n/g, "<br>")}</p>` : ""}
    <a href="${SITE_URL}/dashboard" style="display:inline-block;background:#1D9E75;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin-top:8px;">Bekijk in dashboard</a>
  `);

  const { error } = await resend.emails.send({
    from: FROM,
    to: data.providerEmail,
    subject,
    html,
  });
  if (error) throw new Error(error.message);
  return { ok: true };
}

export async function sendInquiryConfirmation(data: InquiryConfirmationData) {
  const subject = `Je aanvraag is verstuurd — ${data.activityName}`;
  const resend = getResend();

  const html = baseTemplate(`
    <h1 style="color:#111827;font-size:20px;margin:0 0 16px;">Aanvraag verstuurd!</h1>
    <p>Beste ${data.contactName},</p>
    <p>Je aanvraag voor <strong>${data.activityName}</strong> is succesvol verstuurd naar de aanbieder.</p>
    <table style="width:100%;margin:20px 0;border-collapse:collapse;">
      ${data.companyName ? `<tr><td style="padding:8px 0;color:#6b7280;">Bedrijf</td><td style="padding:8px 0;">${data.companyName}</td></tr>` : ""}
      ${data.groupSize ? `<tr><td style="padding:8px 0;color:#6b7280;">Groepsgrootte</td><td style="padding:8px 0;">${data.groupSize} personen</td></tr>` : ""}
      ${data.preferredDate ? `<tr><td style="padding:8px 0;color:#6b7280;">Gewenste datum</td><td style="padding:8px 0;">${data.preferredDate}</td></tr>` : ""}
    </table>
    <p>De aanbieder neemt doorgaans binnen <strong>24 uur</strong> contact met je op.</p>
    <a href="${SITE_URL}/zoeken" style="display:inline-block;background:#1D9E75;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin-top:8px;">Meer activiteiten bekijken</a>
  `);

  const { error } = await resend.emails.send({
    from: FROM,
    to: data.email,
    subject,
    html,
  });
  if (error) throw new Error(error.message);
  return { ok: true };
}

export async function sendWelcomeEmail(data: WelcomeEmailData) {
  const subject = "Welkom bij Dagout.be";
  const resend = getResend();

  const html = baseTemplate(`
    <h1 style="color:#111827;font-size:20px;margin:0 0 16px;">Welkom bij Dagout, ${data.firstName}!</h1>
    <p>Fijn dat je je hebt geregistreerd op het Belgische teambuilding platform.</p>
    <p>Als aanbieder kun je nu je eerste activiteit toevoegen en aanvragen van bedrijven ontvangen.</p>
    <a href="${SITE_URL}/dashboard" style="display:inline-block;background:#1D9E75;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin:8px 8px 8px 0;">Naar dashboard</a>
    <a href="${SITE_URL}/aanbieders/nieuw" style="display:inline-block;border:2px solid #1D9E75;color:#1D9E75;padding:10px 22px;border-radius:8px;text-decoration:none;font-weight:600;">Eerste activiteit toevoegen</a>
  `);

  const { error } = await resend.emails.send({
    from: FROM,
    to: data.email,
    subject,
    html,
  });
  if (error) throw new Error(error.message);
  return { ok: true };
}

export async function sendListingApprovedEmail(data: ListingApprovedEmailData) {
  const subject = "Je activiteit staat live op Dagout.be";
  const resend = getResend();

  const html = baseTemplate(`
    <h1 style="color:#111827;font-size:20px;margin:0 0 16px;">Gefeliciteerd, ${data.firstName}!</h1>
    <p>Je activiteit <strong>${data.listingName}</strong> is goedgekeurd en staat nu live op Dagout.be.</p>
    <p><strong>Tips voor meer aanvragen:</strong></p>
    <ul style="padding-left:20px;">
      <li>Voeg duidelijke foto's toe aan je listing</li>
      <li>Houd je contactgegevens up-to-date</li>
      <li>Reageer snel op binnenkomende aanvragen</li>
    </ul>
    <a href="${data.listingUrl}" style="display:inline-block;background:#1D9E75;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin-top:8px;">Bekijk je listing</a>
  `);

  const { error } = await resend.emails.send({
    from: FROM,
    to: data.email,
    subject,
    html,
  });
  if (error) throw new Error(error.message);
  return { ok: true };
}

export async function sendListingRejectedEmail(
  email: string,
  firstName: string,
  listingName: string,
  reason: string
) {
  const subject = `Listing niet goedgekeurd — ${listingName}`;
  const resend = getResend();

  const html = baseTemplate(`
    <h1 style="color:#111827;font-size:20px;margin:0 0 16px;">Listing niet goedgekeurd</h1>
    <p>Beste ${firstName},</p>
    <p>Je activiteit <strong>${listingName}</strong> kon helaas niet worden goedgekeurd.</p>
    <p style="background:#fef2f2;padding:16px;border-radius:8px;border-left:4px solid #ef4444;"><strong>Reden:</strong> ${reason}</p>
    <p>Pas je listing aan en dien opnieuw in via het dashboard.</p>
    <a href="${SITE_URL}/dashboard" style="display:inline-block;background:#1D9E75;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin-top:8px;">Naar dashboard</a>
  `);

  const { error } = await resend.emails.send({
    from: FROM,
    to: email,
    subject,
    html,
  });
  if (error) throw new Error(error.message);
  return { ok: true };
}

export interface VoteNotificationEmailData {
  organizerEmail: string;
  organizerName: string;
  voterName: string;
  companyName: string;
  activityName: string;
  resultsUrl: string;
}

export async function sendVoteNotificationEmail(data: VoteNotificationEmailData) {
  const subject = `${data.voterName} heeft gestemd op jullie teambuilding stemronde`;
  const resend = getResend();

  const html = baseTemplate(`
    <h1 style="color:#111827;font-size:20px;margin:0 0 16px;">Nieuwe stem ontvangen</h1>
    <p>Beste ${data.organizerName},</p>
    <p><strong>${data.voterName}</strong> heeft gestemd op <strong>${data.activityName}</strong> in de stemronde voor <strong>${data.companyName}</strong>.</p>
    <p>Bekijk de live resultaten en volg de voortgang van jullie team.</p>
    <a href="${data.resultsUrl}" style="display:inline-block;background:#1D9E75;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin-top:8px;">Bekijk resultaten</a>
  `);

  const { error } = await resend.emails.send({
    from: FROM,
    to: data.organizerEmail,
    subject,
    html,
  });
  if (error) throw new Error(error.message);
  return { ok: true };
}
