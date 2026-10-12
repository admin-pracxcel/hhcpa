/**
 * The notice Google's terms require wherever the reCAPTCHA badge is hidden.
 *
 * The badge is hidden in globals.css because it floats bottom-right, on top
 * of the sticky mobile call bar. That is allowed only while this is on screen
 * in the form instead, so the two are a pair: delete this and the badge rule
 * has to come back.
 *
 * Deliberately plain and quiet. It is a legal notice, not a feature, and on a
 * page where a patient is deciding whether to give us their health
 * information it should not read like a warning about them.
 */

import { RECAPTCHA_NOTICE } from "@/lib/recaptcha";
import { cn } from "@/lib/utils";

export function RecaptchaNotice({ className }: { className?: string }) {
  return (
    <p className={cn("hhcp-recaptcha-notice font-dm-sans", className)}>
      <style>{`
.hhcp-recaptcha-notice {
  margin-top: 12px;
  font-size: 12px;
  line-height: 1.5;
  color: #526f68;
}

.hhcp-recaptcha-notice a {
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.hhcp-recaptcha-notice a:hover {
  color: var(--hhcp-primary, #013126);
}
      `}</style>
      {RECAPTCHA_NOTICE.before}
      <a
        href={RECAPTCHA_NOTICE.privacy.href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {RECAPTCHA_NOTICE.privacy.label}
      </a>
      {RECAPTCHA_NOTICE.between}
      <a
        href={RECAPTCHA_NOTICE.terms.href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {RECAPTCHA_NOTICE.terms.label}
      </a>
      {RECAPTCHA_NOTICE.after}
    </p>
  );
}
