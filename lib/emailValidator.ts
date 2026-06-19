// lib/emailValidator.ts
// Validates that an email is real, properly formatted,
// and not from a disposable/temporary email service.

// ── DISPOSABLE EMAIL DOMAINS BLOCKLIST ────────────────────────────────────────
// Most common throwaway/burner email providers
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com", "guerrillamail.com", "guerrillamail.net",
  "guerrillamail.org", "guerrillamail.biz", "guerrillamail.de",
  "guerrillamail.info", "sharklasers.com", "guerrillamailblock.com",
  "grr.la", "guerrillamailblock.com", "spam4.me",
  "trashmail.com", "trashmail.me", "trashmail.net", "trashmail.at",
  "trashmail.io", "trashmail.xyz", "trashmail.org",
  "tempmail.com", "tempmail.net", "tempmail.org", "temp-mail.org",
  "temp-mail.io", "tempmail.io", "tmp-mail.org",
  "throwam.com", "throwam.net",
  "yopmail.com", "yopmail.fr", "cool.fr.nf", "jetable.fr.nf",
  "nospam.ze.tc", "nomail.xl.cx", "mega.zik.dj", "speed.1s.fr",
  "courriel.fr.nf", "moncourrier.fr.nf", "monemail.fr.nf",
  "monmail.fr.nf",
  "10minutemail.com", "10minutemail.net", "10minutemail.org",
  "10minutemail.de", "10minutemail.co.za", "10minutemail.cf",
  "10minutemail.ga", "10minutemail.gq", "10minutemail.ml",
  "10minutemail.tk",
  "dispostable.com", "discard.email",
  "mailnull.com", "spamgourmet.com", "spamgourmet.net",
  "spamgourmet.org",
  "fakeinbox.com", "mailnesia.com", "mailnull.com",
  "maildrop.cc", "mailsac.com", "throwam.com",
  "getnada.com", "nada.email",
  "spambox.us", "spam.la",
  "mytemp.email", "emailondeck.com",
  "burnermail.io", "burnermailapp.com",
  "inboxbear.com",
  "mintemail.com",
  "spamfree24.org", "spamfree24.de", "spamfree24.eu",
  "spamfree24.info", "spamfree24.net",
  "spam.abuse.ch",
  "crazymailing.com",
  "mailtemp.net", "tempinbox.com",
  "throwaway.email",
  "mohmal.com",
  "filzmail.com",
  "bccto.me", "chacuo.net",
  "discard.email", "discardmail.com", "discardmail.de",
  "sharklasers.com",
  "trbvn.com",
  "drdrb.com", "drdrb.net",
  "filzmail.com",
  "jetable.com", "jetable.fr", "jetable.net", "jetable.org",
  "notsharingmy.info",
  "owlpic.com",
  "spam.su",
  "spamgrap.com",
  "tempail.com",
  "tempr.email",
  "mailpoof.com",
  "sharklasers.com",
  "guerrillamail.biz",
]);

// ── KNOWN-FAKE / TEST DOMAINS ─────────────────────────────────────────────────
// These pass format checks but are clearly not real inboxes
const FAKE_DOMAINS = new Set([
  "example.com", "example.net", "example.org",
  "test.com", "test.net", "test.org",
  "fake.com", "fake.net", "fake.org",
  "dummy.com", "dummy.net",
  "noreply.com", "no-reply.com",
  "invalid.com", "nowhere.com",
  "placeholder.com",
  "domain.com", "email.com",
  "abc.com", "xyz.com", "qwerty.com",
  "asdf.com", "zxcv.com",
  "localhost.com",
]);

// ── LOCAL PART PATTERNS TO REJECT ────────────────────────────────────────────
// Catches obviously fake usernames like "test123", "user1", "aaa@..."
const FAKE_LOCAL_PATTERNS = [
  /^test\d*$/i,
  /^user\d*$/i,
  /^admin\d*$/i,
  /^fake\d*$/i,
  /^dummy\d*$/i,
  /^asdf+$/i,
  /^qwerty+$/i,
  /^aaa+$/i,
  /^bbb+$/i,
  /^ccc+$/i,
  /^abc+$/i,
  /^xyz+$/i,
  /^123+$/,
  /^(.)\1{4,}$/,  // same char repeated 5+ times: "aaaaa@...", "11111@..."
];

export interface EmailValidationResult {
  valid: boolean;
  error: string;
}

export function validateEmail(email: string): EmailValidationResult {
  const trimmed = email.trim().toLowerCase();

  // 1. Empty check
  if (!trimmed) {
    return { valid: false, error: "Email address is required." };
  }

  // 2. Basic format check
  const formatRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
  if (!formatRegex.test(trimmed)) {
    return { valid: false, error: "Please enter a valid email address." };
  }

  const [localPart, domain] = trimmed.split("@");

  // 3. Local part minimum length
  if (localPart.length < 2) {
    return { valid: false, error: "Email address is too short." };
  }

  // 4. Domain must have at least one dot and a real TLD (min 2 chars)
  const domainParts = domain.split(".");
  const tld = domainParts[domainParts.length - 1];
  if (domainParts.length < 2 || tld.length < 2) {
    return { valid: false, error: "Please enter a valid email domain." };
  }

  // 5. Disposable email check
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return {
      valid: false,
      error: "Temporary or disposable email addresses are not allowed. Please use your real email.",
    };
  }

  // 6. Known-fake domain check
  if (FAKE_DOMAINS.has(domain)) {
    return {
      valid: false,
      error: "Please use a real email address to create your account.",
    };
  }

  // 7. Obviously fake local-part check
  for (const pattern of FAKE_LOCAL_PATTERNS) {
    if (pattern.test(localPart)) {
      return {
        valid: false,
        error: "Please use your real email address.",
      };
    }
  }

  // 8. Local part shouldn't be pure numbers
  if (/^\d+$/.test(localPart)) {
    return {
      valid: false,
      error: "Please use a valid email address.",
    };
  }

  return { valid: true, error: "" };
}