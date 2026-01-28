type EmailTemplate = {
  subject: string;
  html: string;
};

export function welcomeEmail(): EmailTemplate {
  return {
    subject: "Welcome to Old Muse Matcha",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Welcome to Old Muse Matcha</h2>
        <p>Your matcha ritual is confirmed. We will send your first drop details soon.</p>
        <p>Manage your subscription anytime from your account portal.</p>
        <p>Warmly,<br/>Old Muse Matcha</p>
      </div>
    `,
  };
}

export function upcomingDropEmail(month: string): EmailTemplate {
  return {
    subject: `Your ${month} Old Muse Matcha drop is on the way`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Upcoming drop</h2>
        <p>Your ${month} matcha pairing is being prepared.</p>
        <p>We will send tracking details as soon as it ships.</p>
      </div>
    `,
  };
}

export function shippingConfirmationEmail(trackingUrl: string): EmailTemplate {
  return {
    subject: "Your Old Muse Matcha order has shipped",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Shipping confirmation</h2>
        <p>Your matcha drop is on the way.</p>
        <p><a href="${trackingUrl}">Track your shipment</a></p>
      </div>
    `,
  };
}

export function renewalFailedEmail(): EmailTemplate {
  return {
    subject: "Action needed: payment failed",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Payment failed</h2>
        <p>We could not process your renewal. Please update your billing info.</p>
        <p>Visit your account portal to retry payment.</p>
      </div>
    `,
  };
}

export function winbackEmail(): EmailTemplate {
  return {
    subject: "We would love to welcome you back",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Come back for the next drop</h2>
        <p>We saved a curated release for you. Restart your subscription anytime.</p>
      </div>
    `,
  };
}
