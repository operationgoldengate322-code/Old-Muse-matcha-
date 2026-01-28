import { resend } from "@/lib/resend/client";

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
};

export async function sendTransactionalEmail({ to, subject, html }: SendEmailInput) {
  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) {
    console.warn("[email] Missing RESEND config, skipping email.");
    return;
  }

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL,
    to,
    subject,
    html,
  });
}
